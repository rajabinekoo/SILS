import { UniswapV3Pool } from "../abis/UniswapV3Pool";
import { poolAddress, publicClient, blockNumber } from "../libs/config";

export async function getPoolLiquidity() {
  try {
    const l = await publicClient.readContract({
      address: poolAddress,
      abi: UniswapV3Pool.abi,
      functionName: "liquidity",
      args: [],
      blockNumber: blockNumber,
    });
    return Number(l);
  } catch (error) {
    console.error(error);
    return null;
  }
}
