import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http, webSocket } from "wagmi";
import {
  arbitrum,
  base,
  foundry,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Arvensis Systems Template",
  projectId: "YOUR_PROJECT_ID",
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_LOCALHOST === "true" ? [foundry] : []),
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  transports: {
    [mainnet.id]: http("https://eth.llamarpc.com"),
    [foundry.id]: webSocket("ws://localhost:8545"),
  },
  ssr: true,
});
