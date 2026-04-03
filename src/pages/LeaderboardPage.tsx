import { useLeaderboard } from "@/hooks/useContract";
import { formatAddress } from "@/lib/genlayer";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useLeaderboard();

  return (
    <div className="container py-8 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-sm text-muted-foreground font-mono">Top white-hat hunters ranked by earnings</p>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground font-mono text-sm">Loading...</div>
      ) : !leaderboard?.length ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">No hackers on the leaderboard yet</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card divide-y divide-border">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 font-mono text-[10px] text-muted-foreground">
            <span className="col-span-1">#</span>
            <span className="col-span-3">ADDRESS</span>
            <span className="col-span-2 text-right">EARNED</span>
            <span className="col-span-1 text-right">PAID</span>
            <span className="col-span-1 text-right">REJ</span>
            <span className="col-span-1 text-right">CRIT</span>
            <span className="col-span-1 text-right">HIGH</span>
            <span className="col-span-1 text-right">MED</span>
            <span className="col-span-1 text-right">LOW</span>
          </div>

          {leaderboard.map((h: any, i: number) => (
            <div
              key={h.address}
              className={`grid grid-cols-12 gap-2 px-4 py-3 items-center font-mono text-xs ${
                i === 0 ? "bg-primary/5" : ""
              }`}
            >
              <span className={`col-span-1 font-bold ${i === 0 ? "text-accent" : i < 3 ? "text-primary" : "text-muted-foreground"}`}>
                {i + 1}
              </span>
              <span className="col-span-3 text-foreground">{formatAddress(h.address, 16)}</span>
              <span className="col-span-2 text-right text-primary">{h.total_earned}</span>
              <span className="col-span-1 text-right text-foreground">{h.reports_paid}</span>
              <span className="col-span-1 text-right text-destructive">{h.reports_rejected}</span>
              <span className="col-span-1 text-right text-severity-critical">{h.critical_finds}</span>
              <span className="col-span-1 text-right text-severity-high">{h.high_finds}</span>
              <span className="col-span-1 text-right text-severity-medium">{h.medium_finds}</span>
              <span className="col-span-1 text-right text-severity-low">{h.low_finds}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
