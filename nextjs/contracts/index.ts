// Shallow merged in order of priority:
// - External contracts
// - Deployed contracts

import deployedContracts from "./deployedContracts";
import externalContracts from "./externalContracts";
import { Abi } from "abitype";
import { Address } from "viem";
import type { MergeDeepRecord } from "type-fest/source/merge-deep";

export type GenericContract = {
  address: Address;
  abi: Abi;
  external?: true;
};

export type GenericContractsDeclaration = {
  [chainId: number]: {
    [contractName: string]: GenericContract;
  };
};

type AddExternalFlag<T> = {
  [ChainId in keyof T]: {
    [ContractName in keyof T[ChainId]]: T[ChainId][ContractName] & {
      external?: true;
    };
  };
};

const deepMergeContracts = <
  L extends Record<PropertyKey, any>,
  E extends Record<PropertyKey, any>,
>(
  local: L,
  external: E
) => {
  const result: Record<PropertyKey, any> = {};
  const allKeys = Array.from(
    new Set([...Object.keys(external), ...Object.keys(local)])
  );
  for (const key of allKeys) {
    if (!external[key]) {
      result[key] = local[key];
      continue;
    }
    const amendedExternal = Object.fromEntries(
      Object.entries(
        external[key] as Record<string, Record<string, unknown>>
      ).map(([contractName, declaration]) => [
        contractName,
        { ...declaration, external: true },
      ])
    );
    result[key] = { ...local[key], ...amendedExternal };
  }
  return result as MergeDeepRecord<
    AddExternalFlag<L>,
    AddExternalFlag<E>,
    { arrayMergeMode: "replace" }
  >;
};

export default deepMergeContracts(
  deployedContracts,
  externalContracts
) as GenericContractsDeclaration;
