"use client";
import React, { useState } from "react";
import { useBuilder } from "@/context/builder-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateFormSettings } from "@/actions/form.action";
import { toast } from "@/hooks/use-toast";
import { Check, ImagePlus, Loader2, RotateCcw } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const DEFAULT_BANNER = "/images/form-bg.jpg";
const MAX_BANNER_SIZE = 4 * 1024 * 1024;
const ALLOWED_BANNER_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const PRESET_BANNERS = [
  { name: "Default", url: "/images/form-bg.jpg" },
  { name: "Blue", url: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&h=300&auto=format&fit=crop" },
  { name: "Nature", url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1200&h=300&auto=format&fit=crop" },
  { name: "Violet", url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&h=300&auto=format&fit=crop" },
  { name: "Blush", url: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=1200&h=300&auto=format&fit=crop" },
];

const FormSettings = () => {
  const { formData, updateSettings } = useBuilder();
  const [loading, setLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  const currentBanner = (formData?.settings as any)?.bannerImage || DEFAULT_BANNER;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_BANNER_TYPES.includes(file.type)) {
      toast({
        title: "Unsupported file",
        description: "Use a JPG, PNG, WebP, or GIF image.",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    if (file.size > MAX_BANNER_SIZE) {
      toast({
        title: "File too large",
        description: "Banner images must be 4 MB or smaller.",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    setLoading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.success) {
        await handleUpdateBanner(data.imageUrl);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to upload image",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong during upload",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBanner = async (url: string | null) => {
    if (!formData?.formId) return;

    setLoading(true);
    try {
      const response = await updateFormSettings({
        formId: formData.formId,
        bannerImage: url || "",
      });

      if (response.success) {
        updateSettings({ bannerImage: url });
        toast({
          title: "Banner updated",
          description: "Your form header has a fresh look.",
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h4 className="text-[13px] font-semibold">Header banner</h4>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Pick a style for the top of your form.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PRESET_BANNERS.map((banner) => (
          <button
            type="button"
            key={banner.url}
            className={cn(
              "group relative h-16 w-full overflow-hidden rounded-lg border-2 transition-all",
              currentBanner === banner.url
                ? "border-primary ring-2 ring-primary/20"
                : "border-border/60 hover:border-primary/40"
            )}
            onClick={() => handleUpdateBanner(banner.url)}
          >
            <Image
              src={banner.url}
              alt={banner.name}
              fill
              sizes="150px"
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-[10px] font-semibold text-white">
                {banner.name}
              </span>
            </div>
            {currentBanner === banner.url && (
              <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-2.5 w-2.5" />
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="border-t border-border/60 pt-4">
        <Label htmlFor="custom-url" className="mb-1.5 block text-xs font-medium">
          Custom image URL
        </Label>
        <div className="flex gap-2">
          <Input
            id="custom-url"
            placeholder="https://..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="h-8 text-xs"
          />
          <Button
            size="sm"
            className="h-8 shrink-0"
            disabled={!customUrl || loading}
            onClick={() => handleUpdateBanner(customUrl)}
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Apply"}
          </Button>
        </div>
      </div>

      <div className="border-t border-border/60 pt-4">
        <Label className="mb-2 block text-xs font-medium">Upload from computer</Label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          id="banner-upload"
          onChange={handleFileUpload}
          disabled={loading}
        />
        <Label
          htmlFor="banner-upload"
          className={cn(
            "flex h-20 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed bg-muted/30 transition-all hover:bg-muted/60",
            loading
              ? "pointer-events-none opacity-50"
              : "border-border hover:border-primary/40 hover:text-primary"
          )}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ImagePlus className="h-5 w-5" />
          )}
          <p className="text-[11px] font-medium">PNG or JPG, up to 5MB</p>
        </Label>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start gap-2 text-muted-foreground hover:text-primary"
        onClick={() => handleUpdateBanner(DEFAULT_BANNER)}
        disabled={loading}
      >
        <RotateCcw className="h-3 w-3" />
        Reset to default
      </Button>
    </div>
  );
};

export default FormSettings;
