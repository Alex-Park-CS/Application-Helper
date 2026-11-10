import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-center text-xl font-semibold">Application Helper</h1>
        <LoginForm />
      </div>
    </main>
  );
}
