import {
    FormBlockInstance,
    FormBlockType,
    FormCategoryType,
    ObjectBlockType,
} from "@/@types/form-block.type";
import { ChevronDown, MoveVertical } from "lucide-react";
import { useBuilder } from "@/context/builder-provider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const blockCategory: FormCategoryType = "Field";
const blockType: FormBlockType = "Spacer";

type attributesType = {
    height: number;
};

type propertiesValidateSchemaType = z.infer<typeof propertiesValidateSchema>;

const propertiesValidateSchema = z.object({
    height: z.coerce.number().min(5).max(200),
});

export const SpacerBlock: ObjectBlockType = {
    blockCategory,
    blockType,

    createInstance: (id: string) => ({
        id,
        blockType,
        attributes: {
            height: 20,
        },
    }),

    blockBtnElement: {
        icon: MoveVertical,
        label: "Spacer",
    },

    canvasComponent: SpacerCanvasComponent,
    formComponent: SpacerFormComponent,
    propertiesComponent: SpacerPropertiesComponent,
};

type NewInstance = FormBlockInstance & {
    attributes: attributesType;
};

function SpacerCanvasComponent({
    blockInstance,
}: {
    blockInstance: FormBlockInstance;
}) {
    const block = blockInstance as NewInstance;
    const { height } = block.attributes;

    return (
        <div className="flex flex-col gap-2 w-full p-2 border border-transparent items-center justify-center">
            <p className="text-muted-foreground text-[10px] uppercase tracking-tighter">Spacer: {height}px</p>
            <div style={{ height: `${height}px`, width: "100%" }} className="bg-gray-50/50 border-y border-dashed border-gray-200" />
        </div>
    );
}

function SpacerFormComponent({
    blockInstance,
}: {
    blockInstance: FormBlockInstance;
}) {
    const block = blockInstance as NewInstance;
    const { height } = block.attributes;

    return <div style={{ height: `${height}px`, width: "100%" }} />;
}

function SpacerPropertiesComponent({
    positionIndex,
    parentId,
    blockInstance,
}: {
    positionIndex?: number;
    parentId?: string;
    blockInstance: FormBlockInstance;
}) {
    const block = blockInstance as NewInstance;
    const { updateChildBlock } = useBuilder();

    const form = useForm<propertiesValidateSchemaType>({
        resolver: zodResolver(propertiesValidateSchema),
        mode: "onBlur",
        defaultValues: {
            height: block.attributes.height,
        },
    });

    useEffect(() => {
        form.reset({
            height: block.attributes.height,
        });
    }, [block.attributes, form]);

    function setChanges(values: propertiesValidateSchemaType) {
        updateChildBlock(parentId || "", block.id, {
            ...block,
            attributes: {
                ...block.attributes,
                ...values,
            },
        });
    }

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full pb-4">
            <div
                className="w-full flex items-center justify-between gap-1 bg-gray-100 h-auto p-1 px-2 mb-[10px] cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm font-medium text-gray-600 tracking-wider">
                    Spacer {positionIndex}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>

            {isOpen && (
                <Form {...form}>
                    <form onSubmit={(e) => e.preventDefault()} className="w-full space-y-3 px-4">
                        <FormField
                            control={form.control}
                            name="height"
                            render={({ field }) => (
                                <FormItem className="text-end">
                                    <div className="flex items-baseline justify-between w-full gap-2">
                                        <FormLabel className="text-[13px] font-normal">Height (px)</FormLabel>
                                        <div className="w-full max-w-[187px]">
                                            <Input
                                                {...field}
                                                type="number"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setChanges({ ...form.getValues(), height: parseInt(e.target.value) || 0 });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            )}
        </div>
    );
}
