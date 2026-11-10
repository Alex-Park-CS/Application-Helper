import { ApplicationForm } from "@/components/ApplicationForm";
import { saveApplication } from "@/lib/applications/actions";

export default function NewApplicationPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Add application</h1>
      <ApplicationForm action={saveApplication.bind(null, null)} submitLabel="Add application" />
    </div>
  );
}
