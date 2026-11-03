import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="w-full min-h-screen px-4 pb-16 pt-6 sm:pt-10">
      <div className="mx-auto w-full max-w-[680px]">
        <Skeleton className="mb-5 h-[150px] w-full rounded-2xl sm:h-[200px]" />

        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white/85 p-5 shadow-soft"
            >
              <Skeleton className="h-4 w-1/3 rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
          <Skeleton className="mt-2 h-12 w-full rounded-xl" />
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <Skeleton className="h-3 w-44 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
