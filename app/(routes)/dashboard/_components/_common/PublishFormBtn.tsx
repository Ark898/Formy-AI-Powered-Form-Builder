"use client";

import React, { useState } from "react";
import { Loader, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuilder } from "@/context/builder-provider";
import { updatePublish, updateFormSettings } from "@/actions/form.action";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PublishFormBtn = () => {
  const { formData, setFormData, handleSeletedLayout } = useBuilder();
  const formId = formData?.formId;

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [maxResponses, setMaxResponses] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");

  const isPublished = formData?.published;

  const handlePublishClick = () => {
    if (isPublished) {
      togglePublishState();
    } else {
      const settings = formData?.settings as any;
      if (settings) {
        setMaxResponses(settings.maxResponses ? String(settings.maxResponses) : "");
        setExpiryDate(settings.expiryDate ? String(settings.expiryDate).split("T")[0] : "");
      }
      setIsOpen(true);
    }
  };

  const togglePublishState = async () => {
    try {
      if (!formId) return;
      setIsLoading(true);

      const newPublishedState = !isPublished;
      const response = await updatePublish(formId, newPublishedState);
      if (response?.success) {
        toast({
          title: "Success",
          description: response.message,
        });

        handleSeletedLayout(null);
        setFormData({
          ...formData,
          published: response.published || false,
        });
        setIsOpen(false);
      } else {
        toast({
          title: "Error",
          description: response?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveAndPublish = async () => {
    try {
      if (!formId) return;
      setIsLoading(true);

      await updateFormSettings({
        formId,
        maxResponses: maxResponses ? parseInt(maxResponses) : null,
        expiryDate: expiryDate || null,
      });

      const response = await updatePublish(formId, true);
      if (response?.success) {
        toast({
          title: "Your form is live",
          description: "Limits configured and published successfully.",
        });

        handleSeletedLayout(null);
        setFormData({
          ...formData,
          published: true,
          settings: {
            ...formData.settings,
            maxResponses: maxResponses ? parseInt(maxResponses) : null,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
          },
        });
        setIsOpen(false);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to configure parameters",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        disabled={isLoading}
        size="sm"
        variant={isPublished ? "outline" : "default"}
        className="h-8 gap-1.5 px-3"
        onClick={handlePublishClick}
      >
        {isLoading ? (
          <Loader className="h-3.5 w-3.5 animate-spin" />
        ) : isPublished ? (
          "Unpublish"
        ) : (
          <>
            <Send className="h-3.5 w-3.5" />
            Publish
          </>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Publish & configure limits</DialogTitle>
            <DialogDescription>
              Set optional limits before turning this form live. You can change
              these anytime in settings.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-3">
            <div className="grid gap-2">
              <Label htmlFor="max-responses">Maximum responses</Label>
              <Input
                id="max-responses"
                type="number"
                placeholder="Leave blank for unlimited"
                value={maxResponses}
                onChange={(e) => setMaxResponses(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expiry-date">Expiration date</Label>
              <Input
                id="expiry-date"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={saveAndPublish} disabled={isLoading}>
              {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : "Publish form"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PublishFormBtn;
