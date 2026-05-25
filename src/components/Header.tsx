import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Produtiva Junior" className="h-9 w-9" />
          <div className="leading-tight">
            <p className="font-display text-base font-semibold text-foreground">
              Produtiva Junior
            </p>
            <p className="text-xs text-muted-foreground">Central interna</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/">Início</NavLink>
          <NavLink to="/feed">Feed</NavLink>
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
