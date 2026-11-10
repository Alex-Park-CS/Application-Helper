import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/ApplicationForm";
import { DeleteButton } from "@/components/DeleteButton";
import { saveApplication } from "@/lib/applications/actions";
import { getApplication } from "@/lib/applications/queries";
import { toFormValues } from "@/lib/applications/schema";

export default function EditApplicationPage({ params }: PageProps<"/applications/[id]">) {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
      <EditApplication params={params} />
    </Suspense>
  );
}

async function EditApplication({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const application = Number.isInteger(id) ? await getApplication(id) : null;
  if (!application) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">
          {application.company} <span className="font-normal text-slate-500">— {application.roleTitle}</span>
        </h1>
        <DeleteButton id={application.id} company={application.company} goToList />
      </div>
      <ApplicationForm
        action={saveApplication.bind(null, application.id)}
        initialValues={toFormValues(application)}
        submitLabel="Save changes"
      />
    </div>
  );
}
