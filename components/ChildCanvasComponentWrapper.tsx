import { FormBlockInstance } from "@/@types/form-block.type";
import { FormBlocks } from "@/lib/form-blocks";
import React from "react";
import { useBuilder } from "@/context/builder-provider";
import { useSidebar } from "./ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const ChildCanvasComponentWrapper = ({
  blockInstance,
}: {
  blockInstance: FormBlockInstance;
}) => {
  const { handleSeletedLayout } = useBuilder();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  const CanvasComponent = FormBlocks[blockInstance.blockType]?.canvasComponent;
  if (!CanvasComponent) return null;

  return (
    <div
      className="w-full cursor-pointer relative group"
      onClick={(e) => {
        e.stopPropagation();
        handleSeletedLayout(blockInstance);
        if (isMobile) {
          setOpenMobile(false);
        }
      }}
    >
      <CanvasComponent blockInstance={blockInstance} />
    </div>
  );
};

export default ChildCanvasComponentWrapper;
