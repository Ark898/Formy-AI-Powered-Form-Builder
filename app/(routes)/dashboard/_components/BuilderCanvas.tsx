import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Active,
  DragEndEvent,
  useDndMonitor,
  useDroppable,
} from "@dnd-kit/core";
import { useBuilder } from "@/context/builder-provider";
import { FormBlockInstance, FormBlockType } from "@/@types/form-block.type";
import { FormBlocks } from "@/lib/form-blocks";
import { allBlockLayouts } from "@/constant";
import { generateUniqueId } from "@/lib/helper";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";

const BuilderCanvas = () => {
  const {
    blockLayouts,
    addBlockLayout,
    repositionBlockLayout,
    insertBlockLayoutAtIndex,
    formData,
  } = useBuilder();

  const [activeBlock, setActiveBlock] = useState<Active | null>(null);

  const droppable = useDroppable({
    id: "builder-canvas-droppable",
    data: {
      isBuilderCanvasDropArea: true,
    },
  });

  useDndMonitor({
    onDragStart: (event) => {
      setActiveBlock(event.active);
    },
    onDragEnd: (event: DragEndEvent) => {
      console.log("DRAG END", event);
      const { active, over } = event;
      if (!over || !active) return;
      setActiveBlock(null);

      const isBlockBtnElement = active?.data?.current?.isBlockBtnElement;
      const isBlockLayout = active?.data?.current?.blockType;

      const isDraggingOverCanvas = over.data?.current?.isBuilderCanvasDropArea;

      if (
        isBlockBtnElement &&
        allBlockLayouts.includes(isBlockLayout) &&
        isDraggingOverCanvas
      ) {
        const blockType = active.data?.current?.blockType;

        const newBlockLayout = FormBlocks[
          blockType as FormBlockType
        ].createInstance(generateUniqueId());
        console.log("NEW BLOCK Layout Instance", newBlockLayout);
        addBlockLayout(newBlockLayout);
        return;
      }

      const isDroppingOverCanvasBlockLayoutAbove = over?.data?.current?.isAbove;
      const isDroppingOverCanvasBlockLayoutBelow = over?.data?.current?.isBelow;

      const isDroppingOverCanvasLayout =
        isDroppingOverCanvasBlockLayoutAbove ||
        isDroppingOverCanvasBlockLayoutBelow;

      //-> NEW BLOCK LAYOUT TO A SPECIFIC POSITION
      const droppingLayoutBlockOverCanvas =
        isBlockBtnElement &&
        allBlockLayouts.includes(isBlockLayout) &&
        isDroppingOverCanvasLayout;

      if (droppingLayoutBlockOverCanvas) {
        const blockType = active.data?.current?.blockType;
        const overId = over?.data?.current?.blockId;

        const newBlockLayout = FormBlocks[
          blockType as FormBlockType
        ].createInstance(generateUniqueId());

        let position: "above" | "below" = "below";
        if (isDroppingOverCanvasBlockLayoutAbove) {
          position = "above";
        }

        insertBlockLayoutAtIndex(overId, newBlockLayout, position);
        return;
      }

      //-> EXISTING BLOCK LAYOUT TO A SPECIFIC POSITION
      const isDraggingCanvasLayout = active.data?.current?.isCanvasLayout;

      const draggingCanvasLayoutOverAnotherLayout =
        isDroppingOverCanvasLayout && isDraggingCanvasLayout;

      if (draggingCanvasLayoutOverAnotherLayout) {
        const activeId = active?.data?.current?.blockId;
        const overId = over?.data?.current?.blockId;

        let position: "above" | "below" = "below";
        if (isDroppingOverCanvasBlockLayoutAbove) {
          position = "above";
        }

        repositionBlockLayout(activeId, overId, position);
        return;
      }
    },
  });
  return (
    <div className="scrollbar relative w-full px-4 pb-[140px] pt-6 transition-all duration-300 md:px-8">
      <div className="mx-auto h-full w-full max-w-[650px] px-2">
        {/* {Droppable Canvas} */}
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "relative flex w-full flex-col items-center justify-start rounded-2xl pb-10 pt-1 transition-shadow",
            droppable.isOver &&
              blockLayouts.length === 0 &&
              "ring-2 ring-primary/40 ring-inset"
          )}
        >
          <div className="relative mb-4 h-[150px] w-full max-w-[768px] overflow-hidden rounded-2xl border border-white/50 bg-card shadow-[0_16px_40px_-24px_rgba(24,16,64,0.45)] sm:h-[180px]">
            <Image
              src={
                (formData?.settings as any)?.bannerImage ||
                (formData?.settings as any)?.bannerimage ||
                "/images/form-bg.jpg"
              }
              alt="Form Banner"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              unoptimized
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>

          {blockLayouts.length > 0 ? (
            <div className="flex w-full flex-col gap-4">
              {blockLayouts.map((blockLayout) => (
                <CanvasBlockLayoutWrapper
                  key={blockLayout.id}
                  activeBlock={activeBlock}
                  blockLayout={blockLayout}
                />
              ))}
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/25 bg-card/60 px-6 py-16 text-center backdrop-blur-sm">
              <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Image
                  src="/images/logo.png"
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain opacity-80"
                />
              </span>
              <p className="text-sm font-semibold">Start with a block</p>
              <p className="mt-1 max-w-[260px] text-xs leading-relaxed text-muted-foreground">
                Drag a layout from the left panel, or use AI to generate a complete
                form from a prompt.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function CanvasBlockLayoutWrapper({
  blockLayout,
  activeBlock,
}: {
  blockLayout: FormBlockInstance;
  activeBlock: Active | null;
}) {
  const { handleSeletedLayout } = useBuilder();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const CanvasBlockLayout = FormBlocks[blockLayout.blockType].canvasComponent;

  const topCorner = useDroppable({
    id: blockLayout.id + "_above",
    data: {
      blockType: blockLayout.blockType,
      blockId: blockLayout.id,
      isAbove: true,
    },
  });

  const bottomCorner = useDroppable({
    id: blockLayout.id + "_below",
    data: {
      blockType: blockLayout.blockType,
      blockId: blockLayout.id,
      isBelow: true,
    },
  });

  return (
    <div className="relative mb-1">
      {allBlockLayouts.includes(activeBlock?.data?.current?.blockType) &&
        !blockLayout.isLocked && (
          <div
            ref={topCorner.setNodeRef}
            className="
        absolute top-0 w-full h-1/2
        pointer-events-none
        "
          >
            {topCorner.isOver && (
              <div
                className="
           absolute w-full -top-[3px] h-[6px]
           bg-primary rounded-t-md
          "
              />
            )}
          </div>
        )}

      {/* Bottom Half Drop Zone */}
      {allBlockLayouts.includes(activeBlock?.data?.current?.blockType) &&
        !blockLayout.isLocked && (
          <div
            ref={bottomCorner.setNodeRef}
            className="
        absolute bottom-0 w-full h-1/2
        pointer-events-none 
        "
          >
            {bottomCorner.isOver && (
              <div
                className="
             absolute w-full -bottom-[3px] h-[6px]
             bg-primary rounded-b-md
            "
              />
            )}
          </div>
        )}

      <div
        className="relative cursor-pointer group"
        onClick={(e) => {
          // No stopPropagation here so we don't block anything else 
          // but we select the top-level layout block
          handleSeletedLayout(blockLayout);
          if (isMobile) {
            setOpenMobile(false);
          }
        }}
      >
        <CanvasBlockLayout blockInstance={blockLayout} />
      </div>
    </div>
  );
}

export default BuilderCanvas;
