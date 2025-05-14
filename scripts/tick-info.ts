import { Address } from "viem";

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

export function generateFetchingTickInfoCall(args: Array<any>): {
  abi: any;
  args: Array<any>;
  address: Address;
  functionName: string;
} {
  return {
    args,
    address: poolAddress,
    functionName: "ticks",
    abi: UniswapV3Pool.abi,
  };
}
