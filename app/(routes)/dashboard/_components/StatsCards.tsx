import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchFormStats } from "@/actions/form.action";
import { Activity, FileText, MessageSquare, TrendingUp } from "lucide-react";
import React from "react";

const cardStyles = [
  {
    icon: FileText,
    accent: "text-primary",
    bg: "bg-primary/10",
    bar: "from-primary/70 via-primary/30 to-transparent",
  },
  {
    icon: MessageSquare,
    accent: "text-fuchsia-600",
    bg: "bg-fuchsia-500/10",
    bar: "from-fuchsia-500/70 via-fuchsia-500/25 to-transparent",
  },
  {
    icon: TrendingUp,
    accent: "text-emerald-600",
    bg: "bg-emerald-500/10",
    bar: "from-emerald-500/70 via-emerald-500/25 to-transparent",
  },
  {
    icon: Activity,
    accent: "text-sky-600",
    bg: "bg-sky-500/10",
    bar: "from-sky-500/70 via-sky-500/25 to-transparent",
  },
];

const StatsCards = (props: {
  data: Awaited<ReturnType<typeof fetchFormStats>>;
  loading: boolean;
}) => {
  const { loading, data } = props;

  const cards = [
    {
      label: "Total forms",
      value: data?.totalForms || 0,
      hint: "Forms created on your account",
    },
    {
      label: "Total responses",
      value: data?.totalResponses || 0,
      hint: "Responses across every form",
    },
    {
      label: "Conversion rate",
      value: `${data?.conversionRate?.toFixed(1) ?? "0.0"}%`,
      hint: "Views that became responses",
    },
    {
      label: "Engagement",
      value: `${data?.engagementRate?.toFixed(1) ?? "0.0"}%`,
      hint: "Forms that received responses",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const style = cardStyles[index];
        const Icon = style.icon;
        return (
          <Card
            key={card.label}
            className="relative overflow-hidden border-border/70 bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lift"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 p-0 pb-3">
              <CardDescription className="text-[13px] font-medium text-muted-foreground">
                {card.label}
              </CardDescription>
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl ${style.bg} ${style.accent}`}
              >
                <Icon className="h-4 w-4" />
              </span>
            </CardHeader>
            <CardTitle className="text-3xl font-extrabold tracking-tight">
              {loading ? (
                <span className="inline-block h-8 w-16 animate-pulse rounded-md bg-muted" />
              ) : (
                card.value
              )}
            </CardTitle>
            <CardContent className="p-0 pt-1.5">
              <div className="text-xs text-muted-foreground">{card.hint}</div>
            </CardContent>
            <span
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r ${style.bar}`}
            />
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
