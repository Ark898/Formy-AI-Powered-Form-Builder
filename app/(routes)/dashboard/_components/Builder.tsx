import React from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import BuilderSidebar from "./BuilderSidebar";
import { defaultBackgroundColor } from "@/constant";
import BuilderCanvas from "./BuilderCanvas";
import BuilderBlockProperties from "./BuilderBlockProperties";
import FloatingShareButton from "./_common/FloatingShareButton";
import { useBuilder } from "@/context/builder-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import PreviewDialog from "./_common/PreviewDialog";
import SaveFormBtn from "./_common/SaveFormBtn";
import PublishFormBtn from "./_common/PublishFormBtn";
import { FileText } from "lucide-react";

const Builder = (props: { isSidebarOpen: boolean }) => {
  const { formData } = useBuilder();
  const isMobile = useIsMobile();
  const backgroundColor =
    formData?.settings?.backgroundColor || defaultBackgroundColor;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
      <BuilderSidebar />
      <SidebarInset className="relative flex flex-1 flex-col overflow-hidden !p-0">
        <div className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border/60 bg-background/80 px-3 py-2 backdrop-blur-md sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <SidebarTrigger className="static h-8 w-8 rounded-lg" />
            <div className="flex min-w-0 items-center gap-2">
              <span className="hidden truncate text-sm font-semibold sm:block">
                {formData?.name || "Untitled form"}
              </span>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  formData?.published
                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600"
                    : "border-border/70 bg-muted text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    formData?.published ? "bg-emerald-500" : "bg-muted-foreground/50"
                  )}
                />
                {formData?.published ? "Live" : "Draft"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <PreviewDialog />
            <SaveFormBtn />
            <PublishFormBtn />
          </div>
        </div>

        <div
          className="scrollbar relative w-full flex-1 overflow-y-auto"
          style={{
            backgroundColor: backgroundColor,
          }}
        >
          <BuilderCanvas />
          <FloatingShareButton isSidebarOpen={props.isSidebarOpen} />
        </div>
      </SidebarInset>
      <BuilderBlockProperties />
    </div>
  );
};

export default Builder;
