"use server";

import { FormWithSettings } from "@/@types/form.type";
import { defaultBackgroundColor, defaultPrimaryColor } from "@/constant";
import { generateUniqueId } from "@/lib/helper";
import { prisma } from "@/lib/prismadb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { headers } from "next/headers";
import { revalidateTag, unstable_cache } from "next/cache";
import { checkFormCreationRateLimit, checkFormResponseRateLimit } from "@/lib/rate-limit";
import { createFormSchema, saveFormSchema, submitResponseSchema, updateFormSettingsSchema } from "@/lib/validations";
import { escapeHtml } from "@/lib/security";
import { getSafeWebhookUrl } from "@/lib/webhook-safety";
import { getAppUrl } from "@/lib/app-url";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function fetchFormStats() {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    const { _sum, _count } = await prisma.form.aggregate({
      where: { userId: user.id },
      _sum: {
        views: true,
        responses: true,
      },
      _count: {
        id: true,
      },
    });

    const views = _sum.views ?? 0;
    const totalResponses = _sum.responses ?? 0;
    const totalForms = _count?.id ?? 0;

    const conversionRate = views > 0 ? (totalResponses / views) * 100 : 0;
    const engagementRate =
      totalForms > 0 ? (totalResponses / totalForms) * 100 : 0;

    return {
      success: true,
      views,
      totalForms,
      totalResponses,
      conversionRate,
      engagementRate,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function createForm(data: { name: string; description: string }) {
  try {
    const parsedData = createFormSchema.safeParse(data);
    if (!parsedData.success) {
      return { success: false, message: parsedData.error.issues[0].message };
    }
    const session = getKindeServerSession();
    const user = await session.getUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    const rateLimit = await checkFormCreationRateLimit(user.id);
    if (!rateLimit.success) {
      return {
        success: false,
        message: "Rate limit exceeded. Please wait an hour before creating more forms.",
      };
    }

    const jsonBlocks = JSON.stringify([
      {
        id: generateUniqueId(),
        blockType: "RowLayout",
        attributes: {},
        isLocked: true,
        childblocks: [
          {
            id: generateUniqueId(),
            blockType: "Heading",
            attributes: {
              label: data.name || "Untitled form",
              level: 1,
              fontSize: "4x-large",
              fontWeight: "normal",
            },
          },
          {
            id: generateUniqueId(),
            blockType: "Paragraph",
            attributes: {
              label: "Paragraph",
              text: data.description || "Add a description here.",
              fontSize: "small",
              fontWeight: "normal",
            },
          },
        ],
      },
    ]);

    const formSettings = await prisma.formSettings.create({
      data: {
        primaryColor: defaultPrimaryColor,
        backgroundColor: defaultBackgroundColor,
      },
    });

    const form = await prisma.form.create({
      data: {
        name: data.name,
        description: data.description,
        userId: user.id,
        creatorName: user?.given_name || "",
        settingsId: formSettings.id,
        jsonBlocks,
      },
    });

    if (user?.email) {
      try {
        await prisma.$executeRawUnsafe(
          `UPDATE "Form" SET "creatorEmail" = $1 WHERE "id" = $2`,
          user.email,
          form.id
        );
      } catch (e) {
        console.error("Failed to store creatorEmail:", e);
      }
    }

    if (!form) {
      return {
        success: false,
        message: "Could not create form, please try again",
      };
    }

    return {
      success: true,
      message: "Form created successfully",
      form,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function fetchAllForms() {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    const form = await prisma.form.findMany({
      where: {
        userId: user.id,
      },
      include: {
        settings: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (user?.email) {
      try {
        await prisma.$executeRawUnsafe(
          `UPDATE "Form" SET "creatorEmail" = $1 WHERE "userId" = $2 AND "creatorEmail" IS NULL`,
          user.email,
          user.id
        );
      } catch (e) {
        console.error("Failed to backfill creatorEmail:", e);
      }
    }

    return {
      success: true,
      message: "Form fetched successfully",
      form,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function fetchBuilderFormById(
  formId: string
): Promise<{ success: boolean; message: string; form?: FormWithSettings }> {
  if (!formId) {
    return {
      success: false,
      message: "FormId is required",
    };
  }

  const session = getKindeServerSession();
  const user = await session.getUser();

  if (!user) {
    return {
      success: false,
      message: "Unauthorized to use this resource",
    };
  }

  const form = await prisma.form.findFirst({
    where: {
      formId,
      userId: user.id,
    },
    include: {
      settings: true,
    },
  });

  if (!form) {
    return {
      success: false,
      message: "Form not found",
    };
  }

  return {
    success: true,
    message: "Form fetched successfully",
    form,
  };
}

export async function saveForm(data: {
  formId: string;
  name?: string;
  description?: string;
  jsonBlocks: string;
}) {
  try {
    const parsedData = saveFormSchema.safeParse(data);
    if (!parsedData.success) {
      return { success: false, message: parsedData.error.issues[0].message };
    }
    const { formId, name, description, jsonBlocks } = parsedData.data;
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    if (!formId || !jsonBlocks) {
      return {
        success: false,
        message: "Invalid input data",
      };
    }

    const existingForm = await prisma.form.findUnique({ where: { formId } });
    if (!existingForm || existingForm.userId !== user.id) {
      return {
        success: false,
        message: "Form not found or unauthorized",
      };
    }

    const form = await prisma.form.update({
      where: { formId: formId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        jsonBlocks,
      },
    });

    revalidateTag(`form-${formId}`);

    return {
      success: true,
      message: "Form updated successfully",
      form,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while updating the form",
    };
  }
}

export async function updatePublish(formId: string, published: boolean) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    if (!formId) {
      return {
        success: false,
        message: "FormId is required",
      };
    }

    const existingForm = await prisma.form.findUnique({ where: { formId } });
    if (!existingForm || existingForm.userId !== user.id) {
      return {
        success: false,
        message: "Form not found or unauthorized",
      };
    }

    const form = await prisma.form.update({
      where: { formId },
      data: { published },
    });

    revalidateTag(`form-${formId}`);

    return {
      success: true,
      message: `Form successfully ${published ? "published" : "unpublished"}`,
      published: form.published,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update publish status",
    };
  }
}

export async function fetchPublishFormById(formId: string): Promise<{
  form?: FormWithSettings | null;
  success: boolean;
  message: string;
}> {
  try {
    if (!formId) {
      return {
        success: false,
        message: "FormId is required",
      };
    }

    const getCachedForm = unstable_cache(
      async (id: string) => {
        const form = await prisma.form.findFirst({
          where: {
            formId: id,
            published: true,
          },
          include: {
            settings: true,
          },
        });

        if (!form) {
          return null;
        }

        // Workaround for Prisma Client generation issues on Windows
        const rawSettings: any[] = await prisma.$queryRawUnsafe(
          `SELECT "bannerImage", "webhookUrl", "maxResponses", "expiryDate" FROM "FormSettings" WHERE "id" = $1`,
          form.settingsId
        );

        if (rawSettings && rawSettings.length > 0) {
          const banner = rawSettings[0].bannerImage || rawSettings[0].bannerimage;
          const webhook = rawSettings[0].webhookUrl || rawSettings[0].webhookurl;
          const maxResponses = rawSettings[0].maxResponses !== undefined ? rawSettings[0].maxResponses : rawSettings[0].maxresponses;
          const expiryDate = rawSettings[0].expiryDate || rawSettings[0].expirydate;

          if (banner !== undefined) {
            (form.settings as any).bannerImage = banner;
          }
          if (webhook !== undefined) {
            (form.settings as any).webhookUrl = webhook;
          }
          if (maxResponses !== undefined) {
            (form.settings as any).maxResponses = maxResponses;
          }
          if (expiryDate !== undefined) {
            (form.settings as any).expiryDate = expiryDate;
          }
        }

        return form as FormWithSettings;
      },
      [`form-${formId}`],
      { tags: [`form-${formId}`], revalidate: 3600 }
    );

    const form = await getCachedForm(formId);

    if (!form) {
      return {
        success: false,
        message: "Form not found",
      };
    }

    const realFormState: any[] = await prisma.$queryRawUnsafe(
      `SELECT f."responses", s."maxResponses", s."expiryDate" 
       FROM "Form" f 
       JOIN "FormSettings" s ON f."settingsId" = s."id" 
       WHERE f."formId" = $1`,
      formId
    );

    if (realFormState && realFormState.length > 0) {
      const responses = realFormState[0].responses !== undefined ? realFormState[0].responses : realFormState[0].responses;
      const maxResponses = realFormState[0].maxResponses !== undefined ? realFormState[0].maxResponses : realFormState[0].maxresponses;
      const expiryDate = realFormState[0].expiryDate || realFormState[0].expirydate;

      if (maxResponses && responses >= maxResponses) {
        return {
          success: false,
          message: "This form has reached its maximum response limit and is now closed.",
        };
      }

      if (expiryDate && new Date() > new Date(expiryDate)) {
        return {
          success: false,
          message: "This form has passed its expiration date and is no longer accepting submissions.",
        };
      }
    }

    return {
      success: true,
      message: "Form fetched successfully",
      form,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function submitResponse(formId: string, response: string) {
  try {
    const parsedData = submitResponseSchema.safeParse({ formId, response });
    if (!parsedData.success) {
      return { success: false, message: parsedData.error.issues[0].message };
    }

    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for") || "";
    const ip =
      forwardedFor.split(",")[0]?.trim() ||
      headerList.get("x-real-ip")?.trim() ||
      "unknown";

    const rateLimit = await checkFormResponseRateLimit(`${formId}:${ip}`);
    if (!rateLimit.success) {
      return {
        success: false,
        message: "Rate limit exceeded. Please wait a minute before submitting again.",
      };
    }

    const targetForm = await prisma.form.findUnique({
      where: { formId, published: true },
      include: { settings: true },
    });

    if (!targetForm) {
      return { success: false, message: "Form not found or unavailable." };
    }

    const rawSettingsData: any[] = await prisma.$queryRawUnsafe(
      `SELECT "maxResponses", "expiryDate" FROM "FormSettings" WHERE "id" = $1`,
      targetForm.settingsId
    );

    if (rawSettingsData && rawSettingsData.length > 0) {
      const maxResponses = rawSettingsData[0].maxResponses !== undefined ? rawSettingsData[0].maxResponses : rawSettingsData[0].maxresponses;
      const expiryDate = rawSettingsData[0].expiryDate || rawSettingsData[0].expirydate;

      if (maxResponses && targetForm.responses >= maxResponses) {
        return {
          success: false,
          message: "This form has reached its response limit and is no longer accepting answers.",
        };
      }

      if (expiryDate && new Date() > new Date(expiryDate)) {
        return {
          success: false,
          message: "This form has expired.",
        };
      }
    }

    const updatedForm = await prisma.form.update({
      where: {
        formId: formId,
        published: true,
      },
      data: {
        formResponses: {
          create: {
            jsonReponse: response,
          },
        },
        responses: {
          increment: 1,
        },
      },
      include: {
        settings: true,
      },
    });

    // Trigger webhook if URL is present
    try {
      const rawSettings: any[] = await prisma.$queryRawUnsafe(
        `SELECT "webhookUrl" FROM "FormSettings" WHERE "id" = $1`,
        updatedForm.settingsId
      );
      let webhookUrlValue = null;
      if (rawSettings && rawSettings.length > 0) {
        webhookUrlValue = rawSettings[0].webhookUrl || rawSettings[0].webhookurl;
      }

      if (webhookUrlValue) {
        const safeWebhookUrl = await getSafeWebhookUrl(String(webhookUrlValue));

        if (!safeWebhookUrl) {
          console.warn(
            "Blocked webhook delivery to a non-public or private address."
          );
        } else {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);

          // Fire and forget
          fetch(safeWebhookUrl.toString(), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: response,
            redirect: "manual",
            signal: controller.signal,
          })
            .catch((e) =>
              console.error(
                "Webhook execution failed:",
                e?.name === "AbortError" ? "request timed out" : "request failed"
              )
            )
            .finally(() => clearTimeout(timeout));
        }
      }
    } catch (e) {
      console.error("Failed to initiate webhook request:", e);
    }

    // Trigger email notification via Resend
    try {
      const rawForm: any[] = await prisma.$queryRawUnsafe(
        `SELECT "creatorEmail" FROM "Form" WHERE "id" = $1`,
        updatedForm.id
      );
      
      let creatorEmailValue = null;
      if (rawForm && rawForm.length > 0) {
        creatorEmailValue = rawForm[0].creatorEmail || rawForm[0].creatoremail;
      }

      if (creatorEmailValue && resend) {
        const appUrl = getAppUrl();
        const formName = String(updatedForm.name || "Untitled form");
        const safeFormName = escapeHtml(formName);
        const subjectFormName = formName.replace(/[\r\n]+/g, " ").slice(0, 100);

        resend.emails.send({
          from:
            process.env.RESEND_FROM_EMAIL ||
            "Formy.ai <onboarding@resend.dev>",
          to: creatorEmailValue,
          subject: `New Response Received for ${subjectFormName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h2 style="color: #111827; margin-bottom: 10px;">Formy.ai Notification</h2>
              <p style="font-size: 16px; color: #374151;">Hello,</p>
              <p style="font-size: 16px; color: #374151;">You have received a new response for your form: <strong>${safeFormName}</strong>.</p>
              <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 6px;">
                <p style="margin: 0; font-size: 14px; color: #4b5563;">A new user submitted their answers. Access your records directly.</p>
                <a href="${escapeHtml(appUrl)}/dashboard" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: 500; margin-top: 15px;">Go to Dashboard</a>
              </div>
              <p style="font-size: 14px; color: #9ca3af; margin-top: 30px;">Best,<br>The Formy.ai Automated Engine</p>
            </div>
          `,
        }).catch((emailError) => console.error("Resend delivery failed:", emailError));
      }
    } catch (e) {
      console.error("Failed to trigger email notification:", e);
    }

    return {
      success: true,
      message: "Response submitted",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function fetchAllResponseByFormId(formId: string, page: number = 1, limit: number = 20) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    if (typeof formId !== "string" || formId.length === 0 || formId.length > 100) {
      return {
        success: false,
        message: "Invalid form ID",
      };
    }

    const safePage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
    const safeLimit = Number.isFinite(limit)
      ? Math.min(100, Math.max(1, Math.floor(limit)))
      : 20;

    const form = await prisma.form.findFirst({
      where: {
        formId: formId,
        userId: user.id,
      },
      include: {
        formResponses: {
          orderBy: {
            createdAt: "desc",
          },
          take: safeLimit,
          skip: (safePage - 1) * safeLimit,
        },
      },
    });

    return {
      success: true,
      message: "Form fetched successfully",
      form,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
export async function updateFormSettings(data: {
  formId: string;
  primaryColor?: string;
  backgroundColor?: string;
  bannerImage?: string;
  webhookUrl?: string;
  maxResponses?: number | null;
  expiryDate?: string | null;
}) {
  try {
    const parsedData = updateFormSettingsSchema.safeParse(data);
    if (!parsedData.success) {
      return { success: false, message: parsedData.error.issues[0].message };
    }
    const { formId, primaryColor, backgroundColor, bannerImage, webhookUrl, maxResponses, expiryDate } = parsedData.data;
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    const form = await prisma.form.findUnique({
      where: { formId },
      include: { settings: true },
    });

    if (!form || form.userId !== user.id) {
      return {
        success: false,
        message: "Form not found or unauthorized",
      };
    }

    // Use raw query for bannerImage to bypass Prisma Client validation error 
    // when the client hasn't been re-generated due to file locks on Windows
    if (bannerImage !== undefined) {
      await prisma.$executeRawUnsafe(
        `UPDATE "FormSettings" SET "bannerImage" = $1 WHERE "id" = $2`,
        bannerImage,
        form.settingsId
      );
    }

    if (webhookUrl !== undefined) {
      await prisma.$executeRawUnsafe(
        `UPDATE "FormSettings" SET "webhookUrl" = $1 WHERE "id" = $2`,
        webhookUrl || null,
        form.settingsId
      );
    }

    if (maxResponses !== undefined) {
      await prisma.$executeRawUnsafe(
        `UPDATE "FormSettings" SET "maxResponses" = $1 WHERE "id" = $2`,
        maxResponses === null ? null : parseInt(String(maxResponses)),
        form.settingsId
      );
    }

    if (expiryDate !== undefined) {
      await prisma.$executeRawUnsafe(
        `UPDATE "FormSettings" SET "expiryDate" = $1 WHERE "id" = $2`,
        expiryDate === null || expiryDate === "" ? null : new Date(expiryDate),
        form.settingsId
      );
    }

    const updatedSettings = await prisma.formSettings.update({
      where: { id: form.settingsId },
      data: {
        ...(primaryColor && { primaryColor }),
        ...(backgroundColor && { backgroundColor }),
      },
    });

    revalidateTag(`form-${formId}`);

    return {
      success: true,
      message: "Settings updated successfully",
      settings: updatedSettings,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while updating the settings",
    };
  }
}

export async function deleteForm(formId: string) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    const form = await prisma.form.findFirst({
      where: { formId, userId: user.id },
    });

    if (!form) {
      return {
        success: false,
        message: "Form not found or you don't have permission to delete it",
      };
    }

    // Delete associated responses first to avoid foreign key violation
    await prisma.formResponses.deleteMany({
      where: { formId: form.id },
    });

    // Delete associated settings if they are not shared (assumed 1-to-1)
    await prisma.form.delete({
      where: { formId },
    });

    // Optionally delete settings - if shared, this might be tricky, 
    // but in this app schema, they seem unique to each form.
    await prisma.formSettings.delete({
      where: { id: form.settingsId },
    });

    revalidateTag(`form-${formId}`);

    return {
      success: true,
      message: "Form deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while deleting the form",
    };
  }
}

export async function exportAllResponsesByFormId(formId: string) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized to use this resource" };
    }

    const form = await prisma.form.findFirst({
      where: { formId, userId: user.id },
      include: {
        formResponses: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!form) return { success: false, message: "Form not found" };

    return { success: true, responses: form.formResponses, jsonBlocks: form.jsonBlocks };
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
}
