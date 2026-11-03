"use client";
import React from "react";
import BuilderContextProvider from "@/context/builder-provider";
import { useBuilder } from "@/context/builder-provider";
import FormSettingsDetailed from "../../../_components/_common/FormSettingsDetailed";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const SettingsContent = () => {
  const { loading, formData } = useBuilder();

  if (loading) {
    return (
      <div className="h-full overflow-y-auto scrollbar bg-muted/30">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
          <Skeleton className="mb-10 h-4 w-32 rounded-md" />
          <Skeleton className="mb-3 h-10 w-64 rounded-lg" />
          <Skeleton className="mb-10 h-4 w-96 max-w-full rounded-md" />
          <div className="flex flex-col gap-6">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-border/70 bg-card p-8 shadow-soft"
              >
                <div className="mb-8 flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-40 rounded-md" />
                    <Skeleton className="h-3 w-56 rounded-md" />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-11 w-36 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar bg-muted/30">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-3 mb-8 rounded-lg text-muted-foreground hover:text-foreground"
        >
          <Link
            href={`/dashboard/form/builder/${formData?.formId}`}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to builder
          </Link>
        </Button>

        <div className="mb-8 flex flex-col gap-6 sm:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Form configuration
            </p>
            <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              Settings
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Fine-tune your form&apos;s identity, appearance, and submission
              rules. Changes apply to your public form instantly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                formData?.published
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-border bg-muted text-muted-foreground"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  formData?.published
                    ? "animate-pulse bg-emerald-500"
                    : "bg-muted-foreground/60"
                }`}
              />
              {formData?.published ? "Live & accepting responses" : "Draft mode"}
            </span>

            {formData?.published && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 rounded-full"
              >
                <a
                  href={`/public/submit-form/${formData.formId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5"
                >
                  Open form
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="h-px w-full bg-border/70" />

        <div className="pt-8 sm:pt-10">
          <FormSettingsDetailed />
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  return (
    <BuilderContextProvider>
      <SettingsContent />
    </BuilderContextProvider>
  );
};

export default Settings;
