"use client";
import React, { useState, useEffect } from "react";
import { useBuilder } from "@/context/builder-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateFormSettings, saveForm, deleteForm } from "@/actions/form.action";
import { toast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  Check,
  Clock3,
  Loader2,
  Palette,
  RotateCcw,
  Settings2,
  Trash2,
  Webhook,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { defaultBackgroundColor, defaultPrimaryColor } from "@/constant";

const SectionHeader = ({
  icon,
  title,
  description,
  tone = "primary",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone?: "primary" | "fuchsia" | "emerald" | "amber" | "destructive";
}) => {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    fuchsia: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    destructive: "bg-destructive/10 text-destructive",
  }[tone];

  return (
    <div className="flex items-start gap-4 border-b border-border/60 p-6 sm:p-8">
      <div
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${toneClass}`}
      >
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

const FormSettingsDetailed = () => {
  const { formData, updateSettings } = useBuilder();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  // Local state for form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bgPicker, setBgPicker] = useState(defaultBackgroundColor);
  const [primaryPicker, setPrimaryPicker] = useState(defaultPrimaryColor);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [maxResponses, setMaxResponses] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");

  useEffect(() => {
    if (formData) {
      setName(formData.name || "");
      setDescription(formData.description || "");
      setBgPicker(formData.settings?.backgroundColor || defaultBackgroundColor);
      setPrimaryPicker(formData.settings?.primaryColor || defaultPrimaryColor);
      setWebhookUrl((formData.settings as any)?.webhookUrl || "");
      setMaxResponses(
        (formData.settings as any)?.maxResponses
          ? String((formData.settings as any).maxResponses)
          : ""
      );
      setExpiryDate(
        (formData.settings as any)?.expiryDate
          ? String((formData.settings as any).expiryDate).split("T")[0]
          : ""
      );
    }
  }, [formData]);

  const handleUpdateGeneral = async () => {
    if (!formData?.formId) return;
    setLoading(true);
    try {
      const res = await saveForm({
        formId: formData.formId,
        name,
        description,
        jsonBlocks: formData.jsonBlocks,
      });
      if (res.success) {
        toast({ title: "Updated", description: "General settings saved." });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppearance = async () => {
    if (!formData?.formId) return;
    setLoading(true);
    try {
      const res = await updateFormSettings({
        formId: formData.formId,
        backgroundColor: bgPicker,
        primaryColor: primaryPicker,
      });
      if (res.success) {
        updateSettings({ backgroundColor: bgPicker, primaryColor: primaryPicker });
        toast({ title: "Updated", description: "Appearance settings saved." });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to save appearance.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWebhook = async () => {
    if (!formData?.formId) return;
    setLoading(true);
    try {
      const res = await updateFormSettings({
        formId: formData.formId,
        webhookUrl: webhookUrl,
      });
      if (res.success) {
        updateSettings({ webhookUrl: webhookUrl });
        toast({ title: "Updated", description: "Webhook URL saved." });
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to save webhook.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to save webhook.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLimits = async () => {
    if (!formData?.formId) return;
    setLoading(true);
    try {
      const res = await updateFormSettings({
        formId: formData.formId,
        maxResponses: maxResponses ? parseInt(maxResponses) : null,
        expiryDate: expiryDate || null,
      });
      if (res.success) {
        updateSettings({
          maxResponses: maxResponses ? parseInt(maxResponses) : null,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
        });
        toast({ title: "Updated", description: "Form limits saved." });
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to save limits.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to save limits.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData?.formId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteForm(formData.formId);
      if (res.success) {
        toast({ title: "Deleted", description: "Form deleted successfully." });
        router.push("/dashboard");
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to delete form.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* General Settings */}
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
        <SectionHeader
          icon={<Settings2 className="h-5 w-5" />}
          title="General information"
          description="Update the name and description shown to anyone who opens your form."
        />

        <div className="space-y-6 p-6 sm:p-8">
          <div className="space-y-2">
            <Label htmlFor="form-name" className="text-sm font-medium">
              Form name
            </Label>
            <Input
              id="form-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter form name..."
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-desc" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="form-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this form about?"
              rows={4}
              className="resize-none"
            />
          </div>
          <div className="flex justify-end border-t border-border/60 pt-6">
            <Button
              onClick={handleUpdateGeneral}
              disabled={loading}
              className="h-10 px-6"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Save changes
            </Button>
          </div>
        </div>
      </section>

      {/* Appearance Settings */}
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
        <SectionHeader
          icon={<Palette className="h-5 w-5" />}
          title="Appearance"
          description="Pick consistent brand colors for your public form."
          tone="fuchsia"
        />

        <div className="space-y-6 p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Background color</Label>
              <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-muted/40 p-3">
                <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg border border-border/70">
                  <input
                    type="color"
                    value={bgPicker}
                    onChange={(e) => setBgPicker(e.target.value)}
                    className="absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)] cursor-pointer border-none bg-transparent p-0"
                    aria-label="Choose background color"
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-mono text-sm font-semibold uppercase text-foreground">
                    {bgPicker}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Page background
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Primary brand color</Label>
              <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-muted/40 p-3">
                <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg border border-border/70">
                  <input
                    type="color"
                    value={primaryPicker}
                    onChange={(e) => setPrimaryPicker(e.target.value)}
                    className="absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)] cursor-pointer border-none bg-transparent p-0"
                    aria-label="Choose primary color"
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-mono text-sm font-semibold uppercase text-foreground">
                    {primaryPicker}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Buttons &amp; accents
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              className="h-10 px-5"
              disabled={loading}
              onClick={async () => {
                setBgPicker(defaultBackgroundColor);
                setPrimaryPicker(defaultPrimaryColor);
                // Instantly save to DB
                if (formData?.formId) {
                  setLoading(true);
                  try {
                    const res = await updateFormSettings({
                      formId: formData.formId,
                      backgroundColor: defaultBackgroundColor,
                      primaryColor: defaultPrimaryColor,
                    });
                    if (res.success) {
                      updateSettings({
                        backgroundColor: defaultBackgroundColor,
                        primaryColor: defaultPrimaryColor,
                      });
                      toast({
                        title: "Reset",
                        description: "Appearance reset to defaults.",
                      });
                    }
                  } catch (e) {
                    toast({
                      title: "Error",
                      description: "Failed to reset appearance.",
                      variant: "destructive",
                    });
                  } finally {
                    setLoading(false);
                  }
                }
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset defaults
            </Button>
            <Button
              onClick={handleUpdateAppearance}
              disabled={loading}
              className="h-10 px-6"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Palette className="mr-2 h-4 w-4" />
              )}
              Save appearance
            </Button>
          </div>
        </div>
      </section>

      {/* Webhooks & Integrations */}
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
        <SectionHeader
          icon={<Webhook className="h-5 w-5" />}
          title="Webhooks & integrations"
          description="Forward form responses to Zapier, Make, Slack, or your own endpoint."
          tone="emerald"
        />

        <div className="space-y-6 p-6 sm:p-8">
          <div className="space-y-2">
            <Label htmlFor="webhook-url" className="text-sm font-medium">
              Webhook URL
            </Label>
            <Input
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-webhook-endpoint.com"
              className="h-11"
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Whenever a response is submitted, a POST request with the JSON
              payload is dispatched here.
            </p>
          </div>
          <div className="flex justify-end border-t border-border/60 pt-6">
            <Button
              onClick={handleUpdateWebhook}
              disabled={loading}
              className="h-10 px-6"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Save webhook
            </Button>
          </div>
        </div>
      </section>

      {/* Form Expiry & Limits */}
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
        <SectionHeader
          icon={<Clock3 className="h-5 w-5" />}
          title="Expiry & limits"
          description="Automatically close the form based on response count or a date."
          tone="amber"
        />

        <div className="space-y-6 p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="detailed-max-responses"
                className="text-sm font-medium"
              >
                Maximum responses
              </Label>
              <Input
                id="detailed-max-responses"
                type="number"
                value={maxResponses}
                onChange={(e) => setMaxResponses(e.target.value)}
                placeholder="Leave blank for unlimited"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                The form closes automatically when reached.
              </p>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="detailed-expiry-date"
                className="text-sm font-medium"
              >
                Expiration date
              </Label>
              <Input
                id="detailed-expiry-date"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Submissions will be disabled after this day.
              </p>
            </div>
          </div>
          <div className="flex justify-end border-t border-border/60 pt-6">
            <Button
              onClick={handleUpdateLimits}
              disabled={loading}
              className="h-10 px-6"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Save rules
            </Button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="overflow-hidden rounded-2xl border border-destructive/20 bg-destructive/[0.03]">
        <SectionHeader
          icon={<AlertTriangle className="h-5 w-5" />}
          title="Danger zone"
          description="Permanently delete this form and every response it collected."
          tone="destructive"
        />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-5 rounded-xl border border-border/70 bg-card p-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Delete this form permanently
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This action is irreversible and will delete all collected
                responses.
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="h-10 shrink-0 px-5"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete form
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Delete this form?
                  </DialogTitle>
                  <DialogDescription className="pt-2 text-sm leading-relaxed">
                    This will permanently delete{" "}
                    <b className="text-foreground">&quot;{formData?.name}&quot;</b>.
                    You will lose all data and configurations associated with
                    this form.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 gap-2 sm:gap-3">
                  <DialogClose asChild>
                    <Button variant="outline" className="flex-1">
                      Keep form
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    variant="destructive"
                    className="flex-1"
                  >
                    {deleteLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Yes, delete forever"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FormSettingsDetailed;
