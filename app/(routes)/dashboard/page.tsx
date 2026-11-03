import React, { Suspense } from "react";
import { fetchAllForms, fetchFormStats } from "@/actions/form.action";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import StatsCards from "./_components/StatsCards";
import CreateForm from "./_components/CreateForm";
import FormSkeleton from "./_components/_common/FormSkeleton";
import FormItem from "./_components/_common/FormItem";
import { Sparkles } from "lucide-react";

const Dashboard = async () => {
  const [stats, kinde] = await Promise.all([
    fetchFormStats(),
    getKindeServerSession(),
  ]);
  const totalForms = stats.success ? (stats.totalForms ?? 0) : 0;
  let firstName: string | undefined;
  try {
    const user = await kinde.getUser();
    firstName = user?.given_name || undefined;
  } catch {
    firstName = undefined;
  }

  return (
    <div className="w-full pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <section className="flex flex-col gap-5 py-8 md:flex-row md:items-end md:justify-between md:py-10">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              <Sparkles className="h-3 w-3" />
              Workspace overview
            </div>
            <h1 className="text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">
              {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
            </h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Track how your forms are performing and jump back into the builder.
            </p>
          </div>
          <CreateForm />
        </section>

        {/* Stats */}
        <section className="stats-section w-full">
          <StatsCards loading={false} data={stats} />
        </section>

        {/* Forms */}
        <section className="w-full pt-10 pb-10">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight">All forms</h2>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {totalForms}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Suspense
              fallback={
                totalForms > 0
                  ? Array.from({ length: totalForms }).map((_, idx) => (
                      <FormSkeleton key={idx} />
                    ))
                  : [1, 2, 3].map((item) => <FormSkeleton key={item} />)
              }
            >
              <FormList />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
};

async function FormList() {
  const { form } = await fetchAllForms();

  if (!form || form.length === 0) {
    return (
      <div className="col-span-full overflow-hidden rounded-3xl border border-dashed border-border bg-card/50 p-10 text-center md:p-14">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold">No forms yet</h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
          Create your first form from scratch, or let AI generate one from a single
          sentence.
        </p>
        <div className="mt-6 flex justify-center">
          <CreateForm label="Create your first form" />
        </div>
      </div>
    );
  }

  return (
    <>
      {form.map((form) => (
        <FormItem
          key={form.id}
          id={form.id}
          formId={form.formId}
          name={form.name}
          published={form.published}
          createdAt={form.createdAt}
          responses={form.responses}
          views={form.views}
          backgroundColor={form.settings.backgroundColor}
        />
      ))}
    </>
  );
}

export default Dashboard;
