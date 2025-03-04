"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useBalance, useAccount } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import {
  useTypedContractRead,
  useTypedContractWrite,
} from "../../contracts/useContract";

const Home: NextPage = () => {
  const { address, isConnected, chainId } = useAccount();
  const balance = useBalance({
    address,
    query: {
      enabled: !!address,
    },
  });

  // Type-safe contract reads and writes with custom options
  const { data: counterValue } = useTypedContractRead("Counter", "number", [], {
    query: {
      // Custom TanStack Query options
      staleTime: 1000, // 1s
      refetchInterval: 2000, // 2 seconds
    },
  });

  // Custom options for contract writes
  const counterWrite = useTypedContractWrite("Counter", {
    chainId: chainId, // Explicitly set chainId (optional)
  });

  const wethWrite = useTypedContractWrite("WETH");

  const [ethValue, setEthValue] = useState<string>("");

  useEffect(() => {
    console.log(balance);
  }, [balance]);

  useEffect(() => {
    console.log(counterValue);
  }, [counterValue]);

  function wrap() {
    if (!ethValue) return;

    // Using the enhanced write method with custom options
    wethWrite.write("deposit", [], {
      value: parseUnits(ethValue, 18),
      // Additional options for this specific call
      gas: 100000n, // Optional gas limit
      // You could also override chainId for this specific call if needed
      // chainId: 1, // Force mainnet for this call
    });
  }

  function increment() {
    counterWrite.write("increment");
  }

  return (
    <div>
      <Head>
        <title>Arvensis Systems Ethereum Template</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <div className="w-full flex justify-center">
        <main className="bg-neutral-100 rounded flex flex-col p-4">
          <ConnectButton />
          <div className="mt-4 flex flex-col">
            {isConnected && chainId && (
              <>
                <label>WETH Wrappinator 9000</label>
                <input
                  className="px-2 py-1 bg-neutral-200"
                  type="number"
                  value={ethValue}
                  onChange={(e) => setEthValue(e.target.value)}
                />
                {balance.data && (
                  <button
                    className="text-sm text-left cursor-pointer hover:underline"
                    onClick={(e) =>
                      setEthValue(
                        formatUnits(balance.data?.value, balance.data?.decimals)
                      )
                    }
                  >
                    you have{" "}
                    {formatUnits(balance.data?.value, balance.data?.decimals)}{" "}
                    ETH
                  </button>
                )}
                <button
                  className="px-2 py-1 bg-blue-200 mt-2 hover:cursor-pointer disabled:cursor-not-allowed"
                  onClick={wrap}
                  disabled={wethWrite.isPending}
                >
                  Wrap your ETH
                </button>
                <span>{wethWrite.data}</span>

                <label>Counter value: {counterValue?.toString()}</label>

                <button
                  className="px-2 py-1 bg-blue-200 mt-2 hover:cursor-pointer disabled:cursor-not-allowed"
                  onClick={increment}
                  disabled={counterWrite.isPending}
                >
                  Add one
                </button>
                <span>{counterWrite.data}</span>
              </>
            )}
            {!isConnected && <p>Connect your wallet to use the app.</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
