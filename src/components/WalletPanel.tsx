import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { formatAddress } from "@/lib/genlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Wallet, Plus, Import, LogOut, Copy, Droplets, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function WalletPanel() {
  const {
    isConnected,
    address,
    balance,
    createWallet,
    importWallet,
    exportPrivateKey,
    disconnect,
    requestFaucet,
  } = useWallet();

  const [importKey, setImportKey] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [showPk, setShowPk] = useState(false);
  const [isFaucetLoading, setIsFaucetLoading] = useState(false);

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied!");
    }
  };

  const handleExport = () => {
    const pk = exportPrivateKey();
    if (pk) {
      navigator.clipboard.writeText(pk);
      toast.success("Private key copied to clipboard!");
    }
  };

  const handleFaucet = async () => {
    setIsFaucetLoading(true);
    try {
      await requestFaucet();
    } finally {
      setIsFaucetLoading(false);
    }
  };

  const handleImportSubmit = () => {
    if (importKey.trim()) {
      importWallet(importKey.trim());
      setImportKey("");
      setShowImport(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2">
        <Dialog open={showImport} onOpenChange={setShowImport}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="border-border font-mono text-xs">
              <Import className="mr-1 h-3 w-3" />
              Import
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-mono text-primary">Import Wallet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type={showPk ? "text" : "password"}
                placeholder="Enter private key (0x...)"
                value={importKey}
                onChange={(e) => setImportKey(e.target.value)}
                className="font-mono text-xs bg-background border-border"
              />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPk(!showPk)}
                >
                  {showPk ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button onClick={handleImportSubmit} className="flex-1 bg-primary text-primary-foreground">
                  Import
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button onClick={createWallet} size="sm" className="bg-primary text-primary-foreground font-mono text-xs">
          <Plus className="mr-1 h-3 w-3" />
          Create Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handleFaucet}
        disabled={isFaucetLoading}
        className="border-accent text-accent font-mono text-xs hover:bg-accent hover:text-accent-foreground"
      >
        <Droplets className="mr-1 h-3 w-3" />
        {isFaucetLoading ? "Loading..." : "Faucet"}
      </Button>

      <div className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5">
        <span className="font-mono text-xs text-accent">{balance} GEN</span>
        <span className="text-muted-foreground">|</span>
        <button
          onClick={handleCopyAddress}
          className="font-mono text-xs text-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <Wallet className="h-3 w-3" />
          {formatAddress(address)}
          <Copy className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>

      <Button variant="ghost" size="sm" onClick={handleExport} className="text-muted-foreground text-xs">
        Export PK
      </Button>

      <Button variant="ghost" size="sm" onClick={disconnect} className="text-destructive text-xs">
        <LogOut className="h-3 w-3" />
      </Button>
    </div>
  );
}
