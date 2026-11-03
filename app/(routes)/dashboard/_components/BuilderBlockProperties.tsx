"use client";
import React, { useEffect, useState } from "react";
import { useBuilder } from "@/context/builder-provider";
import { MousePointerClickIcon, Settings2, Trash2 } from "lucide-react";
import { FormBlocks } from "@/lib/form-blocks";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const BuilderBlockProperties = () => {
  const { selectedBlockLayout, handleSeletedLayout, removeBlockLayout } =
    useBuilder();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedBlockLayout && isMobile) {
      setIsOpen(true);
    }
  }, [selectedBlockLayout, isMobile]);

  const LayoutPropertyBlock =
    selectedBlockLayout &&
    FormBlocks[selectedBlockLayout.blockType]?.propertiesComponent;

  const content = (
    <div
      className={cn(
        "flex h-auto min-h-full w-full flex-col items-center pb-28",
        {
          "scrollbar overflow-auto": !isMobile,
        }
      )}
    >
      {/* Desktop header */}
      <div className="sticky top-0 z-10 hidden w-full items-center justify-between gap-2 border-b border-border/60 bg-card px-4 py-3 md:flex">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Settings2 className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold">Properties</p>
            <p className="text-[11px] text-muted-foreground">
              {selectedBlockLayout
                ? selectedBlockLayout.blockType.replace(/([A-Z])/g, " $1").trim()
                : "Nothing selected"}
            </p>
          </div>
        </div>
        {selectedBlockLayout && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete block"
            className="h-8 w-8 text-muted-foreground hover:bg-rose-50 hover:text-rose-600"
            onClick={() => {
              removeBlockLayout(selectedBlockLayout.id);
              if (isMobile) setIsOpen(false);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!selectedBlockLayout ? (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <MousePointerClickIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Select a block</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Click any field on the canvas to edit its label, placeholder, and
              validation.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full p-4">
          <div className="mb-4 flex items-center justify-between md:hidden">
            <h5 className="text-sm font-semibold">Block properties</h5>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete block"
              className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
              onClick={() => {
                removeBlockLayout(selectedBlockLayout.id);
                if (isMobile) setIsOpen(false);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {LayoutPropertyBlock && (
            <LayoutPropertyBlock blockInstance={selectedBlockLayout} />
          )}
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) handleSeletedLayout(null);
        }}
      >
        <SheetContent side="right" className="w-[92%] p-0 sm:w-[400px]">
          <SheetHeader className="border-b border-border/60 px-4 py-3 text-left">
            <SheetTitle className="flex items-center gap-2 text-sm font-semibold">
              <Settings2 className="h-4 w-4 text-primary" />
              Properties
            </SheetTitle>
          </SheetHeader>
          <div className="h-full overflow-y-auto">{content}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="relative hidden w-[320px] md:block">
      <div className="fixed right-0 mt-0 h-[calc(100vh-64px)] w-[320px] scrollbar overflow-auto border-l border-border/60 bg-card">
        {content}
      </div>
    </div>
  );
};

export default BuilderBlockProperties;
