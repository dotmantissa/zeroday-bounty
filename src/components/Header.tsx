import { Link, useLocation } from "react-router-dom";
import { WalletPanel } from "./WalletPanel";
import { Shield, Bug, Trophy, FileText, PlusCircle } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: Shield },
  { to: "/programs", label: "Programs", icon: FileText },
  { to: "/reports", label: "Reports", icon: Bug },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/submit", label: "Submit", icon: PlusCircle },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-primary text-glow tracking-wider">ZERODAY</span>
              <span className="font-mono text-[10px] text-muted-foreground -mt-1">BOUNTY</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <WalletPanel />
      </div>
    </header>
  );
}
