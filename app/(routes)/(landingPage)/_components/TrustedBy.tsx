"use client";

import React from "react";

const companies = [
  { name: "Acme Corp", initials: "AC", gradient: "from-slate-500 to-slate-700" },
  { name: "GlobalTech", initials: "GT", gradient: "from-sky-500 to-blue-600" },
  { name: "Nebula", initials: "N", gradient: "from-violet-500 to-fuchsia-500" },
  { name: "Trio", initials: "T", gradient: "from-emerald-500 to-teal-600" },
  { name: "FoxRun", initials: "FR", gradient: "from-orange-400 to-rose-500" },
  { name: "Vertex", initials: "V", gradient: "from-indigo-500 to-purple-600" },
];

const TrustedBy = () => {
  return (
    <section className="relative w-full border-y border-border/60 bg-card/40 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mb-7 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground/80">
          Powering forms for modern teams
        </p>
        <div className="mask-fade-x flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-14">
          {companies.map((company) => (
            <div
              key={company.name}
              className="group flex items-center gap-2.5 opacity-55 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            >
              <span
                className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br ${company.gradient} text-[10px] font-black text-white shadow-sm`}
              >
                {company.initials}
              </span>
              <span className="text-lg font-bold tracking-tight text-foreground">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
