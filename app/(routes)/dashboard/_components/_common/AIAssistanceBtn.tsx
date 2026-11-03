"use client";
import { FormBlockInstance } from "@/@types/form-block.type";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useBuilder } from "@/context/builder-provider";
import { toast } from "@/hooks/use-toast";
import { generateAIPrompt } from "@/actions/ai.action";
import { generateUniqueId } from "@/lib/helper";
import { generateFormQuestionPrompt } from "@/lib/prompts";
import { Loader, Sparkles, X } from "lucide-react";
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const AIAssistanceBtn = () => {
  const { formData, blockLayouts, setBlockLayouts, handleSeletedLayout } =
    useBuilder();
  const isMobile = useIsMobile();
  const [userRequest, setUserRequest] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);

  const isPublished = formData?.published;

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && isMobile) {
      handleSeletedLayout(null); // Close right sidebar on mobile
    }
  };

  const GenerateFormQuestionsWithAI = async () => {
    if (!userRequest) {
      toast({
        title: "Please enter a request",
      });
      return;
    }
    try {
      setLoading(true);
      const formName = formData?.name || "";
      const formDescription = formData?.description || "";

      const PROMPT = generateFormQuestionPrompt(
        userRequest,
        formName,
        formDescription,
        blockLayouts
      );

      const result = await generateAIPrompt(PROMPT);

      if (!result.success || !result.data) {
        throw new Error(result.message || "Failed to generate AI response");
      }

      const parsedResponse: unknown = JSON.parse(result.data);
      if (!parsedResponse || typeof parsedResponse !== "object") {
        throw new Error("AI returned an invalid response.");
      }

      const { actionType, blocks } = parsedResponse as {
        actionType?: unknown;
        blocks?: unknown;
      };
      if (actionType !== "addQuestions" && actionType !== "createForm") {
        throw new Error("AI returned an unsupported form action.");
      }
      if (
        !Array.isArray(blocks) ||
        blocks.length === 0 ||
        !blocks.every(isFormBlockInstance)
      ) {
        throw new Error("AI did not return any valid form questions.");
      }

      const addUniqueIdToGeneratedBlocks = addUniqueIds(blocks);

      setBlockLayouts((prevBlocks) => {
        if (actionType === "addQuestions") {
          return [...prevBlocks, ...addUniqueIdToGeneratedBlocks];
        }
        return addUniqueIdToGeneratedBlocks;
      });
      setIsOpen(false);
      setUserRequest("");
    } catch (error) {
      console.error("AI form generation failed:", error);
      toast({
        title: "Failed to generate form",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  function addUniqueIds(blocks: FormBlockInstance[]) {
    blocks.forEach((block) => {
      block.id = generateUniqueId();
      block?.childblocks?.forEach((child) => {
        child.id = generateUniqueId();
      });
    });
    return blocks;
  }

  function isFormBlockInstance(block: unknown): block is FormBlockInstance {
    if (!block || typeof block !== "object") return false;

    const candidate = block as Record<string, unknown>;
    return (
      typeof candidate.id === "string" &&
      typeof candidate.blockType === "string" &&
      (candidate.childblocks === undefined ||
        (Array.isArray(candidate.childblocks) &&
          candidate.childblocks.every(isFormBlockInstance)))
    );
  }

  const content = (
    <div className="flex w-full max-w-[650px] flex-col rounded-xl bg-card px-3 pb-4 pt-4 sm:px-5">
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-primary to-fuchsia-500 text-white">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <div className="leading-tight">
          <p className="text-[13px] font-semibold">AI form assistant</p>
          <p className="text-[11px] text-muted-foreground">
            Describe it — we&apos;ll build it
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Textarea
          value={userRequest}
          rows={4}
          readOnly={isPublished}
          className="block h-32 w-full resize-none bg-background text-sm"
          placeholder="e.g. Create a hotel booking form with check-in dates, room type, guests, and a special requests field..."
          spellCheck="false"
          onChange={(e) => setUserRequest(e.target.value)}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
          onClick={() => setShow(!show)}
        >
          {show ? "Hide tips" : "Show tips"}
        </button>

        <Button
          type="button"
          size="sm"
          className="gap-1.5 px-4"
          disabled={loading || isPublished}
          onClick={GenerateFormQuestionsWithAI}
        >
          {loading ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>

      {show && (
        <div className="mt-4 flex animate-in flex-col rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-3 text-primary/80 fade-in slide-in-from-top-2 duration-300">
          <div className="mb-1.5 text-[13px] font-bold">Include in your prompt:</div>
          <ul className="ml-4 list-disc space-y-1 text-xs">
            <li>Type of form (e.g. Hotel booking)</li>
            <li>Information to collect (name, dates…)</li>
            <li>Desired tone (formal, friendly…)</li>
            <li>Approximate number of questions</li>
          </ul>
        </div>
      )}
    </div>
  );

  const trigger = (
    <Button
      size="icon"
      className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 p-0 text-white shadow-[0_8px_20px_-10px_hsl(var(--primary)/0.9)] transition-transform hover:scale-105 hover:brightness-105"
      aria-label="AI assistance"
    >
      <Sparkles className="h-4 w-4" />
    </Button>
  );

  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="w-[95%] max-w-[650px] rounded-2xl p-2">
          <DialogHeader className="hidden">
            <DialogTitle>AI Assistance</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden rounded-2xl border-border/70 p-0 shadow-2xl"
        forceMount
        align="start"
        side="right"
      >
        {content}
      </PopoverContent>
    </Popover>
  );
};

export default AIAssistanceBtn;
