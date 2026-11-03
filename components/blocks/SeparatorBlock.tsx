import {
    FormBlockInstance,
    FormBlockType,
    FormCategoryType,
    ObjectBlockType,
} from "@/@types/form-block.type";
import { ChevronDown, Minus } from "lucide-react";
import { Separator } from "../ui/separator";
import { useState } from "react";

const blockCategory: FormCategoryType = "Field";
const blockType: FormBlockType = "Separator";

export const SeparatorBlock: ObjectBlockType = {
    blockCategory,
    blockType,

    createInstance: (id: string) => ({
        id,
        blockType,
        attributes: {},
    }),

    blockBtnElement: {
        icon: Minus,
        label: "Separator",
    },

    canvasComponent: SeparatorCanvasComponent,
    formComponent: SeparatorFormComponent,
    propertiesComponent: SeparatorPropertiesComponent,
};

function SeparatorCanvasComponent() {
    return (
        <div className="flex flex-col gap-2 w-full p-2 border border-transparent">
            <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider">Separator</p>
            <Separator className="w-full bg-gray-200" />
        </div>
    );
}

function SeparatorFormComponent() {
    return <Separator className="w-full my-4 bg-gray-200" />;
}

function SeparatorPropertiesComponent({
    positionIndex,
}: {
    positionIndex?: number;
}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="w-full pb-4">
            <div
                className="w-full flex items-center justify-between gap-1 bg-gray-100 h-auto p-1 px-2 mb-[10px] cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm font-medium text-gray-600 tracking-wider">
                    Separator {positionIndex}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
            {isOpen && (
                <div className="px-4 py-2">
                    <p className="text-sm text-muted-foreground">This block has no properties.</p>
                </div>
            )}
        </div>
    );
}
