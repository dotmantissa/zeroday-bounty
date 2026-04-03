import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProgram } from "@/hooks/useContract";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, AlertTriangle } from "lucide-react";

export default function CreateProgramPage() {
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const createMutation = useCreateProgram();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [threatMatrix, setThreatMatrix] = useState(
    JSON.stringify(
      {
        scope: ["*.example.com"],
        out_of_scope: ["docs.example.com"],
        vulnerability_types: ["RCE", "SQLi", "Auth Bypass", "SSRF", "XSS"],
        bounties: {
          CRITICAL: 50000,
          HIGH: 10000,
          MEDIUM: 2000,
          LOW: 500,
          INFORMATIONAL: 0,
        },
        exclusions: ["Social engineering", "Physical attacks", "DoS"],
        requirements: ["Working PoC required for CRITICAL and HIGH"],
        notes: "",
      },
      null,
      2
    )
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      JSON.parse(threatMatrix);
    } catch {
      return;
    }
    await createMutation.mutateAsync({ name, description, threat_matrix: threatMatrix });
    navigate("/programs");
  };

  if (!isConnected) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-8 text-center">
          <AlertTriangle className="h-8 w-8 text-accent mx-auto mb-3" />
          <p className="text-accent font-mono text-sm">Connect a wallet to create programs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Create Bounty Program</h1>
        <p className="text-sm text-muted-foreground font-mono">Define scope, bounties, and threat matrix</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-mono text-xs text-muted-foreground block mb-1">PROGRAM NAME *</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Protocol XYZ v2" className="bg-card border-border font-mono text-sm" />
        </div>

        <div>
          <label className="font-mono text-xs text-muted-foreground block mb-1">DESCRIPTION *</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is protected and what vulnerabilities matter" className="bg-card border-border font-mono text-sm min-h-[80px]" />
        </div>

        <div>
          <label className="font-mono text-xs text-muted-foreground block mb-1">THREAT MATRIX (JSON) *</label>
          <Textarea
            value={threatMatrix}
            onChange={(e) => setThreatMatrix(e.target.value)}
            className="bg-card border-border font-mono text-xs min-h-[300px]"
          />
        </div>

        <Button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full bg-primary text-primary-foreground font-mono"
        >
          <Shield className="mr-2 h-4 w-4" />
          {createMutation.isPending ? "Creating..." : "Create Program"}
        </Button>
      </form>
    </div>
  );
}
