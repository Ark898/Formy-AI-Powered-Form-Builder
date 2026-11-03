import { useEffect, useState } from "react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    FormBlockInstance,
    FormBlockType,
    FormCategoryType,
    HandleBlurFunc,
    ObjectBlockType,
} from "@/@types/form-block.type";
import { z } from "zod";
import { ChevronDown, CheckSquare } from "lucide-react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Checkbox } from "../ui/checkbox";
import { useBuilder } from "@/context/builder-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";

const blockCategory: FormCategoryType = "Field";
const blockType: FormBlockType = "Checkbox";

type attributesType = {
    label: string;
    helperText: string;
    required: boolean;
};

type propertiesValidateSchemaType = z.infer<typeof propertiesValidateSchema>;

const propertiesValidateSchema = z.object({
    label: z.string().trim().min(2).max(255),
    required: z.boolean().default(false),
    helperText: z.string().trim().max(255).optional(),
});

export const CheckboxBlock: ObjectBlockType = {
    blockType,
    blockCategory,
    createInstance: (id: string) => ({
        id,
        blockType,
        attributes: {
            label: "Checkbox field",
            helperText: "Check this if you agree",
            required: false,
        },
    }),
    blockBtnElement: {
        icon: CheckSquare,
        label: "Checkbox",
    },
    canvasComponent: CheckboxCanvasComponent,
    formComponent: CheckboxFormComponent,
    propertiesComponent: CheckboxPropertiesComponent,
};

type NewInstance = FormBlockInstance & {
    attributes: attributesType;
};

function CheckboxCanvasComponent({
    blockInstance,
}: {
    blockInstance: FormBlockInstance;
}) {
    const block = blockInstance as NewInstance;
    const { helperText, label, required } = block.attributes;
    const id = `checkbox-${block.id}`;
    return (
        <div className="flex items-top space-x-2 w-full p-2 border border-transparent">
            <Checkbox id={id} checked={block.attributes.value === "true"} disabled className="mt-1" />
            <div className="grid gap-1.5 leading-none w-full">
                <Label htmlFor={id} className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {helperText && (
                    <p className="text-sm text-muted-foreground">{helperText}</p>
                )}
            </div>
        </div>
    );
}

function CheckboxFormComponent({
    blockInstance,
    handleBlur,
    isError: isSubmitError,
    errorMessage,
}: {
    blockInstance: FormBlockInstance;
    handleBlur?: HandleBlurFunc;
    isError?: boolean;
    errorMessage?: string;
}) {
    const block = blockInstance as NewInstance;
    const { helperText, label, required } = block.attributes;

    const [value, setValue] = useState(false);
    const [isError, setIsError] = useState(false);

    const validateField = (val: boolean) => {
        if (required) {
            return val === true;
        }
        return true;
    };

    const id = `checkbox-${block.id}`;

    return (
        <div className="flex items-top space-x-2 w-full p-2">
            <Checkbox
                id={id}
                checked={value}
                onCheckedChange={(checked) => {
                    const val = checked === true;
                    setValue(val);
                    const isValid = validateField(val);
                    setIsError(!isValid);
                    if (handleBlur) {
                        handleBlur(block.id, val ? "true" : "false");
                    }
                }}
                className={isError || isSubmitError ? "border-red-500" : ""}
            />
            <div className="grid gap-1.5 leading-none w-full">
                <Label
                    htmlFor={id}
                    className={`text-base font-medium leading-none ${isError || isSubmitError ? "text-red-500" : ""
                        }`}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {helperText && (
                    <p className="text-sm text-muted-foreground">{helperText}</p>
                )}
                {(isError || isSubmitError) && required && !value && (
                    <p className="text-red-500 text-[0.8rem]">This field is required.</p>
                )}
                {errorMessage && <p className="text-red-500 text-[0.8rem]">{errorMessage}</p>}
            </div>
        </div>
    );
}

function CheckboxPropertiesComponent({
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
            label: block.attributes.label,
            helperText: block.attributes.helperText,
            required: block.attributes.required,
        },
    });

    useEffect(() => {
        form.reset({
            label: block.attributes.label,
            helperText: block.attributes.helperText,
            required: block.attributes.required,
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
                className="w-full flex flex-row items-center justify-between gap-1 bg-gray-100 h-auto p-1 px-2 mb-[10px] cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm font-medium text-gray-600 tracking-wider">
                    Checkbox {positionIndex}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
            {isOpen && (
                <Form {...form}>
                    <form onSubmit={(e) => e.preventDefault()} className="w-full space-y-3 px-4">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem className="text-end">
                                    <div className="flex items-baseline justify-between w-full gap-2">
                                        <FormLabel className="text-[13px] font-normal">Label</FormLabel>
                                        <div className="w-full max-w-[187px]">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setChanges({ ...form.getValues(), label: e.target.value });
                                                    }}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="helperText"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-baseline justify-between w-full gap-2">
                                        <FormLabel className="text-[13px] font-normal">Note</FormLabel>
                                        <div className="w-full max-w-[187px]">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setChanges({ ...form.getValues(), helperText: e.target.value });
                                                    }}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="required"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between w-full gap-2">
                                        <FormLabel className="text-[13px] font-normal">Required</FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={(value) => {
                                                    field.onChange(value);
                                                    setChanges({ ...form.getValues(), required: value });
                                                }}
                                            />
                                        </FormControl>
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
