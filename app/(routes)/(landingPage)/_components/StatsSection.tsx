"use client";
import React, { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Users, FileText, TrendingUp, Globe } from "lucide-react";

const stats = [
  {
    id: 1,
    name: "Active builders",
    value: "10K+",
    target: 10,
    suffix: "K+",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
    note: "and growing every day",
  },
  {
    id: 2,
    name: "Forms created",
    value: "500K+",
    target: 500,
    suffix: "K+",
    icon: FileText,
    color: "text-fuchsia-600",
    bg: "bg-fuchsia-500/10",
    note: "across 120 countries",
  },
  {
    id: 3,
    name: "Completion rate",
    value: "99.9%",
    target: 99.9,
    suffix: "%",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    note: "with smart form design",
  },
  {
    id: 4,
    name: "Global reach",
    value: "120+",
    target: 120,
    suffix: "+",
    icon: Globe,
    color: "text-sky-600",
    bg: "bg-sky-500/10",
    note: "languages & regions",
  },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return target % 1 === 0 ? Math.round(latest) : parseFloat(latest.toFixed(1));
  });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration: 1.8,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, target, count]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section id="stats" className="relative py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border/70 bg-border/60 shadow-soft dark:bg-border/40 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="group relative bg-card p-6 md:p-8"
            >
              <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <h3 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                <Counter target={stat.target} suffix={stat.suffix} />
              </h3>
              <p className="mt-1.5 text-sm font-semibold">{stat.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{stat.note}</p>
              <span className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
