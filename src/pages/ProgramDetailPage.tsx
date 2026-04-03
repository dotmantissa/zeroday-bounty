import { useParams, Link } from "react-router-dom";
import { useProgram, useReportsForProgram } from "@/hooks/useContract";
import { StatusBadge, SeverityBadge } from "@/components/Badges";
import { formatAddress } from "@/lib/genlayer";
import { ArrowLeft, Bug, Shield } from "lucide-react";

export default function ProgramDetailPage() {
  const { id } = useParams();
  const { data: program, isLoading } = useProgram(id);
  const { data: reports } = useReportsForProgram(id);

  if (isLoading) return <div className="container py-8 text-muted-foreground font-mono">Loading...</div>;
  if (!program) return <div className="container py-8 text-destructive font-mono">Program not found</div>;

  const matrix = program.threat_matrix || {};

  return (
    <div className="container py-8 space-y-6">
      <Link to="/programs" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary font-mono text-xs">
        <ArrowLeft className="h-3 w-3" /> Back to Programs
      </Link>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">{program.name}</h1>
          <StatusBadge status={program.status} />
        </div>
        <p className="text-sm text-muted-foreground mb-4">{program.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="rounded border border-border bg-secondary p-3">
            <span className="font-mono text-[10px] text-muted-foreground block">OWNER</span>
            <span className="font-mono text-xs text-foreground">{formatAddress(program.owner)}</span>
          </div>
          <div className="rounded border border-border bg-secondary p-3">
            <span className="font-mono text-[10px] text-muted-foreground block">REPORTS</span>
            <span className="font-mono text-xs text-foreground">{program.reports_count}</span>
          </div>
          <div className="rounded border border-border bg-secondary p-3">
            <span className="font-mono text-[10px] text-muted-foreground block">PAID</span>
            <span className="font-mono text-xs text-primary">{program.paid_count}</span>
          </div>
          <div className="rounded border border-border bg-secondary p-3">
            <span className="font-mono text-[10px] text-muted-foreground block">TOTAL PAID</span>
            <span className="font-mono text-xs text-primary">{program.total_paid}</span>
          </div>
        </div>

        {/* Bounty tiers */}
        {matrix.bounties && (
          <div className="mb-4">
            <span className="font-mono text-xs text-muted-foreground block mb-2">BOUNTY TIERS</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(matrix.bounties).map(([tier, amount]) => (
                <div key={tier} className="rounded border border-border bg-background px-3 py-1.5 font-mono text-xs">
                  <SeverityBadge severity={tier} /> <span className="ml-2 text-foreground">{String(amount)} GEN</span>
                  {program.locked_funds?.[tier] !== undefined && (
                    <span className="ml-1 text-muted-foreground">({String(program.locked_funds[tier])} remaining)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {matrix.scope && (
          <div className="mb-3">
            <span className="font-mono text-xs text-muted-foreground block mb-1">SCOPE</span>
            <div className="flex flex-wrap gap-1">
              {matrix.scope.map((s: string) => (
                <span key={s} className="rounded bg-primary/10 border border-primary/20 px-2 py-0.5 font-mono text-[10px] text-primary">{s}</span>
              ))}
            </div>
          </div>
        )}

        {matrix.vulnerability_types && (
          <div>
            <span className="font-mono text-xs text-muted-foreground block mb-1">VULNERABILITY TYPES</span>
            <div className="flex flex-wrap gap-1">
              {matrix.vulnerability_types.map((v: string) => (
                <span key={v} className="rounded bg-secondary border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{v}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reports for this program */}
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3 flex items-center gap-2">
          <Bug className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground">REPORTS ({reports?.length || 0})</span>
        </div>
        <div className="divide-y divide-border">
          {!reports?.length ? (
            <div className="p-4 font-mono text-xs text-muted-foreground">No reports submitted yet</div>
          ) : (
            reports.map((r: any) => (
              <Link
                key={r.report_id}
                to={`/reports/${r.report_id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm text-foreground truncate">{r.title}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {formatAddress(r.hacker)} · {r.vulnerability_type}
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

      {program.status === "ACTIVE" && (
        <Link
          to={`/submit?program=${id}`}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 font-mono text-xs text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Bug className="h-3.5 w-3.5" />
          Submit Report
        </Link>
      )}
    </div>
  );
}
