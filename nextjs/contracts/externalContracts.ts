// Put your external contracts + ABIs here

import { GenericContractsDeclaration } from ".";
import { WETH } from "./abis";

const externalContracts = {
  1: {
    WETH: {
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      abi: WETH,
    },
  },
} as const;

export default externalContracts as GenericContractsDeclaration;
