import { useAccount } from "wagmi";
import {
  useReadContract,
  useWriteContract,
  type UseReadContractParameters,
  type UseWriteContractParameters,
} from "wagmi";
import {
  ContractName,
  getContract,
  hasContract,
  getContractFunction,
  createFunctionConfig,
} from "./contractTypes";
import { Abi } from "viem";

/**
 * Hook to get a typed contract instance for the current chain
 * @param contractName The name of the contract to get
 * @returns The contract instance or undefined if not available
 */
export function useTypedContract<T extends ContractName>(contractName: T) {
  const { chainId } = useAccount();

  return {
    contract: chainId ? getContract(chainId, contractName) : undefined,
    isAvailable: chainId ? hasContract(chainId, contractName) : false,
    chainId,
  };
}

/**
 * Hook to read from a contract with type safety
 * @param contractName The name of the contract to read from
 * @param functionName The name of the function to call
 * @param args The arguments to pass to the function
 * @param options Additional options to pass to useReadContract
 * @returns The result of the contract call
 */
export function useTypedContractRead<
  T extends ContractName,
  F extends keyof import("./contractTypes").ContractFunctions[T],
>(
  contractName: T,
  functionName: F,
  args: any[] = [],
  options: {
    query?: {
      enabled?: boolean;
      [key: string]: any;
    };
    chainId?: number; // Override the current chain ID
    [key: string]: any; // Allow any other options that useReadContract accepts
  } = {}
) {
  const { chainId: connectedChainId } = useAccount();
  const chainId = options.chainId ?? connectedChainId;
  const isAvailable = chainId ? hasContract(chainId, contractName) : false;

  const config = chainId
    ? createFunctionConfig(chainId, contractName, functionName, args)
    : undefined;

  // Extract query options and other options
  const { query = {}, ...otherOptions } = options;
  const { enabled: userEnabled, ...otherQueryOptions } = query;

  // Only add config properties if config is defined
  const readParams: UseReadContractParameters<Abi, string, any[]> = {
    ...(config || {}),
    ...otherOptions,
  };

  // Add query options
  if (readParams.query === undefined) {
    readParams.query = {};
  }

  // Set enabled flag and other query options
  readParams.query = {
    enabled: isAvailable && !!config && userEnabled !== false,
    ...otherQueryOptions,
    ...(readParams.query || {}),
  };

  return useReadContract(readParams);
}

/**
 * Hook to write to a contract with type safety
 * @param contractName The name of the contract to write to
 * @param options Additional options to pass to useWriteContract
 * @returns A function to write to the contract
 */
export function useTypedContractWrite<T extends ContractName>(
  contractName: T,
  options: {
    chainId?: number; // Override the current chain ID
  } = {}
) {
  const { chainId: connectedChainId } = useAccount();
  const { writeContract, ...rest } = useWriteContract();
  const defaultChainId = options.chainId ?? connectedChainId;

  const write = <
    F extends keyof import("./contractTypes").ContractFunctions[T],
  >(
    functionName: F,
    args: any[] = [],
    callOptions: {
      value?: bigint;
      chainId?: number; // Allow overriding chainId per call
      [key: string]: any; // Allow any other options for the specific call
    } = {}
  ) => {
    const chainId = callOptions.chainId ?? defaultChainId;
    if (!chainId) return;

    const contract = getContract(chainId, contractName);
    if (!contract) return;

    const { chainId: _, ...restCallOptions } = callOptions;

    return writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: String(functionName),
      args,
      ...restCallOptions,
    });
  };

  return {
    write,
    ...rest,
  };
}
