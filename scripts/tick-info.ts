import { UniswapV3Pool } from "../abis/UniswapV3Pool";
import { TickInfo, viemTickInfoType } from "../dtos/tick-info";
import { poolAddress, publicClient, startBlock } from "../libs/config";

export async function getTickInfo(tick: number | bigint | string) {
  try {
    const tickInfo = await publicClient.readContract({
      address: poolAddress,
      abi: UniswapV3Pool.abi,
      functionName: "ticks",
      args: [BigInt(tick)],
      blockNumber: startBlock,
    });
    return new TickInfo(<viemTickInfoType>tickInfo);
  } catch (error) {
    console.error(error);
  }
}
