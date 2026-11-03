"use client";

import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  AlignLeft,
  ArrowRight,
  Blocks,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDot,
  Eye,
  Mail,
  MousePointer2,
  Play,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Star,
  Type,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const paletteItems = [
  { icon: Type, label: "Text" },
  { icon: Mail, label: "Email" },
  { icon: AlignLeft, label: "Long text" },
  { icon: CircleDot, label: "Select" },
  { icon: Star, label: "Rating" },
  { icon: CalendarDays, label: "Date" },
];

const AvatarStack = () => (
  <div className="flex -space-x-2.5">
    {[
      "from-violet-500 to-fuchsia-500",
      "from-sky-500 to-cyan-400",
      "from-amber-400 to-orange-500",
      "from-emerald-500 to-teal-400",
    ].map((gradient, index) => (
      <span
        key={index}
        className={`grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-gradient-to-br ${gradient} text-[10px] font-bold text-white`}
      >
        {["AF", "BS", "CD", "DP"][index]}
      </span>
    ))}
  </div>
);

const HeroSection = () => {
  return (
    <section id="hero" className="relative overflow-hidden pb-16 pt-14 md:pb-24 md:pt-20">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-[0.35] dark:opacity-20" />
        <div className="absolute -top-32 left-1/2 h-[560px] w-[820px] -translate-x-1/2 rounded-full bg-primary/25 blur-[140px] animate-aurora dark:bg-primary/20" />
        <div className="absolute -right-40 top-40 h-[380px] w-[380px] rounded-full bg-fuchsia-400/20 blur-[120px]" />
        <div className="absolute -left-32 top-64 h-[320px] w-[320px] rounded-full bg-sky-400/15 blur-[110px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-7"
          >
            <Link
              href="#features"
              className="group inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-card/80 py-1.5 pl-1.5 pr-4 text-sm shadow-sm backdrop-blur transition-all hover:border-primary/40 hover:shadow-md"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
                <Sparkles className="h-3 w-3" />
                New
              </span>
              <span className="font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                Meet the AI form engine
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-balance text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[80px]"
          >
            Beautiful forms.
            <br />
            <span className="font-display text-[1.08em] font-normal italic tracking-[-0.02em] text-gradient">
              Built in seconds.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Describe what you need and Formy designs a polished, ready-to-share
            form — fields, logic, and styling included. No code required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
          >
            <Button size="xl" className="w-full sm:w-auto" asChild>
              <RegisterLink>
                Start building free
                <ArrowRight className="h-4 w-4" />
              </RegisterLink>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="w-full bg-card/70 backdrop-blur hover:bg-card sm:w-auto"
              asChild
            >
              <Link href="#how-it-works" className="flex items-center gap-2.5">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary">
                  <Play className="h-3 w-3 fill-current" />
                </span>
                See how it works
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
          >
            <AvatarStack />
            <div className="flex flex-col items-center text-sm sm:items-start">
              <span className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-current" />
                ))}
                <span className="ml-1.5 text-xs font-semibold text-foreground">4.9/5</span>
              </span>
              <span className="text-xs text-muted-foreground">
                Loved by 10,000+ builders. No credit card required.
              </span>
            </div>
          </motion.div>
        </div>

        {/* Product preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-16 max-w-5xl md:mt-20"
        >
          <div className="absolute -inset-x-10 -bottom-10 top-24 -z-10 rounded-[48px] bg-gradient-to-r from-primary/25 via-fuchsia-500/20 to-sky-500/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-[26px] border border-border/80 bg-card p-1.5 shadow-[0_40px_120px_-40px_rgba(24,16,64,0.45)] sm:p-2">
            <div className="overflow-hidden rounded-[20px] border border-border/70 bg-background">
              {/* Browser bar */}
              <div className="flex items-center gap-3 border-b border-border/70 bg-card/80 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="mx-auto flex w-full max-w-[280px] items-center justify-center gap-1.5 rounded-md border border-border/70 bg-background/80 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  formy.ai/dashboard
                </div>
                <div className="hidden items-center gap-1.5 sm:flex">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-muted text-muted-foreground">
                    <Eye className="h-3 w-3" />
                  </span>
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-muted text-muted-foreground">
                    <Settings2 className="h-3 w-3" />
                  </span>
                </div>
              </div>

              <div className="flex h-[380px] sm:h-[430px]">
                {/* Mini rail */}
                <div className="hidden w-12 flex-col items-center gap-2 border-r border-border/70 bg-card/60 py-3 sm:flex">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                    <Blocks className="h-3.5 w-3.5" />
                  </span>
                  {[Type, CircleDot, Star].map((Icon, index) => (
                    <span key={index} className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground/70">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                  ))}
                </div>

                {/* Block palette */}
                <div className="hidden w-[190px] shrink-0 border-r border-border/70 bg-card/40 p-3 md:block">
                  <div className="mb-3 flex items-center gap-2 rounded-lg border border-border/70 bg-background px-2.5 py-1.5 text-[10px] text-muted-foreground">
                    <Search className="h-3 w-3" />
                    Search blocks
                  </div>
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70">
                    Fields
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {paletteItems.map((item) => (
                      <div
                        key={item.label}
                        className="flex flex-col items-center gap-1 rounded-lg border border-border/70 bg-card px-1 py-2 text-muted-foreground shadow-[0_1px_1px_rgba(16,16,40,0.03)]"
                      >
                        <item.icon className="h-3.5 w-3.5" />
                        <span className="text-[9px] font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2 py-1.5 text-[10px] font-semibold text-primary">
                    <Sparkles className="h-3 w-3" />
                    Generate with AI
                  </div>
                </div>

                {/* Canvas */}
                <div className="builder-canvas relative flex-1 overflow-hidden p-4 sm:p-6">
                  <div className="mx-auto w-full max-w-[340px]">
                    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_18px_50px_-24px_rgba(24,16,64,0.35)]">
                      <div className="relative h-16 bg-gradient-to-r from-primary/85 via-violet-500/80 to-fuchsia-500/80">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.5),transparent_50%)]" />
                        <span className="absolute bottom-2.5 left-3 text-[11px] font-semibold text-white/90">
                          Customer feedback
                        </span>
                      </div>
                      <div className="space-y-3 p-4">
                        <div>
                          <p className="mb-1 text-[9px] font-semibold text-foreground">
                            Full name <span className="text-rose-500">*</span>
                          </p>
                          <div className="flex h-7 items-center rounded-md border border-border/80 bg-background px-2 text-[9px] text-muted-foreground">
                            Jane Cooper
                          </div>
                        </div>
                        <div>
                          <p className="mb-1 text-[9px] font-semibold text-foreground">
                            Email address <span className="text-rose-500">*</span>
                          </p>
                          <div className="flex h-7 items-center rounded-md border border-border/80 bg-background px-2 text-[9px] text-muted-foreground">
                            jane@company.com
                          </div>
                        </div>
                        <div>
                          <p className="mb-1 text-[9px] font-semibold text-foreground">
                            How did we do?
                          </p>
                          <div className="flex gap-1 text-amber-400">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star key={index} className="h-3.5 w-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        <div className="flex h-7 w-full items-center justify-center rounded-md bg-primary text-[9px] font-semibold text-primary-foreground">
                          Submit feedback
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating AI toast */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-3 top-3 hidden items-center gap-2 rounded-xl border border-border/70 bg-card/95 px-3 py-2 shadow-lg backdrop-blur sm:flex"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <div className="leading-tight">
                      <p className="text-[10px] font-semibold">AI form generated</p>
                      <p className="text-[9px] text-muted-foreground">6 fields · 4.2s</p>
                    </div>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  </motion.div>

                  {/* Floating response chip */}
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    className="absolute bottom-3 left-3 hidden items-center gap-2 rounded-xl border border-border/70 bg-card/95 px-3 py-2 shadow-lg backdrop-blur sm:flex"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
                      <Zap className="h-3.5 w-3.5" />
                    </span>
                    <div className="leading-tight">
                      <p className="text-[10px] font-semibold">New response</p>
                      <p className="text-[9px] text-muted-foreground">2 seconds ago</p>
                    </div>
                  </motion.div>
                </div>

                {/* Properties panel */}
                <div className="hidden w-[190px] shrink-0 border-l border-border/70 bg-card/40 p-3 lg:block">
                  <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold text-foreground">
                    <MousePointer2 className="h-3 w-3 text-primary" />
                    Field properties
                  </p>
                  <div className="space-y-2">
                    <div>
                      <p className="mb-1 text-[9px] text-muted-foreground">Label</p>
                      <div className="rounded-md border border-border/80 bg-background px-2 py-1.5 text-[9px]">
                        Email address
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-[9px] text-muted-foreground">Placeholder</p>
                      <div className="rounded-md border border-border/80 bg-background px-2 py-1.5 text-[9px] text-muted-foreground">
                        you@company.com
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-md border border-border/80 bg-background px-2 py-1.5">
                      <span className="text-[9px]">Required</span>
                      <span className="flex h-3.5 w-6 items-center rounded-full bg-primary px-0.5">
                        <span className="ml-auto h-2.5 w-2.5 rounded-full bg-white" />
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md border border-dashed border-border px-2 py-1.5 text-[9px] text-muted-foreground">
                      <Plus className="h-3 w-3" />
                      Add helper text
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-6 left-1/2 h-16 w-3/4 -translate-x-1/2 rounded-full bg-primary/20 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
