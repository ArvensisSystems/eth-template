# Arvensis Systems Ethereum Template

This template comes with a Next.js web app and a Foundry development container. The template is deliberately minimal to allow for maximum customization without having to wrangle with it, while providing just enough to get started.

The template uses the `pnpm` package manager for both the web app and installing Solidity packages in Foundry.

Built using Next.js 15, RainbowKit, Foundry, wagmi, TailwindCSS 4 and TypeScript. If you don't like Tailwind or RainbowKit for whatever reason, they should be reasonably trivial to remove.

## Next steps

- Add a UI kit such as shadcn or HeroUI
- Write contracts
- Deploy your app
- [Make it immutable](https://github.com/hazae41/next-as-immutable)

## Why not scaffold-eth?

`scaffold-eth` is also a good starting point, and it's definitely more fully featured! However, one large big factor which led to the making of this template was the fact it had _too many features_, and removing them was too tedious (e.g. I wanted to use shadcn but all the components were built for DaisyUI).

Additionally, it made the design decision of using git submodules for managing Solidity packages, [which suck](https://x.com/PaulRBerg/status/1629425771457531905).

## Commands

```bash
pnpm dev # Starts the local blockchain, deploys contracts and starts the frontend

pnpm test # Runs Foundry tests
pnpm sol:deploy --rpc-url <rpc> --private-key <privkey> --broadcast # Deploys contracts
pnpm types # Exports ABIs to deployedContracts.ts
pnpm chain # Starts the local blockchain at localhost:8545
pnpm sol:build # Builds the contracts

pnpm start # Starts the frontend
pnpm next:build # Builds the frontend
pnpm serve # Serves a built frontend in production mode
```
