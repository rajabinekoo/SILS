import { arbitrum } from "viem/chains";
import { createPublicClient, fallback, http } from "viem";

import { Slot0 } from "../dtos/slot0";
import { Token } from "@uniswap/sdk-core";

export const debugLog: boolean = true;

export const fee = 500; // 0.05%
export const tickSpacing = 10;
export const blockNumber = 21001766n;
export const liquidity = 9900281548745306000n;
export const poolAddress = "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640";
export const slot0: Slot0 = {
  sqrtPriceX96: "1540717895191862348349788195884637",
  tick: "197518",
  observationIndex: "48",
  observationCardinality: "723",
  observationCardinalityNext: "723",
  feeProtocol: "0",
  unlocked: true,
};

export const USDC = new Token(
  1,
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  6,
  "USDC"
);
export const WETH = new Token(
  1,
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  18,
  "WETH"
);

export const rpcUrls = [
  "https://eth.llamarpc.com",
  "https://eth.rpc.blxrbdn.com",
  "https://eth.blockrazor.xyz",
  "https://ethereum-rpc.publicnode.com",
  "https://ethereum.blockpi.network/v1/rpc/public",
  "https://eth-pokt.nodies.app",
  "https://eth.meowrpc.com",
  "https://eth1.lava.build",
];

export const publicClient = createPublicClient({
  chain: arbitrum,
  transport: fallback(rpcUrls.map((rpc) => http(rpc))),
});
