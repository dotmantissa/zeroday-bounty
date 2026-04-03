import { Badge } from "@/components/ui/badge";

export function SeverityBadge({ severity }: { severity: string }) {
  const colorMap: Record<string, string> = {
    CRITICAL: "bg-severity-critical/20 text-severity-critical border-severity-critical/30",
    HIGH: "bg-severity-high/20 text-severity-high border-severity-high/30",
    MEDIUM: "bg-severity-medium/20 text-severity-medium border-severity-medium/30",
    LOW: "bg-severity-low/20 text-severity-low border-severity-low/30",
    INFORMATIONAL: "bg-severity-info/20 text-severity-info border-severity-info/30",
  };

  return (
    <Badge variant="outline" className={`font-mono text-[10px] ${colorMap[severity] || colorMap.INFORMATIONAL}`}>
      {severity}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    ACTIVE: "bg-status-active/20 text-status-active border-status-active/30",
    PAUSED: "bg-status-paused/20 text-status-paused border-status-paused/30",
    CLOSED: "bg-status-closed/20 text-status-closed border-status-closed/30",
    PAID: "bg-status-paid/20 text-status-paid border-status-paid/30",
    REJECTED: "bg-status-rejected/20 text-status-rejected border-status-rejected/30",
    SUBMITTED: "bg-status-submitted/20 text-status-submitted border-status-submitted/30",
    DUPLICATE: "bg-severity-medium/20 text-severity-medium border-severity-medium/30",
    INFORMATIONAL: "bg-severity-info/20 text-severity-info border-severity-info/30",
  };

  return (
    <Badge variant="outline" className={`font-mono text-[10px] ${colorMap[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </Badge>
  );
}
