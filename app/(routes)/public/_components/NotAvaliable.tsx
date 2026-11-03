import { Button } from "@/components/ui/button";
import { Link2Off } from "lucide-react";
import React from "react";
import Logo from "@/components/logo";
import Link from "next/link";

const NotAvaliable = ({
  title = "This form is no longer available",
  message = "The form has been unpublished, reached its response limit, or expired. If you followed a link, ask the owner for a new one.",
}: {
  title?: string;
  message?: string;
}) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-border/70 bg-card text-primary shadow-soft">
          <Link2Off className="h-7 w-7" />
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Form unavailable
        </p>

        <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>

        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {message}
        </p>

        <Button asChild size="lg" className="mt-8 h-11 rounded-xl px-7">
          <Link href="/">Explore Formy</Link>
        </Button>

        <div className="mt-12 flex flex-col items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/50">
            Powered by
          </span>
          <Logo url="/" compact />
        </div>
      </div>
    </div>
  );
};

export default NotAvaliable;
