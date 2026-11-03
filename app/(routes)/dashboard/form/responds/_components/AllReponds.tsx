"use client";

import React, { FC, useState } from "react";
import { FormBlockInstance } from "@/@types/form-block.type";
import { Loader, Download, Inbox, Clock } from "lucide-react";
import { fetchAllResponseByFormId, exportAllResponsesByFormId } from "@/actions/form.action";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Props = {
  blocks: FormBlockInstance[];
  responses: {
    formId: number;
    id: number;
    createdAt: Date;
    jsonReponse: string;
  }[];
  formId: string;
};

const AllReponds: FC<Props> = ({ blocks, responses: initialResponses, formId }) => {
  const [responses, setResponses] = useState(initialResponses);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialResponses.length === 20);

  const exportToCsv = async () => {
    setExportLoading(true);
    try {
      const result = await exportAllResponsesByFormId(formId);
      if (!result.success || !result.responses) {
        toast({ title: "Error", description: "Failed to load responses for export", variant: "destructive" });
        return;
      }

      const parsedBlocks = JSON.parse(result.jsonBlocks || "[]") as FormBlockInstance[];
      const questionsMap: Record<string, string> = {};
      const inputBlockTypes = ["TextField", "TextArea", "RadioSelect", "StarRating", "Checkbox", "Select", "DatePicker"];

      const mapExportBlocks = (blockList: FormBlockInstance[]) => {
        blockList.forEach((block) => {
          if (!block) return;
          if (inputBlockTypes.includes(block.blockType) && block.attributes?.label) {
            questionsMap[block.id] = block.attributes.label;
          }
          if (block.childblocks && block.childblocks.length > 0) {
            mapExportBlocks(block.childblocks);
          }
        });
      };

      mapExportBlocks(parsedBlocks);

      const keys: string[] = [];
      const headers = ["Submitted At"];

      for (const [key, label] of Object.entries(questionsMap)) {
        keys.push(key);
        headers.push(label);
      }

      const csvRows = result.responses.map((res) => {
        const parsedRes = JSON.parse(res.jsonReponse) as Record<string, string>;
        return [
          new Date(res.createdAt).toLocaleString(),
          ...keys.map((key) => String(parsedRes[key] ?? "")),
        ];
      });

      const escapeCsvCell = (value: string) => {
        const safeValue = /^\s*[=+\-@]/.test(value) ? `'${value}` : value;
        return `"${safeValue.replace(/"/g, '""')}"`;
      };
      const csvContent = [headers, ...csvRows]
        .map((row) => row.map(escapeCsvCell).join(","))
        .join("\r\n");
      const blob = new Blob(["\uFEFF", csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `responses_${formId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Something went wrong during export", variant: "destructive" });
    } finally {
      setExportLoading(false);
    }
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    try {
      const result = await fetchAllResponseByFormId(formId, nextPage, 20);
      if (result.success && result.form?.formResponses) {
        setResponses((prev) => [...prev, ...result.form!.formResponses]);
        setPage(nextPage);
        if (result.form.formResponses.length < 20) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const childblockMap: Record<string, string> = {};
  const inputBlockTypes = ["TextField", "TextArea", "RadioSelect", "StarRating", "Checkbox", "Select", "DatePicker"];

  const mapBlocks = (blockList: FormBlockInstance[]) => {
    blockList.forEach((block) => {
      if (!block) return;
      if (inputBlockTypes.includes(block.blockType) && block.attributes?.label) {
        childblockMap[block.id] = block.attributes.label;
      }
      if (block.childblocks && block.childblocks.length > 0) {
        mapBlocks(block.childblocks);
      }
    });
  };

  mapBlocks(blocks);

  return (
    <div className="mt-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight">Submissions</h2>
        <Button
          onClick={exportToCsv}
          disabled={exportLoading || responses.length === 0}
          variant="outline"
          size="sm"
          className="h-9 gap-2"
        >
          {exportLoading ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
          {exportLoading ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {responses.map((response, index) => {
          const parsedResponses = JSON.parse(response.jsonReponse) as Record<string, string>;
          const entries = Object.entries(parsedResponses);

          return (
            <article
              key={response.id}
              className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all duration-300 hover:border-primary/25 hover:shadow-lift"
            >
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
                    {responses.length - index}
                  </span>
                  <h4 className="text-sm font-semibold">Response</h4>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(response.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <dl className="space-y-3">
                {entries.length === 0 && (
                  <div className="py-2 text-sm text-muted-foreground">No answers recorded.</div>
                )}
                {entries.map(([key, value]) => (
                  <div key={key} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3">
                    <dt className="truncate text-xs font-medium text-muted-foreground">
                      {childblockMap[key] || "Unknown field"}
                    </dt>
                    <dd className="break-words text-sm font-medium text-foreground">
                      {String(value) || "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          );
        })}

        {responses.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 py-16 text-center">
            <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Inbox className="h-6 w-6" />
            </span>
            <h3 className="text-base font-bold">No responses yet</h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Share your form link and responses will show up here in real time.
            </p>
          </div>
        )}

        {hasMore && (
          <div className="col-span-full flex justify-center pt-2">
            <Button onClick={loadMore} disabled={loading} variant="outline">
              {loading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Loading..." : "Load more"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllReponds;
