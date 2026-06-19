import { getHappeningDetails } from "@/lib/pulse";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/pulse/status-badge";
import { AddUpdateForm } from "@/components/pulse/add-update-form";
import { DeleteHappeningButton } from "@/components/pulse/delete-happening-button";
import { DeleteUpdateButton } from "@/components/pulse/delete-update-button";
import { EditHappeningButton } from "@/components/pulse/edit-happening-button";
import { Card, CardContent } from "@/components/ui/card";
import { AddSourceForm } from "@/components/pulse/add-source-form";
import { Happening } from "@/lib/types/pulse";

export default async function HappeningDetailPage(props: {
  params: Promise<{ happeningId: string }>;
}) {
  const params = await props.params;
  const happening = await getHappeningDetails(params.happeningId);

  if (!happening) {
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{happening.title}</h1>
            <StatusBadge status={happening.status as "idea" | "exploring" | "pending_decision" | "confirmed" | "active" | "done" | "cancelled" | "archived"} />
          </div>
          <p className="text-muted-foreground text-lg">
            {happening.description}
          </p>
        </div>
          <div className="flex gap-2">
            <EditHappeningButton happening={happening as Happening} />
            <DeleteHappeningButton happeningId={happening.id} />
          </div>
      </div>
      <section>
        <h2 className="text-xl font-semibold mb-4">Timeline</h2>
        <div className="space-y-4">
          {happening.updates.length === 0 && (
            <p className="text-muted-foreground">No updates yet.</p>
          )}
          {happening.updates.map((update) => (
            <Card key={update.id}>
              <CardContent className="p-4 flex justify-between items-start">
                <div>
                  <p>{update.body}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {update.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <DeleteUpdateButton
                  updateId={update.id}
                  happeningId={happening.id}
                />
              </CardContent>
            </Card>
          ))}
        </div>
        <AddUpdateForm happeningId={happening.id} />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">History</h2>
        <div className="space-y-2">
          {happening.history.map((log) => (
            <div
              key={log.id}
              className="text-sm p-3 border rounded-lg bg-zinc-900/50"
            >
              <span className="font-medium text-primary">{log.action}</span>
              <span className="text-muted-foreground">
                {" "}
                at {log.timestamp.toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Sources</h2>
        {happening.sources.length === 0 && (
          <p className="text-muted-foreground">No sources linked.</p>
        )}
        <ul className="space-y-2">
          {happening.sources.map((source) => (
            <li key={source.id} className="text-sm">
              <a
                href={source.url || "#"}
                className="text-blue-500 hover:underline"
              >
                {source.title || source.sourceType}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <AddSourceForm happeningId={happening.id} />
        </div>
      </section>
    </div>
  );
}
