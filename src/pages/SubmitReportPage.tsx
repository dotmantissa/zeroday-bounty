import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSubmitReport, useActivePrograms } from "@/hooks/useContract";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bug, AlertTriangle } from "lucide-react";

const SEVERITY_OPTIONS = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFORMATIONAL"];

export default function SubmitReportPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const { data: programs } = useActivePrograms();
  const submitMutation = useSubmitReport();

  const [form, setForm] = useState({
    program_id: searchParams.get("program") || "",
    title: "",
    vulnerability_type: "",
    severity_claim: "",
    description: "",
    impact: "",
    poc_url: "",
    cvss_vector: "",
    affected_component: "",
    reproduction_steps: "",
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitMutation.mutateAsync(form);
    navigate("/reports");
  };

  if (!isConnected) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-8 text-center">
          <AlertTriangle className="h-8 w-8 text-accent mx-auto mb-3" />
          <p className="text-accent font-mono text-sm">Connect or create a wallet to submit reports</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Submit Vulnerability Report</h1>
        <p className="text-sm text-muted-foreground font-mono">File a report for AI-powered evaluation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-mono text-xs text-muted-foreground block mb-1">TARGET PROGRAM *</label>
          <Select value={form.program_id} onValueChange={(v) => update("program_id", v)}>
            <SelectTrigger className="bg-card border-border font-mono text-sm">
              <SelectValue placeholder="Select a program" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {programs?.map((p: any) => (
                <SelectItem key={p.program_id} value={p.program_id} className="font-mono text-sm">
                  #{p.program_id} — {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Field label="TITLE *" value={form.title} onChange={(v) => update("title", v)} placeholder="e.g. SQL Injection in /api/users" />
        <Field label="VULNERABILITY TYPE *" value={form.vulnerability_type} onChange={(v) => update("vulnerability_type", v)} placeholder="e.g. SQL Injection, RCE, SSRF" />

        <div>
          <label className="font-mono text-xs text-muted-foreground block mb-1">CLAIMED SEVERITY *</label>
          <Select value={form.severity_claim} onValueChange={(v) => update("severity_claim", v)}>
            <SelectTrigger className="bg-card border-border font-mono text-sm">
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {SEVERITY_OPTIONS.map((s) => (
                <SelectItem key={s} value={s} className="font-mono text-sm">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FieldArea label="DESCRIPTION *" value={form.description} onChange={(v) => update("description", v)} placeholder="Full technical description of the vulnerability" />
        <FieldArea label="IMPACT *" value={form.impact} onChange={(v) => update("impact", v)} placeholder="Business / security impact if exploited" />
        <Field label="PROOF-OF-CONCEPT URL *" value={form.poc_url} onChange={(v) => update("poc_url", v)} placeholder="https://github.com/..." />
        <Field label="CVSS 3.1 VECTOR" value={form.cvss_vector} onChange={(v) => update("cvss_vector", v)} placeholder="AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H" />
        <Field label="AFFECTED COMPONENT" value={form.affected_component} onChange={(v) => update("affected_component", v)} placeholder="e.g. /api/auth/login endpoint" />
        <FieldArea label="REPRODUCTION STEPS *" value={form.reproduction_steps} onChange={(v) => update("reproduction_steps", v)} placeholder="Step-by-step instructions to reproduce" />

        <Button
          type="submit"
          disabled={submitMutation.isPending}
          className="w-full bg-primary text-primary-foreground font-mono"
        >
          <Bug className="mr-2 h-4 w-4" />
          {submitMutation.isPending ? "Submitting..." : "Submit Report"}
        </Button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="font-mono text-xs text-muted-foreground block mb-1">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="bg-card border-border font-mono text-sm" />
    </div>
  );
}

function FieldArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="font-mono text-xs text-muted-foreground block mb-1">{label}</label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="bg-card border-border font-mono text-sm min-h-[100px]" />
    </div>
  );
}
