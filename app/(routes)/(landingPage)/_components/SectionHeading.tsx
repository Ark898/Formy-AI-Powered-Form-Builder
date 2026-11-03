"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] sm:text-5xl md:text-[54px]">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl",
            align === "center" ? "max-w-2xl" : "max-w-xl"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
