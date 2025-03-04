import { Abi, Address } from "viem";
import deployedContracts from "./deployedContracts";
import externalContracts from "./externalContracts";
import contracts from "./index";

// Define the contract names we have in our system
export type ContractName = "Counter" | "WETH";

// Define the structure of our contracts object with proper typing
export type TypedContracts = {
  [chainId: number]: {
    [K in ContractName]?: {
      address: Address;
      abi: Abi;
      external?: boolean;
    };
  };
};

// Cast our contracts to the typed version
export const typedContracts = contracts as TypedContracts;

// Type-safe contract accessor that works with any chain ID
export function getContract<T extends ContractName>(
  chainId: number | undefined | null,
  contractName: T
): (TypedContracts[number][T] & { chainId: number }) | undefined {
  if (chainId === undefined || chainId === null) return undefined;
  if (!(chainId in contracts)) return undefined;

  const contract = contracts[chainId][contractName];
  if (!contract) return undefined;

  return {
    ...contract,
    chainId,
  };
}

// Helper to check if a contract exists on a chain
export function hasContract(
  chainId: number | undefined | null,
  contractName: ContractName
): boolean {
  if (chainId === undefined || chainId === null) return false;
  return chainId in contracts && contractName in contracts[chainId];
}

// Define function signatures for Counter contract
export type CounterFunctions = {
  // Read functions
  number: { functionName: "number"; args: [] };
  token: { functionName: "token"; args: [] };
  owner: { functionName: "owner"; args: [] };
  ownershipHandoverExpiresAt: {
    functionName: "ownershipHandoverExpiresAt";
    args: [pendingOwner: Address];
  };

  // Write functions
  increment: { functionName: "increment"; args: [] };
  setNumber: { functionName: "setNumber"; args: [newNumber: bigint] };
  withdraw: { functionName: "withdraw"; args: [value: bigint] };
  transferOwnership: {
    functionName: "transferOwnership";
    args: [newOwner: Address];
  };
  renounceOwnership: { functionName: "renounceOwnership"; args: [] };
  requestOwnershipHandover: {
    functionName: "requestOwnershipHandover";
    args: [];
  };
  completeOwnershipHandover: {
    functionName: "completeOwnershipHandover";
    args: [pendingOwner: Address];
  };
  cancelOwnershipHandover: {
    functionName: "cancelOwnershipHandover";
    args: [];
  };
};

// Define function signatures for WETH contract
export type WETHFunctions = {
  // Read functions
  name: { functionName: "name"; args: [] };
  symbol: { functionName: "symbol"; args: [] };
  decimals: { functionName: "decimals"; args: [] };
  totalSupply: { functionName: "totalSupply"; args: [] };
  balanceOf: { functionName: "balanceOf"; args: [owner: Address] };
  allowance: {
    functionName: "allowance";
    args: [owner: Address, spender: Address];
  };
  DOMAIN_SEPARATOR: { functionName: "DOMAIN_SEPARATOR"; args: [] };
  nonces: { functionName: "nonces"; args: [owner: Address] };

  // Write functions
  deposit: { functionName: "deposit"; args: [] };
  withdraw: { functionName: "withdraw"; args: [amount: bigint] };
  approve: {
    functionName: "approve";
    args: [spender: Address, amount: bigint];
  };
  transfer: {
    functionName: "transfer";
    args: [to: Address, amount: bigint];
  };
  transferFrom: {
    functionName: "transferFrom";
    args: [from: Address, to: Address, amount: bigint];
  };
  permit: {
    functionName: "permit";
    args: [
      owner: Address,
      spender: Address,
      value: bigint,
      deadline: bigint,
      v: number,
      r: `0x${string}`,
      s: `0x${string}`,
    ];
  };
};

// Map contract names to their function types
export type ContractFunctions = {
  Counter: CounterFunctions;
  WETH: WETHFunctions;
};

// Type-safe way to get contract function config for wagmi
export function getContractFunction<
  T extends ContractName,
  F extends keyof ContractFunctions[T],
>(
  chainId: number | undefined | null,
  contractName: T,
  functionName: F
):
  | {
      address: Address;
      abi: Abi;
      functionName: string;
    }
  | undefined {
  const contract = getContract(chainId, contractName);
  if (!contract) return undefined;

  // Get the function type from our mapping
  type FuncType = ContractFunctions[T][F];

  return {
    address: contract.address,
    abi: contract.abi,
    functionName: String(functionName),
  };
}

// Helper to create wagmi function config with args
export function createFunctionConfig<
  T extends ContractName,
  F extends keyof ContractFunctions[T],
>(
  chainId: number | undefined | null,
  contractName: T,
  functionName: F,
  args: any[]
) {
  const baseConfig = getContractFunction(chainId, contractName, functionName);
  if (!baseConfig) return undefined;

  return {
    ...baseConfig,
    args,
  };
}
