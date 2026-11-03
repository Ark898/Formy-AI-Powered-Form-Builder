"use client";
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { ObjectBlockType } from "@/@types/form-block.type";
import { useBuilder } from "@/context/builder-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import { generateUniqueId } from "@/lib/helper";

import { useSidebar } from "./ui/sidebar";

import { allBlockLayouts } from "@/constant";
import { FormBlocks } from "@/lib/form-blocks";

const BlockBtnElement = ({
  formBlock,
  disabled,
}: {
  formBlock: ObjectBlockType;
  disabled?: boolean;
}) => {
  const { icon: Icon, label } = formBlock.blockBtnElement;
  const {
    addBlockLayout,
    handleSeletedLayout,
    selectedBlockLayout,
    blockLayouts,
    updateBlockLayout,
  } = useBuilder();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  const draggable = useDraggable({
    id: `block-btn-${formBlock.blockType}`,
    disabled: disabled,
    data: {
      blockType: formBlock.blockType,
      isBlockBtnElement: true,
    },
  });

  const handleClick = () => {
    if (isMobile && !disabled) {
      const blockType = formBlock.blockType;
      const isLayout = allBlockLayouts.includes(blockType);
      const newInstance = formBlock.createInstance(generateUniqueId());

      if (isLayout) {
        addBlockLayout(newInstance);
        handleSeletedLayout(newInstance);
      } else {
        let targetLayout = selectedBlockLayout;
        if (!targetLayout || !allBlockLayouts.includes(targetLayout.blockType)) {
          const layouts = blockLayouts.filter((b) =>
            allBlockLayouts.includes(b.blockType)
          );
          targetLayout = layouts.length > 0 ? layouts[layouts.length - 1] : null;
        }

        if (targetLayout) {
          const updatedChildren = [
            ...(targetLayout.childblocks || []),
            newInstance,
          ];
          updateBlockLayout(targetLayout.id, updatedChildren);
        } else {
          const rowBlock = FormBlocks["RowLayout"];
          const newRow = rowBlock.createInstance(generateUniqueId());
          newRow.childblocks = [newInstance];
          addBlockLayout(newRow);
        }
        handleSeletedLayout(newInstance);
      }
      setOpenMobile(false);
    }
  };

  return (
    <Button
      disabled={disabled}
      ref={draggable.setNodeRef}
      onClick={handleClick}
      variant="ghost"
      className={cn(
        "group/btn flex h-[74px] w-full cursor-grab flex-col gap-1.5 rounded-xl border border-border/70 bg-card px-1 text-muted-foreground shadow-[0_1px_1px_rgba(16,16,40,0.03)] transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:text-primary hover:shadow-sm",
        draggable.isDragging && "border-primary shadow-lg ring-2 ring-primary/30",
        disabled && "!pointer-events-none !cursor-default opacity-50"
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <Icon className="!h-6 !w-6 !cursor-grab !stroke-[1.4] transition-transform duration-300 group-hover/btn:scale-110" />
      <h5 className="w-full truncate px-0.5 text-center text-[10.5px] font-medium leading-tight">
        {label}
      </h5>
    </Button>
  );
};

export default BlockBtnElement;
