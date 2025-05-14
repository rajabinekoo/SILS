import { writeFile } from "fs/promises";
import { SortedMap } from "../libs/sorted-map";
import { generateFetchingTickInfoCall } from "./tick-info";
import { TickInfo, viemTickInfoType } from "../dtos/tick-info";
import {
  int24Max,
  int24Min,
  startBlock,
  tickSpacing,
  publicClient,
} from "../libs/config";

const multicallSize = 100 * tickSpacing;

const getTicksRange = () => {
  const ranges: number[] = [];
  for (let i = int24Min; i <= int24Max; i++)
    if (i % tickSpacing === 0) ranges.push(i);
  return ranges;
};

export async function fetchAndSaveActiveLiquidities(filename: string) {
  const ticksRange = getTicksRange();
  const tickInfoList: Array<{ tick: number; info: TickInfo }> = [];
  const initializedTicks = new SortedMap<number, TickInfo>((a, b) => a - b);

  // windows size = page = iteration
  let iteration = 0;
  const endIteration = Math.ceil(ticksRange.length / multicallSize);
  console.log("Number of iterations:", endIteration);

  while (iteration < endIteration) {
    const startOfSlice = iteration * multicallSize;
    const endOfSlice = Math.min(
      startOfSlice + multicallSize,
      ticksRange.length - 1
    );
    const rangeSlice = ticksRange.slice(startOfSlice, endOfSlice + 1);
    const result = await publicClient.multicall({
      blockNumber: startBlock,
      contracts: rangeSlice.map((t) => generateFetchingTickInfoCall([t])),
    });
    if (!Array.isArray(result)) throw new Error("Something went wrong");
    result.forEach((r, i) => {
      if (r.status !== "success") throw new Error("Something went wrong");
      const info = new TickInfo(<viemTickInfoType>r.result);
      if (!info.initialized) return;
      const t = ticksRange[i];
      tickInfoList.push({ tick: t, info });
    });
    console.log(`Iteration ${iteration} done.`);
    iteration += 1;
  }

  for (const { info, tick } of tickInfoList) initializedTicks.add(tick, info);
  await writeFile(filename, initializedTicks.toJSON(), "utf8");
}
