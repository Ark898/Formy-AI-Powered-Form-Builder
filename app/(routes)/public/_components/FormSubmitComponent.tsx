"use client";
import React, { useState } from "react";
import { FormBlockInstance } from "@/@types/form-block.type";
import { Button } from "@/components/ui/button";
import { FormBlocks } from "@/lib/form-blocks";
import { ArrowRight, Check, Loader, ShieldCheck, Sparkles } from "lucide-react";
import Logo from "@/components/logo";
import { toast } from "@/hooks/use-toast";
import { submitResponse } from "@/actions/form.action";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const inputBlockTypes = [
  "TextField",
  "TextArea",
  "RadioSelect",
  "StarRating",
  "Checkbox",
  "Select",
  "DatePicker",
];

const FormSubmitComponent = (props: {
  formId: string;
  blocks: FormBlockInstance[];
  bannerImage?: string;
  primaryColor?: string;
  backgroundColor?: string;
}) => {
  const { formId, blocks, bannerImage, primaryColor, backgroundColor } = props;

  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setSubmitted] = useState<boolean>(false);

  const accent = primaryColor || undefined;

  // Validate all fields
  const validateFields = () => {
    const errors: { [key: string]: string } = {};

    const checkRequired = (blockList: FormBlockInstance[]) => {
      blockList.forEach((block) => {
        if (!block) return;
        const required = block.attributes?.required;
        const blockValue = formValues?.[block.id]?.trim();

        if (
          inputBlockTypes.includes(block.blockType) &&
          required &&
          (!blockValue || blockValue.trim() === "")
        ) {
          errors[block.id] = "This field is required";
        }

        if (block.childblocks && block.childblocks.length > 0) {
          checkRequired(block.childblocks);
        }
      });
    };

    checkRequired(blocks);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));

    if (formErrors[key] && value?.trim() !== "") {
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[key];
        return updatedErrors;
      });
    }
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (!validateFields()) {
      toast({
        title: "Almost there",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const visibleValues: Record<string, string> = {};
      const collectValues = (blockList: FormBlockInstance[]) => {
        blockList.forEach((block) => {
          if (!block) return;
          if (inputBlockTypes.includes(block.blockType)) {
            visibleValues[block.id] = formValues[block.id] || "";
          }
          if (block.childblocks && block.childblocks.length > 0) {
            collectValues(block.childblocks);
          }
        });
      };
      collectValues(blocks);
      const responseJson = JSON.stringify(visibleValues);
      const response = await submitResponse(formId, responseJson);
      if (response.success) {
        setSubmitted(true);
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormValues({});
    setFormErrors({});
    setSubmitted(false);
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-y-auto scrollbar transition-all duration-300"
      style={{ backgroundColor: backgroundColor || "inherit" }}
    >
      {/* soft ambient texture */}
      <div className="pointer-events-none fixed inset-0 bg-dots opacity-40" />

      <div className="relative mx-auto w-full max-w-[680px] px-4 pb-16 pt-6 sm:pt-10">
        <div className="relative mb-4 w-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-soft sm:mb-5">
          <div className="relative h-[150px] w-full sm:h-[200px]">
            <Image
              src={bannerImage || "/images/form-bg.jpg"}
              alt="Form banner"
              fill
              sizes="(max-width: 768px) 100vw, 680px"
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full"
        >
          {isSubmitted ? (
            <Card className="w-full overflow-hidden rounded-2xl border-border/60 bg-white shadow-lift">
              <CardContent className="px-6 py-12 text-center sm:px-10 sm:py-14">
                <div
                  className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-primary text-white shadow-soft"
                  style={accent ? { backgroundColor: accent } : undefined}
                >
                  <Check className="h-7 w-7" strokeWidth={2.5} />
                </div>
                <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
                  Thank you!
                </h1>
                <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Your response has been recorded. We appreciate you taking the
                  time to share this with us.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button
                    onClick={resetForm}
                    className="h-11 w-full rounded-xl px-6 text-sm font-semibold text-white sm:w-auto"
                    style={accent ? { backgroundColor: accent } : undefined}
                  >
                    Submit another response
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Link
                    href="/"
                    className="inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Back to Formy
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : blocks.length > 0 ? (
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
              {blocks.map((block) => {
                const FormBlockComponent =
                  FormBlocks[block.blockType].formComponent;

                return (
                  <FormBlockComponent
                    key={block.id}
                    blockInstance={block}
                    handleBlur={handleBlur}
                    formErrors={formErrors}
                  />
                );
              })}

              <div className="mt-2 flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  style={accent ? { backgroundColor: accent, color: "white" } : undefined}
                  className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white shadow-soft transition-all hover:opacity-95 active:scale-[0.995]"
                >
                  {isLoading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Submitting..." : "Submit response"}
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-foreground/50">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Your answers are sent securely and only shared with the form
                  owner.
                </p>
              </div>
            </form>
          ) : (
            <Card className="w-full rounded-2xl border-border/60 bg-white p-10 text-center shadow-soft">
              <p className="text-sm text-muted-foreground">
                This form doesn&apos;t have any questions yet.
              </p>
            </Card>
          )}
        </motion.div>

        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <p className="text-xs text-foreground/40">
            Never submit passwords through Formy.ai.
          </p>
          <Logo url="/" color="!text-foreground/60" />
        </div>
      </div>
    </div>
  );
};

export default FormSubmitComponent;
