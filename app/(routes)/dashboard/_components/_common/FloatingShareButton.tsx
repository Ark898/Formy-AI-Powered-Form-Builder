"use client";

import React from "react";
import { useBuilder } from "@/context/builder-provider";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const FloatingShareButton = (props: { isSidebarOpen: boolean }) => {
  const { formData } = useBuilder();

  const copyLinkToClipboard = () => {
    const shareableLink = `${window.location.origin}/public/submit-form/${formData?.formId}`;
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        toast({
          title: "Link copied",
          description: "The shareable link is on your clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy the link. Please try again.",
          variant: "destructive",
        });
      });
  };

  if (!formData?.published) return;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 sm:bottom-8">
      <div className="flex items-center gap-1 rounded-full border border-border/70 bg-card/95 p-1.5 pl-2 shadow-[0_18px_50px_-20px_rgba(24,16,64,0.5)] backdrop-blur-md">
        <span className="flex items-center gap-1.5 pl-2 pr-1 text-xs font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live
        </span>
        <Button
          onClick={copyLinkToClipboard}
          size="sm"
          className="h-8 gap-1.5 rounded-full px-3.5"
        >
          <Copy className="h-3.5 w-3.5" />
          Share link
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full"
          aria-label="Open live form"
          onClick={() =>
            window.open(`/public/submit-form/${formData?.formId}`, "_blank")
          }
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default FloatingShareButton;
