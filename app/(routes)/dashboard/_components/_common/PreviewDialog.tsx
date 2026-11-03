"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { defaultBackgroundColor } from "@/constant";
import { useBuilder } from "@/context/builder-provider";
import { FormBlocks } from "@/lib/form-blocks";
import Image from "next/image";

const PreviewDialog = () => {
  const { blockLayouts, formData } = useBuilder();
  const [formValues, setFormValues] = React.useState<Record<string, string>>({});

  const handleBlur = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3">
          <Eye className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Preview</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="fixed left-0 top-0 z-[9999] flex h-full max-h-full w-full max-w-full translate-x-0 translate-y-0 flex-col gap-0 border-none p-0">
        <DialogHeader className="sticky top-0 z-[10000] flex w-full flex-row items-center justify-between space-y-0 border-b border-border/60 bg-background/90 px-5 py-3.5 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live preview
            </span>
            <DialogTitle className="hidden text-sm font-medium text-muted-foreground sm:block">
              {formData?.name || "Untitled form"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Preview of your form as visitors will see it.
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button size="sm" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to builder
            </Button>
          </DialogClose>
        </DialogHeader>

        <div
          className="scrollbar h-full w-full overflow-y-auto"
          style={{ backgroundColor: defaultBackgroundColor }}
        >
          <div className="mx-auto w-full max-w-[650px] px-4 py-6">
            <div className="relative mb-4 h-[160px] w-full overflow-hidden rounded-2xl border border-border/60 shadow-soft sm:h-[180px]">
              <Image
                src={
                  (formData?.settings as any)?.bannerImage ||
                  (formData?.settings as any)?.bannerimage ||
                  "/images/form-bg.jpg"
                }
                alt="Form banner"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                unoptimized
                className="object-cover"
              />
            </div>

            {blockLayouts.length > 0 && (
              <div className="flex w-full flex-col gap-4">
                {blockLayouts.map((block) => {
                  const FormBlockComponent =
                    FormBlocks[block.blockType].formComponent;
                  return (
                    <FormBlockComponent
                      key={block.id}
                      blockInstance={block}
                      handleBlur={handleBlur}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
