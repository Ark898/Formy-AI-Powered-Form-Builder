"use client";

import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section id="cta" className="relative py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] bg-[#0c0918] px-6 py-16 text-center sm:px-12 md:py-24"
        >
          {/* Ambient */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-grid opacity-[0.06]" />
            <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/40 blur-[110px]" />
            <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-[110px]" />
            <div className="absolute left-1/2 top-1/2 h-64 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
          </div>

          <div className="relative mx-auto flex max-w-3xl flex-col items-center">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/80 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
              Start for free
            </span>

            <h2 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl md:text-6xl">
              Your next form is{" "}
              <span className="font-display font-normal italic text-transparent bg-gradient-to-r from-violet-300 via-fuchsia-300 to-rose-300 bg-clip-text">
                one prompt away.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/60">
              Join thousands of builders creating beautiful, high-converting forms
              with AI. No credit card. No code. No friction.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <Button
                size="xl"
                className="w-full bg-white text-[#0c0918] shadow-[0_16px_40px_-16px_rgba(255,255,255,0.5)] hover:bg-white/90 sm:w-auto"
                asChild
              >
                <RegisterLink>
                  Start building for free
                  <ArrowRight className="h-4 w-4" />
                </RegisterLink>
              </Button>
              <span className="flex items-center gap-1.5 text-sm text-white/60">
                <Check className="h-4 w-4 text-emerald-400" />
                Free forever plan
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
