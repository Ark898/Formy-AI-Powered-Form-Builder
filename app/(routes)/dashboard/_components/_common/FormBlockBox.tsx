"use client";
import BlockBtnElement from "@/components/BlockBtnElement";
import { Input } from "@/components/ui/input";
import { useBuilder } from "@/context/builder-provider";
import { FormBlocks } from "@/lib/form-blocks";
import React, { useState } from "react";
import AIAssistanceBtn from "./AIAssistanceBtn";
import { Search } from "lucide-react";

const FormBlockBox = () => {
  const { formData } = useBuilder();
  const isPublished = formData?.published;

  const [search, setSearch] = useState<string>("");

  const filteredBlocks = Object.values(FormBlocks).filter((block) =>
    block.blockBtnElement.label?.toLowerCase().includes(search.toLowerCase())
  );

  const layoutBlocks = filteredBlocks.filter(
    (block) => block.blockCategory === "Layout"
  );

  const fieldBlocks = filteredBlocks.filter(
    (block) => block.blockCategory === "Field"
  );

  return (
    <div className="w-full pb-8">
      <div className="flex items-center gap-2 py-4">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            placeholder="Search blocks"
            className="h-9 bg-background pl-9 text-[13px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <AIAssistanceBtn />
      </div>

      <div className="flex w-full flex-col space-y-5">
        {layoutBlocks.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h5 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Layouts
              </h5>
              <span className="text-[10px] font-semibold text-muted-foreground/60">
                {layoutBlocks.length}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {layoutBlocks.map((block) => (
                <BlockBtnElement
                  key={block.blockType}
                  formBlock={block}
                  disabled={isPublished}
                />
              ))}
            </div>
          </div>
        )}

        <div className="h-px w-full bg-border/60" />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h5 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Fields
            </h5>
            <span className="text-[10px] font-semibold text-muted-foreground/60">
              {fieldBlocks.length}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {fieldBlocks.map((block) => (
              <BlockBtnElement
                key={block.blockType}
                formBlock={block}
                disabled={isPublished}
              />
            ))}
          </div>
        </div>

        {filteredBlocks.length === 0 && (
          <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-xs text-muted-foreground">
            No blocks match &ldquo;{search}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBlockBox;
