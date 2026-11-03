import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        <Skeleton className="mb-6 h-4 w-40 rounded-md" />
        <Skeleton className="mb-3 h-5 w-20 rounded-full" />
        <Skeleton className="mb-3 h-10 w-72 max-w-full rounded-lg" />
        <Skeleton className="h-4 w-64 max-w-full rounded-md" />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-24 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="mt-3 h-8 w-16 rounded-md" />
            </div>
          ))}
        </div>

        <div className="mt-10 mb-5 flex items-center justify-between">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft"
            >
              <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
                <Skeleton className="h-7 w-28 rounded-lg" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-4/5 rounded-md" />
                <Skeleton className="h-3.5 w-2/3 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Loading;
