import { z } from "zod";
import { isSafeWebhookUrl } from "@/lib/security";

export const createFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters"),
});

export const saveFormSchema = z.object({
  formId: z.string().min(1, "Form ID is required"),
  name: z.string().max(100, "Name must be less than 100 characters").optional(),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  jsonBlocks: z.string().max(100000, "Form layout is too large").refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, {
    message: "Invalid JSON format for form layout",
  }),
});

export const submitResponseSchema = z.object({
  formId: z.string().min(1, "Form ID is required").max(100, "Invalid form ID"),
  turnstileToken: z.string().optional(),
  response: z.string().max(100000, "Response is too large").refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, {
    message: "Invalid JSON format for response",
  }),
});

export const updateFormSettingsSchema = z.object({
  formId: z.string().min(1, "Form ID is required").max(100, "Invalid form ID"),
  primaryColor: z.string().max(50).optional(),
  backgroundColor: z.string().max(50).optional(),
  bannerImage: z.string().max(10000).optional(),
  webhookUrl: z
    .union([
      z.literal(""),
      z
        .string()
        .url("Invalid Webhook URL")
        .refine(
          isSafeWebhookUrl,
          "Webhook URL must point to a public http(s) endpoint"
        ),
    ])
    .optional(),
  maxResponses: z
    .number()
    .int("Maximum responses must be a whole number")
    .min(1, "Maximum responses must be at least 1")
    .max(1_000_000, "Maximum responses is too large")
    .optional()
    .nullable(),
  expiryDate: z
    .string()
    .refine(
      (value) => value === "" || !Number.isNaN(Date.parse(value)),
      "Invalid expiration date"
    )
    .optional()
    .nullable(),
});
