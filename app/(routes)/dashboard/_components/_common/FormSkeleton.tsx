import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const FormSkeleton = () => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
      <div className="relative flex h-[172px] items-center justify-center overflow-hidden border-b border-border/60 bg-muted/50">
        <div className="relative mt-5 w-[152px] overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm">
          <Skeleton className="h-6 w-full rounded-none" />
          <div className="space-y-1.5 p-3">
            <Skeleton className="h-1.5 w-2/3" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-14" />
        </div>
        <div className="mt-4 flex items-center gap-4 border-t border-border/60 pt-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </div>
  );
};

export default FormSkeleton;
