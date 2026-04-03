import { useActivePrograms, useReports, useLeaderboard } from "@/hooks/useContract";
import { useWallet } from "@/contexts/WalletContext";
import { StatusBadge, SeverityBadge } from "@/components/Badges";
import { formatAddress } from "@/lib/genlayer";
import { Link } from "react-router-dom";
import { Shield, Bug, Trophy, Zap, ArrowRight, AlertTriangle } from "lucide-react";

function StatCard({ icon: Icon, label, value, accent = false }: { icon: any; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${accent ? "border-primary/30 bg-primary/5 border-glow" : "border-border bg-card"}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
      </div>
      <span className={`font-mono text-2xl font-bold ${accent ? "text-primary text-glow" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { data: programs, isLoading: loadingPrograms } = useActivePrograms();
  const { data: reports, isLoading: loadingReports } = useReports();
  const { data: leaderboard } = useLeaderboard();
  const { isConnected } = useWallet();

  const totalBounties = programs?.reduce((sum, p) => {
    const funds = p.locked_funds || {};
    return sum + Object.values(funds).reduce((a: number, b: any) => a + Number(b), 0);
  }, 0) || 0;

  const paidReports = reports?.filter((r: any) => r.status === "PAID") || [];

  return (
    <div className="container py-8 space-y-8">
      {/* Hero */}
      <div className="relative rounded-xl border border-border bg-card p-8 overflow-hidden">
        <div className="scanline absolute inset-0 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="font-mono text-xs text-primary">SYSTEM ONLINE</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Zero-Day Bounty <span className="text-primary text-glow">Oracle</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Trustless bug bounty platform powered by GenLayer AI validators. Submit vulnerabilities,
            get evaluated by consensus, receive automatic payouts.
          </p>
          {!isConnected && (
            <div className="mt-4 flex items-center gap-2 text-accent font-mono text-xs">
              <AlertTriangle className="h-3.5 w-3.5" />
              Connect or create a wallet to start
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Shield} label="ACTIVE PROGRAMS" value={programs?.length || 0} accent />
        <StatCard icon={Bug} label="TOTAL REPORTS" value={reports?.length || 0} />
        <StatCard icon={Zap} label="BOUNTIES PAID" value={paidReports.length} />
        <StatCard icon={Trophy} label="TOTAL BOUNTY POOL" value={`${totalBounties.toLocaleString()}`} accent />
      </div>

      {/* Recent */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Programs */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-mono text-xs text-muted-foreground">RECENT PROGRAMS</span>
            <Link to="/programs" className="flex items-center gap-1 text-primary font-mono text-xs hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {loadingPrograms ? (
              <div className="p-4 text-muted-foreground text-xs font-mono">Loading...</div>
            ) : programs?.length === 0 ? (
              <div className="p-4 text-muted-foreground text-xs font-mono">No programs yet</div>
            ) : (
              programs?.slice(0, 5).map((p: any) => (
                <Link key={p.program_id} to={`/programs/${p.program_id}`} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors">
                  <div>
                    <div className="font-mono text-sm text-foreground">{p.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{p.reports_count || 0} reports</div>
                  </div>
                  <StatusBadge status={p.status} />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-mono text-xs text-muted-foreground">RECENT REPORTS</span>
            <Link to="/reports" className="flex items-center gap-1 text-primary font-mono text-xs hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {loadingReports ? (
              <div className="p-4 text-muted-foreground text-xs font-mono">Loading...</div>
            ) : reports?.length === 0 ? (
              <div className="p-4 text-muted-foreground text-xs font-mono">No reports yet</div>
            ) : (
              reports?.slice(0, 5).map((r: any) => (
                <Link key={r.report_id} to={`/reports/${r.report_id}`} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-foreground truncate">{r.title}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      by {formatAddress(r.hacker)} · {r.vulnerability_type}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <SeverityBadge severity={r.severity_claim} />
                    <StatusBadge status={r.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard preview */}
      {leaderboard && leaderboard.length > 0 && (
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-mono text-xs text-muted-foreground">TOP HUNTERS</span>
            <Link to="/leaderboard" className="flex items-center gap-1 text-primary font-mono text-xs hover:underline">
              Full leaderboard <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {leaderboard.slice(0, 3).map((h: any, i: number) => (
              <div key={h.address} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-lg font-bold ${i === 0 ? "text-accent" : "text-muted-foreground"}`}>#{i + 1}</span>
                  <span className="font-mono text-sm text-foreground">{formatAddress(h.address)}</span>
                </div>
                <div className="flex items-center gap-4 font-mono text-xs">
                  <span className="text-primary">{h.total_earned} earned</span>
                  <span className="text-muted-foreground">{h.reports_paid} paid</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
