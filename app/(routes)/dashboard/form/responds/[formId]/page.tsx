import React from "react";
import { fetchAllResponseByFormId } from "@/actions/form.action";
import { FormBlockInstance } from "@/@types/form-block.type";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarClock, ExternalLink, Inbox, Link as LinkIcon, MessageSquare } from "lucide-react";
import AllReponds from "../_components/AllReponds";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAppUrl } from "@/lib/app-url";

const Responds = async ({
  params,
}: {
  params: Promise<{ formId: string }>;
}) => {
  const { formId } = await params;
  const { form } = await fetchAllResponseByFormId(formId);

  if (!form) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-sm text-muted-foreground">
        Something went wrong. Please refresh the page.
      </div>
    );
  }
  const blocks = JSON.parse(form?.jsonBlocks) as FormBlockInstance[];
  const responses = form?.formResponses || [];
  const lastResponse = responses[0]?.createdAt;
  const appUrl = getAppUrl();

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                  form.published
                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600"
                    : "border-border/70 bg-muted text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    form.published ? "bg-emerald-500" : "bg-muted-foreground/50"
                  )}
                />
                {form.published ? "Live" : "Draft"}
              </span>
            </div>
            <h1 className="mt-2 truncate font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              {form.name || "Untitled form"}
            </h1>
            <p className="mt-2.5 text-sm text-muted-foreground">
              Every submission, newest first. Export anytime.
            </p>
          </div>

          {form.published ? (
            <Button asChild size="lg" className="gap-2 self-start md:self-auto">
              <a
                href={`${appUrl}/public/submit-form/${formId}`}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Open live form
              </a>
            </Button>
          ) : (
            <Button disabled size="lg" className="gap-2 self-start md:self-auto">
              <LinkIcon className="h-4 w-4" />
              Publish to share
            </Button>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-muted-foreground">
                Total responses
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {responses.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-muted-foreground">
                Form views
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-fuchsia-500/10 text-fuchsia-600">
                <Inbox className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {form.views}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-muted-foreground">
                Latest response
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-500/10 text-sky-600">
                <CalendarClock className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 truncate text-lg font-semibold tracking-tight">
              {lastResponse
                ? new Date(lastResponse).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>

        <AllReponds blocks={blocks} responses={responses} formId={formId} />
      </div>
    </main>
  );
};

export default Responds;
