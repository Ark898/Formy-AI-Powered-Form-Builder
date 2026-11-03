"use client";

import React from "react";
import { MessageSquareText, MousePointerClick, Rocket, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Describe",
    description:
      "Tell Formy what you want to collect and who it's for. A sentence is enough — the AI fills in the rest.",
    icon: MessageSquareText,
    accent: "text-primary",
    bg: "bg-primary/10",
    ring: "ring-primary/20",
  },
  {
    step: "02",
    title: "Refine",
    description:
      "Polish every detail in the drag-and-drop editor. Swap fields, add logic, and match your brand colors.",
    icon: MousePointerClick,
    accent: "text-fuchsia-600",
    bg: "bg-fuchsia-500/10",
    ring: "ring-fuchsia-500/20",
  },
  {
    step: "03",
    title: "Publish",
    description:
      "Share a link or embed the form anywhere. Responses stream into your dashboard in real time.",
    icon: Rocket,
    accent: "text-emerald-600",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              From idea to live form{" "}
              <span className="font-display italic text-gradient">in three steps</span>
            </>
          }
          description="No tutorials, no setup checklists. Just describe, refine, and publish."
          className="mx-auto mb-16"
        />

        <div className="relative grid gap-5 md:grid-cols-3">
          {/* Connector */}
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-11 hidden border-t border-dashed border-primary/25 md:block" />

          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              <div className="relative flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift">
                <div className="relative mb-6 flex items-center justify-between">
                  <span
                    className={`grid h-14 w-14 place-items-center rounded-2xl ${item.bg} ${item.accent} ring-8 ${item.ring} transition-transform duration-500 group-hover:scale-105`}
                  >
                    <item.icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-5xl italic leading-none text-muted-foreground/15 transition-colors duration-300 group-hover:text-primary/20">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-primary">
                  <span>Step {index + 1}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="#pricing"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            See what you get on each plan
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
