import { UniswapV3Pool } from "../abis/UniswapV3Pool";
import { poolAddress, publicClient } from "../libs/config";

export async function getTickSpacing() {
  try {
    const spacing = await publicClient.readContract({
      address: poolAddress,
      abi: UniswapV3Pool.abi,
      functionName: "tickSpacing",
      args: [],
    });
    return Number(spacing);
  } catch (error) {
    console.error(error);
    return null;
  }
}
