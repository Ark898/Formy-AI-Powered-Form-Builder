"use client";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Blocks, Home, Settings2, ChevronRight } from "lucide-react";
import FormBlockBox from "./_common/FormBlockBox";
import FormSettings from "./_common/FormSettings";
import { useBuilder } from "@/context/builder-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";

const BuilderSidebar = ({
  rest,
}: {
  rest?: React.ComponentProps<typeof Sidebar>;
}) => {
  const { formData } = useBuilder();
  const isMobile = useIsMobile();

  const [tab, setTab] = useState<"blocks" | "settings">("blocks");

  return (
    <Sidebar
      className={cn(
        "border-r border-border/60 bg-card pt-16",
        !isMobile && "left-16"
      )}
      {...rest}
    >
      <SidebarHeader className="border-b border-border/60 bg-card px-4 py-3">
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <Link
            href="/dashboard"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-md transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Back to dashboard"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/50" />
          <span className="truncate text-[13px] font-semibold text-foreground">
            {formData?.name || "Untitled form"}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar bg-card px-4 pt-4">
        <div className="w-full">
          <div className="flex w-full gap-1 rounded-xl bg-muted p-1">
            <button
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[13px] font-semibold transition-all",
                tab === "blocks"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setTab("blocks")}
            >
              <Blocks className="h-3.5 w-3.5" />
              Blocks
            </button>
            <button
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[13px] font-semibold transition-all",
                tab === "settings"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setTab("settings")}
            >
              <Settings2 className="h-3.5 w-3.5" />
              Design
            </button>
          </div>

          {tab === "blocks" && <FormBlockBox />}
          {tab === "settings" && <FormSettings />}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default BuilderSidebar;
