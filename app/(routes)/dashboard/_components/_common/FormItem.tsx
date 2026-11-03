"use client";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ActivityIcon,
  ArrowUpRight,
  BarChart2,
  Edit2,
  EllipsisIcon,
  ExternalLink,
  Globe,
  Loader2,
  LockKeyholeIcon,
  MessageSquare,
  Settings2,
  Trash2,
} from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteForm } from "@/actions/form.action";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type PropsType = {
  id: number;
  formId: string;
  name: string;
  responses: number;
  views: number;
  createdAt: Date;
  published: boolean;
  backgroundColor: string;
};

const FormItem = (props: PropsType) => {
  const {
    formId,
    name,
    published,
    createdAt,
    responses = 0,
    views = 0,
    backgroundColor,
  } = props;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = useCallback(() => {
    router.push(`/dashboard/form/builder/${formId}`);
  }, [formId, router]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      const res = await deleteForm(formId);
      if (res.success) {
        toast({ title: "Deleted", description: "Form deleted successfully" });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: res.message,
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

  const gradient = backgroundColor
    ? `linear-gradient(135deg, ${backgroundColor}55 0%, ${backgroundColor}1f 45%, hsl(var(--card)) 100%)`
    : "linear-gradient(135deg, hsl(var(--primary)/0.2) 0%, hsl(var(--primary)/0.06) 45%, hsl(var(--card)) 100%)";

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onClick();
      }}
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      {/* Preview */}
      <div
        className="relative flex h-[172px] items-center justify-center overflow-hidden border-b border-border/60"
        style={{ background: gradient }}
      >
        <div className="absolute inset-0 bg-dots opacity-40" />

        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur ${
            published
              ? "border-emerald-500/25 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              : "border-border/70 bg-background/70 text-muted-foreground"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              published ? "bg-emerald-500" : "bg-muted-foreground/50"
            }`}
          />
          {published ? "Live" : "Draft"}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Form actions"
              className="absolute right-2.5 top-2.5 h-8 w-8 rounded-lg border border-border/60 bg-background/70 backdrop-blur hover:bg-background"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <EllipsisIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/form/builder/${formId}`);
              }}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit form
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/form/responds/${formId}`);
              }}
              className="gap-2"
            >
              <BarChart2 className="h-4 w-4" />
              View responses
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/form/settings/${formId}`);
              }}
              className="gap-2"
            >
              <Settings2 className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            {published && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/public/submit-form/${formId}`, "_blank");
                }}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open live form
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={loading}
              className="gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
              {loading ? "Deleting..." : "Delete form"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mini form mock */}
        <div className="relative mt-5 w-[152px] overflow-hidden rounded-lg border border-white/60 bg-white shadow-[0_16px_36px_-16px_rgba(24,16,64,0.4)] transition-transform duration-500 group-hover:-translate-y-1 dark:border-white/10 dark:bg-neutral-900">
          <div
            className="h-6 w-full"
            style={{
              background: backgroundColor
                ? `linear-gradient(90deg, ${backgroundColor}, ${backgroundColor}aa)`
                : "linear-gradient(90deg, hsl(var(--primary)), hsl(330 82% 60%))",
            }}
          />
          <div className="space-y-1.5 p-3">
            <div className="h-1.5 w-2/3 rounded-full bg-neutral-800/70 dark:bg-white/60" />
            <div className="h-3.5 w-full rounded border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5" />
            <div className="h-3.5 w-full rounded border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5" />
            <div className="h-4 w-1/2 rounded bg-primary/90" />
          </div>
        </div>

        <span className="absolute bottom-2.5 right-3 hidden items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-[10px] font-semibold text-foreground backdrop-blur group-hover:flex">
          Open builder
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-[15px] font-semibold tracking-tight transition-colors group-hover:text-primary">
            {name || "Untitled form"}
          </h3>
          <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
            {formatDistanceToNowStrict(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-4 border-t border-border/60 pt-3">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            {published ? (
              <Globe className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <LockKeyholeIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
            )}
            {published ? "Published" : "Private"}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" />
            {responses}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ActivityIcon className="h-3.5 w-3.5" />
            {views}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormItem;
