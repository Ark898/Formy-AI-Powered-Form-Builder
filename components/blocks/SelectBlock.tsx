import {
    FormBlockInstance,
    FormBlockType,
    FormCategoryType,
    HandleBlurFunc,
    ObjectBlockType,
} from "@/@types/form-block.type";
import { ChevronDown, ListFilter, X } from "lucide-react";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
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
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { generateUniqueId } from "@/lib/helper";

const blockCategory: FormCategoryType = "Field";
const blockType: FormBlockType = "Select";

type attributesType = {
    label: string;
    placeHolder: string;
    options: string[];
    required: boolean;
};

type propertiesValidateSchemaType = z.infer<typeof propertiesValidateSchema>;

const propertiesValidateSchema = z.object({
    label: z.string().trim().min(2).max(255),
    placeHolder: z.string().trim().optional(),
    required: z.boolean().default(false),
    options: z.array(z.string().min(1)),
});

export const SelectBlock: ObjectBlockType = {
    blockCategory,
    blockType,

    createInstance: (id: string) => ({
        id,
        blockType,
        attributes: {
            label: "Select field",
            placeHolder: "Choose an option",
            options: ["Option 1", "Option 2"],
            required: false,
        },
    }),

    blockBtnElement: {
        icon: ListFilter,
        label: "Select",
    },

    canvasComponent: SelectCanvasComponent,
    formComponent: SelectFormComponent,
    propertiesComponent: SelectPropertiesComponent,
};

type NewInstance = FormBlockInstance & {
    attributes: attributesType;
};

function SelectCanvasComponent({
    blockInstance,
}: {
    blockInstance: FormBlockInstance;
}) {
    const block = blockInstance as NewInstance;
    const { label, placeHolder, options, required } = block.attributes;

    return (
        <div className="flex flex-col gap-3 w-full p-2 border border-transparent">
            <Label className="text-base !font-normal mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select disabled>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeHolder} />
                </SelectTrigger>
            </Select>
        </div>
    );
}

function SelectFormComponent({
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
    const { label, placeHolder, options, required } = block.attributes;

    const [value, setValue] = useState("");
    const [isError, setIsError] = useState(false);

    const validateField = (val: string) => {
        if (required) {
            return val.trim().length > 0;
        }
        return true;
    };

    return (
        <div className="flex flex-col gap-3 w-full p-2">
            <Label
                className={`text-base !font-normal mb-2 ${isError || isSubmitError ? "text-red-500" : ""
                    }`}
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
                value={value}
                onValueChange={(value) => {
                    setValue(value);
                    const isValid = validateField(value);
                    setIsError(!isValid);
                    if (handleBlur) {
                        handleBlur(block.id, value);
                    }
                }}
            >
                <SelectTrigger className={`w-full ${isError || isSubmitError ? "border-red-500" : ""}`}>
                    <SelectValue placeholder={placeHolder} />
                </SelectTrigger>
                <SelectContent>
                    {options?.map((option: string, index: number) => (
                        <SelectItem key={index} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {(isError || isSubmitError) && required && !value && (
                <p className="text-red-500 text-[0.8rem]">This field is required.</p>
            )}
            {errorMessage && <p className="text-red-500 text-[0.8rem]">{errorMessage}</p>}
        </div>
    );
}

function SelectPropertiesComponent({
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
            placeHolder: block.attributes.placeHolder,
            required: block.attributes.required,
            options: block.attributes.options || [],
        },
    });

    useEffect(() => {
        form.reset({
            label: block.attributes.label,
            placeHolder: block.attributes.placeHolder,
            required: block.attributes.required,
            options: block.attributes.options || [],
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
                    Select {positionIndex}
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
                                            <Input
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setChanges({ ...form.getValues(), label: e.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="placeHolder"
                            render={({ field }) => (
                                <FormItem className="text-end">
                                    <div className="flex items-baseline justify-between w-full gap-2">
                                        <FormLabel className="text-[13px] font-normal">Placeholder</FormLabel>
                                        <div className="w-full max-w-[187px]">
                                            <Input
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setChanges({ ...form.getValues(), placeHolder: e.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="options"
                            render={({ field }) => (
                                <FormItem className="text-end">
                                    <div className="flex items-baseline justify-between w-full gap-2">
                                        <FormLabel className="text-[13px] font-normal">Options</FormLabel>
                                        <div className="flex flex-col gap-1">
                                            {field?.value?.map((option: string, index: number) => (
                                                <div key={index} className="relative flex items-center justify-between gap-2">
                                                    <Input
                                                        value={option}
                                                        onChange={(e) => {
                                                            const updatedOptions = [...(field.value || [])];
                                                            updatedOptions[index] = e.target.value;
                                                            field.onChange(updatedOptions);
                                                            setChanges({ ...form.getValues(), options: updatedOptions });
                                                        }}
                                                        className="max-w-[187px]"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="!p-0 absolute -right-1 -top-1 !bg-black rounded-full w-4 h-4"
                                                        onClick={() => {
                                                            const updatedOptions = field.value?.filter((_, i) => i !== index);
                                                            field.onChange(updatedOptions);
                                                            setChanges({ ...form.getValues(), options: updatedOptions });
                                                        }}
                                                    >
                                                        <X color="white" className="!w-2.5 !h-2.5" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="mt-2"
                                                size="sm"
                                                onClick={() => {
                                                    const currentOptions = field?.value || [];
                                                    const newOption = `Option ${currentOptions.length + 1}`;
                                                    const updatedOptions = [...currentOptions, newOption];
                                                    field.onChange(updatedOptions);
                                                    setChanges({ ...form.getValues(), options: updatedOptions });
                                                }}
                                            >
                                                Add Option
                                            </Button>
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="required"
                            render={({ field }) => (
                                <FormItem className="text-end">
                                    <div className="flex items-baseline justify-between w-full gap-2">
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
