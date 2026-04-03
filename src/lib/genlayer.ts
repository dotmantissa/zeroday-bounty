import { createClient, createAccount, generatePrivateKey } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import type { Account } from "genlayer-js/types";

export const CONTRACT_ADDRESS = "0x50Cf4082662F66B23A372A34162F892F5C9E40A5";

export function getReadClient() {
  return createClient({ chain: studionet });
}

export function getWriteClient(account: Account) {
  return createClient({ chain: studionet, account });
}

export function createNewAccount() {
  const privateKey = generatePrivateKey();
  const account = createAccount(privateKey);
  return { account, privateKey };
}

export function importAccount(privateKey: string) {
  if (!privateKey.startsWith("0x")) {
    privateKey = `0x${privateKey}`;
  }
  return createAccount(privateKey as `0x${string}`);
}

export function formatAddress(address: string | null, maxLength = 14): string {
  if (!address) return "";
  if (address.length <= maxLength) return address;
  const prefix = Math.floor((maxLength - 3) / 2);
  const suffix = Math.ceil((maxLength - 3) / 2);
  return `${address.slice(0, prefix)}...${address.slice(-suffix)}`;
}
