import { createWalletClient, createPublicClient, http, Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { localhost, polygon } from "viem/chains";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
const panteraPrivateKey = process.env.PANTERA_PRIVATE_KEY;
const majelisPrivateKey = process.env.MAJELIS_PRIVATE_KEY;
const polygonRpc = process.env.POLYGON_MAINNET_RPC;

if (
  !adminPrivateKey ||
  !panteraPrivateKey ||
  !majelisPrivateKey ||
  !polygonRpc
) {
  throw new Error(
    "One or more private keys or RPC URL are missing in environment variables"
  );
}

// Format private keys correctly - ensure they are valid hex strings with 0x prefix
const formatPrivateKey = (key: string): `0x${string}` => {
  // If key already starts with 0x, return it
  if (key.startsWith("0x") && key.length === 66) {
    return key as `0x${string}`;
  }
  // If key doesn't have 0x prefix but is 64 chars, add prefix
  else if (!key.startsWith("0x") && key.length === 64) {
    return `0x${key}` as `0x${string}`;
  }
  // Otherwise throw a more descriptive error
  throw new Error(
    `Invalid private key format: ${key.substring(
      0,
      4
    )}... - Keys must be 64-character hex strings with optional 0x prefix`
  );
};

// Initialize wallet accounts
let adminKey, panteraKey, majelisKey;

try {
  adminKey = privateKeyToAccount(formatPrivateKey(adminPrivateKey));
  panteraKey = privateKeyToAccount(formatPrivateKey(panteraPrivateKey));
  majelisKey = privateKeyToAccount(formatPrivateKey(majelisPrivateKey));
} catch (error) {
  console.error("Error initializing wallet clients:", error);
  throw error;
}

// Create wallet clients
export const admin = createWalletClient({
  account: adminKey,
  chain: polygon,
  transport: http(polygonRpc),
});

export const pantera = createWalletClient({
  account: panteraKey,
  chain: polygon,
  transport: http(polygonRpc),
});

export const majelis = createWalletClient({
  account: majelisKey,
  chain: polygon,
  transport: http(polygonRpc),
});

export const publicClient = createPublicClient({
  chain: polygon,
  transport: http("http://hardhat:8545"),
});

// Function to get ABI for a contract
function getAbi() {
  const abiPath = path.resolve(__dirname, "./SengketaContract.json");
  const abiFile = JSON.parse(fs.readFileSync(abiPath, "utf8"));
  return abiFile.abi;
}

export const sengketAbi = getAbi();
export const sengketaContractAddress = process.env.SMART_CONTRACT_ADDRESS;
