import { Link } from "@tanstack/react-router";
import { Send, Cloud, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

export function Header() {
  const { isAdmin, logout } = useAdmin();

  return (
    <header className="sticky top-0 z-40 w-full px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm backdrop-blur transition hover:bg-white">
          <img src="/logo.png" alt="Central PJ" className="h-7 w-7" />
          <span className="font-semibold text-foreground">Central PJ</span>
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-white/60 bg-white/70 px-2 py-1.5 shadow-md backdrop-blur">
          <NavLink to="/" icon={<Send className="h-4 w-4" />}>Início</NavLink>
          <NavLink to="/feed" icon={<Cloud className="h-4 w-4" />}>Feed</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/70 bg-gradient-to-br from-amber-50 to-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" /> Admin
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition hover:bg-white hover:text-foreground"
                title="Sair do modo admin"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition hover:bg-white hover:text-foreground"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({
  to,
  icon,
  children,
}: {
  to: "/" | "/feed";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      activeProps={{
        className:
          "bg-gradient-to-r from-primary/60 to-primary-glow/60 text-foreground shadow-sm",
      }}
    >
      {icon}
      {children}
    </Link>
  );
}
