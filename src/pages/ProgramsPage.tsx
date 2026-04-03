import { usePrograms } from "@/hooks/useContract";
import { StatusBadge } from "@/components/Badges";
import { Link } from "react-router-dom";
import { FileText, ExternalLink } from "lucide-react";

export default function ProgramsPage() {
  const { data: programs, isLoading } = usePrograms();

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bounty Programs</h1>
          <p className="text-sm text-muted-foreground font-mono">Active threat intelligence programs</p>
        </div>
        <Link
          to="/create-program"
          className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 font-mono text-xs text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <FileText className="h-3.5 w-3.5" />
          Create Program
        </Link>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground font-mono text-sm">Loading programs...</div>
      ) : programs?.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">No programs created yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {programs?.map((p: any) => (
            <Link
              key={p.program_id}
              to={`/programs/${p.program_id}`}
              className="rounded-lg border border-border bg-card p-5 hover:border-primary/30 hover:border-glow transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-mono text-base font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex items-center gap-6 font-mono text-xs text-muted-foreground">
                <span>{p.reports_count || 0} reports</span>
                <span>{p.paid_count || 0} paid</span>
                <span className="text-primary">{p.total_paid || 0} total paid</span>
              </div>

              {p.threat_matrix?.bounties && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {Object.entries(p.threat_matrix.bounties).map(([tier, amount]) => (
                    <div key={tier} className="rounded border border-border bg-secondary px-2 py-0.5 font-mono text-[10px]">
                      <span className="text-muted-foreground">{tier}:</span>{" "}
                      <span className="text-foreground">{String(amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
