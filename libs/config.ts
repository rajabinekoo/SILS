import { arbitrum } from "viem/chains";
import { createPublicClient, fallback, http } from "viem";

export const nonfungiblePositionManagerAddress =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
export const usdc = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
export const weth = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
export const poolAddress = "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640";
export const tickSpacing = 10;
export const int24Max = 8388607;
export const int24Min = -8388608;
export const startBlock = 21001766n;
export const stopBlock = 22241703n;

// export const rpcUrls = [
//   "https://arb-pokt.nodies.app",
//   "https://api.zan.top/arb-one",
//   "https://arbitrum.meowrpc.com",
//   "https://arbitrum.rpc.subquery.network/public",
//   "https://arbitrum-one.public.blastapi.io",
//   "https://arbitrum.drpc.org",
//   "https://rpc.therpc.io/arbitrum",
//   "https://arb1.lava.build",
// ];

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
