"use client";
import React, { useState } from "react";
import { z } from "zod";
import { FieldErrors, Resolver, useForm } from "react-hook-form";
import { ArrowRight, FilePlus2, Loader, PlusIcon, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createForm } from "@/actions/form.action";
import { createFormSchema } from "@/lib/validations";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type CreateFormValues = z.infer<typeof createFormSchema>;

// @hookform/resolvers v3 is incompatible with zod v4: it re-throws the
// ZodError instead of turning it into field errors, crashing the page.
const createFormResolver: Resolver<CreateFormValues> = async (values) => {
  const parsed = createFormSchema.safeParse(values);

  if (parsed.success) {
    return { values: parsed.data, errors: {} };
  }

  const errors: FieldErrors<CreateFormValues> = {};
  parsed.error.issues.forEach((issue) => {
    const field = issue.path[0];
    if (
      (field === "name" || field === "description") &&
      !errors[field]
    ) {
      errors[field] = { type: issue.code, message: issue.message };
    }
  });

  return { values: {}, errors };
};

const CreateForm = ({ label = "Create a form" }: { label?: string }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<CreateFormValues>({
    resolver: createFormResolver,
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const name = form.watch("name") ?? "";
  const trimmedNameLength = name.trim().length;
  const isNameValid = trimmedNameLength >= 2 && trimmedNameLength <= 100;

  const onSubmit = async (values: CreateFormValues) => {
    const name = values.name.trim();

    if (name.length < 2) {
      form.setError("name", {
        type: "manual",
        message: "Name must be at least 2 characters.",
      });
      return;
    }

    const response = await createForm({
      name,
      description: values.description,
    });

    if (response.success) {
      setIsOpen(false);
      toast({
        title: "Form created",
        description: "Let's build something great.",
      });
      router.push(`/dashboard/form/builder/${response.form?.formId}`);
    } else {
      toast({
        title: "Error",
        description: response?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="lg" className="gap-2 self-start shadow-glow md:self-auto">
          <PlusIcon className="h-4 w-4" />
          {label}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-[460px]">
        <SheetHeader className="border-b border-border/70 bg-gradient-to-br from-primary/[0.08] to-transparent p-6 pr-12 text-left">
          <span className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
            <FilePlus2 className="h-5 w-5" />
          </span>
          <SheetTitle className="text-xl font-bold tracking-tight">
            Create a new form
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Give it a name and a short description. You can refine everything later —
            or ask AI to generate the fields for you.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-full flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-3">
                      <FormLabel className="text-sm font-semibold">Form name</FormLabel>
                      <span
                        className={cn(
                          "text-xs tabular-nums",
                          trimmedNameLength > 100
                            ? "text-destructive"
                            : "text-muted-foreground"
                        )}
                      >
                        {trimmedNameLength}/100
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="e.g. Customer feedback"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Use at least 2 characters to create your form.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is this form for? Who is it for?"
                        rows={4}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/[0.05] p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Pro tip:</span> use the
                  AI button inside the builder to generate a complete form from a prompt.
                </p>
              </div>

              <div className="mt-auto border-t border-border/70 pt-5">
                <Button
                  type="submit"
                  disabled={!isNameValid || form.formState.isSubmitting}
                  size="lg"
                  className="w-full"
                  title={
                    isNameValid
                      ? undefined
                      : "Enter a form name of at least 2 characters"
                  }
                >
                  {form.formState.isSubmitting ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  Create and open builder
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateForm;
