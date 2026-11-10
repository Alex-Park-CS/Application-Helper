import Link from "next/link";
import { logout } from "@/lib/auth/actions";

// Layout for every logged-in page. "(app)" is a route group: it shares this
// header without adding "/app" to the URL. The login page sits outside it.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="font-semibold">
            Application Helper
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/applications/new" className="btn-primary">
              + Add application
            </Link>
            <form action={logout}>
              <button type="submit" className="btn">
                Log out
              </button>
            </form>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </>
  );
}
