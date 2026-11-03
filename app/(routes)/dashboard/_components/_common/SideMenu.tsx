"use client";
import { cn } from "@/lib/utils";
import { ArrowLeft, Blocks, LucideIcon, MessageSquare, Settings } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";

type NavType = {
  title: string;
  url: string;
  icon: LucideIcon;
};

const SideMenu = () => {
  const { formId } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const navMenus: NavType[] = [
    {
      title: "Builder",
      url: `/dashboard/form/builder/${formId}`,
      icon: Blocks,
    },
    {
      title: "Responses",
      url: `/dashboard/form/responds/${formId}`,
      icon: MessageSquare,
    },
    {
      title: "Settings",
      url: `/dashboard/form/settings/${formId}`,
      icon: Settings,
    },
  ];

  return (
    <aside className="fixed bottom-0 left-0 top-16 z-40 flex w-16 flex-col items-center justify-between border-r border-border/60 bg-card/70 py-4 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          title="Back to dashboard"
          aria-label="Back to dashboard"
          onClick={() => router.push("/dashboard")}
          className="mb-2 grid h-10 w-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
        </button>
        <div className="mb-1 h-px w-7 bg-border/70" />
        {navMenus.map((item) => {
          const isActive = pathname === item.url;
          return (
            <button
              key={item.title}
              title={item.title}
              aria-label={item.title}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative grid h-10 w-10 place-items-center rounded-xl outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring/60",
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_8px_18px_-8px_hsl(var(--primary)/0.9)]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              onClick={() => {
                router.push(item.url);
              }}
            >
              <item.icon className="h-[18px] w-[18px]" />
              <span className="sr-only">{item.title}</span>
            </button>
          );
        })}
      </div>

      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
        Fmy
      </span>
    </aside>
  );
};

export default SideMenu;
