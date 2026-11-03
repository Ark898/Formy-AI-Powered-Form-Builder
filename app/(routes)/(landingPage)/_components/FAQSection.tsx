"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown, MessageCircleQuestion } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How does the AI form builder work?",
    answer:
      "Describe the form you need in plain language. Our AI understands the intent, then generates the fields, validation rules, layout, and starter copy — all editable in the drag-and-drop builder.",
  },
  {
    question: "Can I customize the generated forms?",
    answer:
      "Yes. Every field, label, and color is yours to change. Swap layouts, add logic, upload a banner, and match your brand from the form settings.",
  },
  {
    question: "Is there a limit on responses I can collect?",
    answer:
      "Every plan includes unlimited responses. Plans differ by the number of active forms and the AI features available, so you can scale without worrying about per-response costs.",
  },
  {
    question: "Can I export my form data?",
    answer:
      "Absolutely. Responses can be exported to CSV or Excel at any time, and you can connect external tools through webhooks for automated workflows.",
  },
  {
    question: "Do you offer customer support?",
    answer:
      "Every user gets email support. Pro users receive 24/7 priority support from our team, including help with migration and custom setups.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title={
                <>
                  Got{" "}
                  <span className="font-display italic text-gradient">questions?</span>
                </>
              }
              description="Everything you need to know about Formy. Can't find your answer? We're one message away."
            />
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <MessageCircleQuestion className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Still curious?</p>
                <a
                  href="mailto:hello@formy.ai"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Talk to our team
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              return (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: index * 0.04, duration: 0.4 }}
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-card transition-all duration-300",
                    isOpen
                      ? "border-primary/30 shadow-soft"
                      : "border-border/70 hover:border-primary/20"
                  )}
                >
                  <button
                    onClick={() => setActiveIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[15px] font-semibold sm:text-base">
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300",
                        isOpen
                          ? "rotate-180 bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-[15px] leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
