import { useReports } from "@/hooks/useContract";
import { StatusBadge, SeverityBadge } from "@/components/Badges";
import { formatAddress } from "@/lib/genlayer";
import { Link } from "react-router-dom";
import { Bug } from "lucide-react";

export default function ReportsPage() {
  const { data: reports, isLoading } = useReports();

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Vulnerability Reports</h1>
        <p className="text-sm text-muted-foreground font-mono">All submitted vulnerability reports</p>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground font-mono text-sm">Loading reports...</div>
      ) : reports?.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Bug className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">No reports submitted yet</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card divide-y divide-border">
          {reports?.map((r: any) => (
            <Link
              key={r.report_id}
              to={`/reports/${r.report_id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm text-foreground truncate">{r.title}</div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  #{r.report_id} · Program #{r.program_id} · {formatAddress(r.hacker)} · {r.vulnerability_type}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2 shrink-0">
                <SeverityBadge severity={r.severity_claim} />
                <StatusBadge status={r.status} />
                {r.bounty_paid > 0 && (
                  <span className="font-mono text-[10px] text-primary">{r.bounty_paid} GEN</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
