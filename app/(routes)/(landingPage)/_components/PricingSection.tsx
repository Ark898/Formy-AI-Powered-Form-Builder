"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import SectionHeading from "./SectionHeading";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "For personal projects and first experiments.",
    features: [
      "Up to 3 active forms",
      "Basic AI generation",
      "Real-time analytics",
      "Community support",
    ],
    icon: Zap,
    popular: false,
  },
  {
    name: "Starter",
    price: "₹300",
    period: "per 10 forms",
    description: "For growing teams collecting serious feedback.",
    features: [
      "10 active forms",
      "Advanced AI features",
      "Custom themes & CSS",
      "Email notifications",
      "Priority email support",
    ],
    icon: Sparkles,
    popular: true,
  },
  {
    name: "Pro",
    price: "₹500",
    period: "per 20 forms",
    description: "For professionals who need room and polish.",
    features: [
      "20 active forms",
      "Unlimited AI prompts",
      "Full white-labeling",
      "CSV / Excel export",
      "24/7 dedicated support",
    ],
    icon: Building2,
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="relative py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-muted/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title={
            <>
              Simple pricing,{" "}
              <span className="font-display italic text-gradient">seriously</span>
            </>
          }
          description="Start free, upgrade when you need more forms. Every plan includes unlimited responses."
          className="mx-auto mb-14"
        />

        <div className="grid items-start gap-5 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative",
                plan.popular && "md:-mt-4"
              )}
            >
              {plan.popular && (
                <div className="absolute -inset-px -z-10 rounded-[26px] bg-gradient-to-b from-primary via-fuchsia-500 to-primary/40 opacity-90 blur-[0.5px]" />
              )}
              <div
                className={cn(
                  "flex h-full flex-col rounded-3xl border bg-card p-7 shadow-soft",
                  plan.popular
                    ? "border-transparent shadow-lift md:p-8"
                    : "border-border/70"
                )}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "grid h-9 w-9 place-items-center rounded-xl",
                        plan.popular
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      )}
                    >
                      <plan.icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                  </div>
                  {plan.popular && (
                    <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                      Most popular
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    / {plan.period}
                  </span>
                </div>
                <p className="mb-7 mt-2 text-sm text-muted-foreground">{plan.description}</p>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={cn(
                          "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full",
                          plan.popular ? "bg-primary/15 text-primary" : "bg-emerald-500/10 text-emerald-600"
                        )}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className="text-foreground/85">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-auto w-full"
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  asChild
                >
                  <RegisterLink>
                    {plan.name === "Free" ? "Get started" : `Choose ${plan.name}`}
                    <ArrowRight className="h-4 w-4" />
                  </RegisterLink>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          All prices are one-time — no subscriptions, no surprises.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
