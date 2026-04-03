import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReadClient, getWriteClient, CONTRACT_ADDRESS } from "@/lib/genlayer";
import { TransactionStatus } from "genlayer-js/types";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "sonner";

const client = getReadClient();

// ── Read hooks ──

export function usePrograms() {
  return useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const result = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "get_all_programs",
        args: [],
      });
      return JSON.parse(result as string) as any[];
    },
    refetchInterval: 10000,
  });
}

export function useActivePrograms() {
  return useQuery({
    queryKey: ["activePrograms"],
    queryFn: async () => {
      const result = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "get_active_programs",
        args: [],
      });
      return JSON.parse(result as string) as any[];
    },
    refetchInterval: 10000,
  });
}

export function useProgram(programId: string | undefined) {
  return useQuery({
    queryKey: ["program", programId],
    queryFn: async () => {
      const result = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "get_program",
        args: [programId!],
      });
      const parsed = JSON.parse(result as string);
      return Object.keys(parsed).length > 0 ? parsed : null;
    },
    enabled: !!programId,
  });
}

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const result = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "get_all_reports",
        args: [],
      });
      return JSON.parse(result as string) as any[];
    },
    refetchInterval: 10000,
  });
}

export function useReportsForProgram(programId: string | undefined) {
  return useQuery({
    queryKey: ["reportsForProgram", programId],
    queryFn: async () => {
      const result = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "get_reports_for_program",
        args: [programId!],
      });
      return JSON.parse(result as string) as any[];
    },
    enabled: !!programId,
    refetchInterval: 10000,
  });
}

export function useReport(reportId: string | undefined) {
  return useQuery({
    queryKey: ["report", reportId],
    queryFn: async () => {
      const result = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "get_report",
        args: [reportId!],
      });
      const parsed = JSON.parse(result as string);
      return Object.keys(parsed).length > 0 ? parsed : null;
    },
    enabled: !!reportId,
  });
}

export function useHackerReputation(address: string | undefined) {
  return useQuery({
    queryKey: ["reputation", address],
    queryFn: async () => {
      const result = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "get_hacker_reputation",
        args: [address!],
      });
      return JSON.parse(result as string);
    },
    enabled: !!address,
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const result = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "get_leaderboard",
        args: [],
      });
      return JSON.parse(result as string) as any[];
    },
    refetchInterval: 15000,
  });
}

export function useReportsByHacker(address: string | undefined) {
  return useQuery({
    queryKey: ["reportsByHacker", address],
    queryFn: async () => {
      const result = await client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "get_reports_by_hacker",
        args: [address!],
      });
      return JSON.parse(result as string) as any[];
    },
    enabled: !!address,
    refetchInterval: 10000,
  });
}

// ── Write hooks ──

export function useCreateProgram() {
  const { account } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; description: string; threat_matrix: string }) => {
      if (!account) throw new Error("Wallet not connected");
      const writeClient = getWriteClient(account);
      const hash = await writeClient.writeContract({
        account,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "create_program",
        args: [params.name, params.description, params.threat_matrix],
        value: BigInt(0),
      });
      const receipt = await writeClient.waitForTransactionReceipt({
        hash,
        status: TransactionStatus.FINALIZED,
      });
      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["activePrograms"] });
      toast.success("Program created successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create program");
    },
  });
}

export function useSubmitReport() {
  const { account } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      program_id: string;
      title: string;
      vulnerability_type: string;
      severity_claim: string;
      description: string;
      impact: string;
      poc_url: string;
      cvss_vector: string;
      affected_component: string;
      reproduction_steps: string;
    }) => {
      if (!account) throw new Error("Wallet not connected");
      const writeClient = getWriteClient(account);
      const hash = await writeClient.writeContract({
        account,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "submit_report",
        args: [
          params.program_id,
          params.title,
          params.vulnerability_type,
          params.severity_claim,
          params.description,
          params.impact,
          params.poc_url,
          params.cvss_vector,
          params.affected_component,
          params.reproduction_steps,
        ],
        value: BigInt(0),
      });
      const receipt = await writeClient.waitForTransactionReceipt({
        hash,
        status: TransactionStatus.FINALIZED,
      });
      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report submitted successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to submit report");
    },
  });
}

export function useEvaluateReport() {
  const { account } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string) => {
      if (!account) throw new Error("Wallet not connected");
      const writeClient = getWriteClient(account);
      const hash = await writeClient.writeContract({
        account,
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "evaluate_report",
        args: [reportId],
        value: BigInt(0),
      });
      toast.info("AI evaluation in progress... This may take a few minutes.");
      const receipt = await writeClient.waitForTransactionReceipt({
        hash,
        status: TransactionStatus.FINALIZED,
      });
      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      toast.success("Report evaluation complete!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Evaluation failed");
    },
  });
}
