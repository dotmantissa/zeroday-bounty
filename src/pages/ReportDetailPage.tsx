import { useParams, Link } from "react-router-dom";
import { useReport, useEvaluateReport } from "@/hooks/useContract";
import { useWallet } from "@/contexts/WalletContext";
import { StatusBadge, SeverityBadge } from "@/components/Badges";
import { formatAddress } from "@/lib/genlayer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, ExternalLink } from "lucide-react";

export default function ReportDetailPage() {
  const { id } = useParams();
  const { data: report, isLoading } = useReport(id);
  const { isConnected } = useWallet();
  const evaluateMutation = useEvaluateReport();

  if (isLoading) return <div className="container py-8 text-muted-foreground font-mono">Loading...</div>;
  if (!report) return <div className="container py-8 text-destructive font-mono">Report not found</div>;

  return (
    <div className="container py-8 space-y-6 max-w-4xl">
      <Link to="/reports" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary font-mono text-xs">
        <ArrowLeft className="h-3 w-3" /> Back to Reports
      </Link>

      {/* Header */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-foreground mb-1">{report.title}</h1>
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span>Report #{report.report_id}</span>
              <span>·</span>
              <Link to={`/programs/${report.program_id}`} className="text-primary hover:underline">Program #{report.program_id}</Link>
              <span>·</span>
              <span>{report.vulnerability_type}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SeverityBadge severity={report.severity_claim} />
            <StatusBadge status={report.status} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          <InfoBlock label="HACKER" value={formatAddress(report.hacker, 20)} />
          <InfoBlock label="AFFECTED COMPONENT" value={report.affected_component || "N/A"} />
          <InfoBlock label="CVSS VECTOR" value={report.cvss_vector || "N/A"} />
        </div>

        {report.poc_url && (
          <a
            href={report.poc_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" /> Proof of Concept
          </a>
        )}
      </div>

      {/* Description */}
      <Section title="DESCRIPTION" content={report.description} />
      <Section title="IMPACT" content={report.impact} />
      <Section title="REPRODUCTION STEPS" content={report.reproduction_steps} />

      {/* AI Evaluation */}
      {report.ai_verdict && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 border-glow p-6 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-mono text-sm text-primary font-semibold">AI EVALUATION</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <InfoBlock label="VERDICT" value={report.ai_verdict} />
            <InfoBlock label="AI SEVERITY" value={report.ai_severity} />
            <InfoBlock label="CVSS SCORE" value={String(report.ai_cvss_score)} />
            <InfoBlock label="BOUNTY PAID" value={`${report.bounty_paid} GEN`} />
          </div>
          {report.ai_reasoning && <Section title="REASONING" content={report.ai_reasoning} />}
          {report.ai_validity_notes && <Section title="VALIDITY NOTES" content={report.ai_validity_notes} />}
          {report.ai_scope_notes && <Section title="SCOPE NOTES" content={report.ai_scope_notes} />}
          {report.ai_duplicate_flag && (
            <div className="font-mono text-xs text-severity-medium">⚠ Flagged as potential duplicate</div>
          )}
        </div>
      )}

      {/* Evaluate button */}
      {report.status === "SUBMITTED" && isConnected && (
        <Button
          onClick={() => evaluateMutation.mutate(report.report_id)}
          disabled={evaluateMutation.isPending}
          className="bg-primary text-primary-foreground font-mono"
        >
          <Brain className="mr-2 h-4 w-4" />
          {evaluateMutation.isPending ? "Evaluating... (this may take minutes)" : "Trigger AI Evaluation"}
        </Button>
      )}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border bg-secondary p-3">
      <span className="font-mono text-[10px] text-muted-foreground block">{label}</span>
      <span className="font-mono text-xs text-foreground break-all">{value}</span>
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  if (!content) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <span className="font-mono text-[10px] text-muted-foreground block mb-2">{title}</span>
      <p className="text-sm text-foreground whitespace-pre-wrap">{content}</p>
    </div>
  );
}
