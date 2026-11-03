"use client";

import {
  BarChart3,
  Check,
  Copy,
  GripVertical,
  Link2,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

function FeatureCard({
  icon: Icon,
  title,
  description,
  children,
  className,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift",
        className
      )}
    >
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-bold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {children}
    </motion.div>
  );
}

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Everything included"
          title={
            <>
              Features that give you{" "}
              <span className="font-display italic text-gradient">superpowers</span>
            </>
          }
          description="Everything you need to design, publish, and learn from your forms — in one calm, fast workspace."
          className="mx-auto mb-14"
        />

        <div className="grid gap-4 md:grid-cols-3 md:auto-rows-[minmax(190px,auto)]">
          {/* AI feature — hero tile */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-card to-card p-7 shadow-soft transition-all duration-300 hover:border-primary/40 hover:shadow-lift md:col-span-2 md:row-span-2 md:p-9"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
            <div className="relative flex flex-1 flex-col">
              <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                AI form engine
              </span>
              <h3 className="max-w-md text-2xl font-extrabold tracking-tight md:text-3xl">
                Describe it once. Ship a form that feels designed.
              </h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                Our AI reads your intent, then builds the fields, validation, layout,
                and copy — so you can move from idea to live form in seconds.
              </p>

              <div className="relative mt-7 overflow-hidden rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm backdrop-blur">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                    <Wand2 className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-sm font-medium leading-relaxed">
                    &ldquo;Customer feedback form with NPS, an optional follow-up note, and a
                    formal tone.&rdquo;
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Name", "Email", "NPS 1–10", "Follow-up", "Thank you page"].map(
                    (chip, index) => (
                      <motion.span
                        key={chip}
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.08 }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1.5 text-xs font-medium text-foreground shadow-[0_1px_1px_rgba(16,16,40,0.04)]"
                      >
                        <Check className="h-3 w-3 text-emerald-500" />
                        {chip}
                      </motion.span>
                    )
                  )}
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    Generated in 4.2s
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <FeatureCard
            icon={GripVertical}
            title="Drag & drop builder"
            description="Rearrange fields, layouts, and columns with an editor that simply stays out of your way."
            delay={0.05}
          >
            <div className="mt-auto space-y-1.5 pt-5">
              {["Heading", "Email field", "Rating"].map((row, index) => (
                <div
                  key={row}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border bg-background/70 px-2.5 py-1.5 text-[11px] text-muted-foreground shadow-[0_1px_1px_rgba(16,16,40,0.03)] transition-transform group-hover:translate-x-0.5",
                    index === 1
                      ? "border-primary/30 bg-primary/5 text-foreground ring-1 ring-primary/10"
                      : "border-border/70"
                  )}
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  <GripVertical className="h-3 w-3 text-muted-foreground/50" />
                  {row}
                  {index === 1 && (
                    <span className="ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                      selected
                    </span>
                  )}
                </div>
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            icon={BarChart3}
            title="Analytics & insights"
            description="Views, completions, and drop-off — measured in real time."
            delay={0.1}
          >
            <div className="mt-auto flex h-16 items-end gap-1.5 pt-5">
              {[32, 48, 38, 62, 54, 78, 92].map((height, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex-1 rounded-t-md transition-all duration-500",
                    index === 6
                      ? "bg-primary"
                      : "bg-primary/20 group-hover:bg-primary/35"
                  )}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Link2}
            title="Share anywhere"
            description="A link, an embed, a QR code. Your form, wherever your audience is."
            delay={0.15}
          >
            <div className="mt-auto space-y-2 pt-5">
              <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background px-2.5 py-2 text-[11px] text-muted-foreground">
                <Link2 className="h-3 w-3 shrink-0 text-primary" />
                <span className="truncate">formy.ai/f/customer-feedback</span>
                <Copy className="ml-auto h-3 w-3 shrink-0" />
              </div>
              <div className="flex gap-1.5">
                {["Website", "Email", "QR code"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={ShieldCheck}
            title="Enterprise security"
            description="Encrypted at rest and in transit, with GDPR-friendly defaults built in."
            delay={0.2}
          >
            <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
              {[
                { label: "SOC 2", icon: ShieldCheck },
                { label: "GDPR", icon: Lock },
                { label: "SSL", icon: Lock },
              ].map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-background px-2 py-1 text-[10px] font-semibold text-muted-foreground"
                >
                  <badge.icon className="h-3 w-3 text-emerald-500" />
                  {badge.label}
                </span>
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Users}
            title="Team collaboration"
            description="Invite your team, share drafts, and keep every form on brand."
            delay={0.25}
          >
            <div className="mt-auto flex items-center justify-between pt-5">
              <div className="flex -space-x-2">
                {["AF", "BS", "CD"].map((initials, index) => (
                  <span
                    key={initials}
                    className={cn(
                      "grid h-7 w-7 place-items-center rounded-full border-2 border-card text-[9px] font-bold text-white",
                      ["bg-violet-500", "bg-sky-500", "bg-rose-500"][index]
                    )}
                  >
                    {initials}
                  </span>
                ))}
                <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-muted text-[9px] font-bold text-muted-foreground">
                  +5
                </span>
              </div>
              <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                All up to date
              </span>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
