import { Link } from "@tanstack/react-router";
import { LogIn, LogOut, ShieldCheck } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

export function Header() {
  const { isAdmin, logout } = useAdmin();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Central PJ" className="h-9 w-9" />
          <div className="leading-tight">
            <p className="font-display text-base font-semibold text-foreground">
              Central PJ
            </p>
            <p className="text-xs text-muted-foreground">Produtiva Junior</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/">Início</NavLink>
          <NavLink to="/feed">Feed</NavLink>

          {isAdmin ? (
            <>
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-1 text-xs font-semibold text-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> Admin
              </span>
              <button
                onClick={logout}
                className="ml-1 inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title="Sair do modo admin"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="ml-2 inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: "/" | "/feed"; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      activeProps={{ className: "bg-primary/15 text-foreground" }}
    >
      {children}
    </Link>
  );
}
