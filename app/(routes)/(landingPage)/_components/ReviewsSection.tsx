"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { cn } from "@/lib/utils";

const reviews = [
  {
    quote:
      "Formy has completely transformed how we collect feedback. The AI suggestions feel like having a designer on call.",
    name: "Alice Freeman",
    title: "Product Manager · TechFlow",
    initials: "AF",
    gradient: "from-violet-500 to-fuchsia-500",
    featured: true,
  },
  {
    quote:
      "I used to avoid building forms. Now it's the fastest part of my workflow — drag, drop, publish, done.",
    name: "Bob Smith",
    title: "Developer · CodeWorks",
    initials: "BS",
    gradient: "from-sky-500 to-cyan-400",
  },
  {
    quote:
      "The generated forms look like something our brand team made. Barely any tweaks needed before launch.",
    name: "Charlie Davis",
    title: "Designer · CreativeStudio",
    initials: "CD",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    quote:
      "Completion rates jumped 40% after switching. Cleaner forms, fewer drop-offs, more replies.",
    name: "Diana Prince",
    title: "Marketing Lead · GrowthX",
    initials: "DP",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    quote:
      "We shipped 14 campaign forms in one afternoon. The AI handles the busywork and we handle the message.",
    name: "Ethan Cole",
    title: "Growth · Northwind",
    initials: "EC",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    quote:
      "The analytics are genuinely useful. We finally know which questions lose people and fix them fast.",
    name: "Priya Nair",
    title: "Research · Lumen Labs",
    initials: "PN",
    gradient: "from-indigo-500 to-violet-500",
  },
];

const ReviewsSection = () => {
  return (
    <section id="reviews" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Customer stories"
          title={
            <>
              Loved by{" "}
              <span className="font-display italic text-gradient">builders</span>
            </>
          }
          description="Teams of every size use Formy to ask better questions and get better answers."
          className="mx-auto mb-14"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.figure
              key={review.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: (index % 3) * 0.08, duration: 0.5 }}
              className={cn(
                "relative flex flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lift",
                review.featured && "border-primary/20 bg-gradient-to-br from-primary/[0.06] to-card md:row-span-1"
              )}
            >
              <div className="mb-4 flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="flex-1 text-[15px] leading-relaxed text-foreground/90">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${review.gradient} text-[11px] font-bold text-white`}
                >
                  {review.initials}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.title}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
