import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { createNewAccount, importAccount, getReadClient } from "@/lib/genlayer";
import type { Account } from "genlayer-js/types";
import { toast } from "sonner";

const WALLET_KEY = "zeroday_wallet_pk";

interface WalletContextValue {
  account: Account | null;
  address: string | null;
  isConnected: boolean;
  balance: string;
  isLoading: boolean;
  createWallet: () => void;
  importWallet: (privateKey: string) => void;
  exportPrivateKey: () => string | null;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  requestFaucet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [balance, setBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(WALLET_KEY);
    if (stored) {
      try {
        const acc = importAccount(stored);
        setAccount(acc);
        setPrivateKey(stored);
      } catch {
        localStorage.removeItem(WALLET_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!account) return;
    try {
      const client = getReadClient();
      const bal = await client.getBalance({ address: account.address });
      const ethBalance = Number(bal) / 1e18;
      setBalance(ethBalance.toFixed(4));
    } catch (e) {
      console.error("Failed to fetch balance:", e);
    }
  }, [account]);

  useEffect(() => {
    if (account) {
      refreshBalance();
    }
  }, [account, refreshBalance]);

  const createWallet = useCallback(() => {
    const { account: acc, privateKey: pk } = createNewAccount();
    setAccount(acc);
    setPrivateKey(pk);
    localStorage.setItem(WALLET_KEY, pk);
    toast.success("Wallet created successfully!");
  }, []);

  const importWallet = useCallback((pk: string) => {
    try {
      const acc = importAccount(pk);
      const normalizedPk = pk.startsWith("0x") ? pk : `0x${pk}`;
      setAccount(acc);
      setPrivateKey(normalizedPk);
      localStorage.setItem(WALLET_KEY, normalizedPk);
      toast.success("Wallet imported successfully!");
    } catch {
      toast.error("Invalid private key");
    }
  }, []);

  const exportPrivateKey = useCallback(() => {
    return privateKey;
  }, [privateKey]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setPrivateKey(null);
    setBalance("0");
    localStorage.removeItem(WALLET_KEY);
    toast.info("Wallet disconnected");
  }, []);

  const requestFaucet = useCallback(async () => {
    if (!account) {
      toast.error("Connect wallet first");
      return;
    }
    try {
      const client = getReadClient();
      await (client as any).request({
        method: "sim_fundAccount",
        params: [account.address, BigInt(10_000_000_000_000_000_000)],
      });
      toast.success("Faucet tokens received! +10 GEN");
      await refreshBalance();
    } catch (e: any) {
      console.error("Faucet error:", e);
      toast.error(e?.message || "Faucet request failed");
    }
  }, [account, refreshBalance]);

  return (
    <WalletContext.Provider
      value={{
        account,
        address: account?.address ?? null,
        isConnected: !!account,
        balance,
        isLoading,
        createWallet,
        importWallet,
        exportPrivateKey,
        disconnect,
        refreshBalance,
        requestFaucet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
