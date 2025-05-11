import { Slot0, viemSlot0Type } from "../dtos/slot0";
import { UniswapV3Pool } from "../abis/UniswapV3Pool";
import { poolAddress, publicClient, startBlock } from "../libs/config";

export async function getSlot0Status() {
  try {
    const slot0Data = await publicClient.readContract({
      address: poolAddress,
      abi: UniswapV3Pool.abi,
      functionName: "slot0",
      args: [],
      blockNumber: startBlock
    });
    return new Slot0(<viemSlot0Type>slot0Data);
  } catch (error) {
    console.error(error);
    return null;
  }
}
