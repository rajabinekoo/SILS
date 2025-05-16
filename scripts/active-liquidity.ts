import JSBI from "jsbi";
import { readFileSync } from "fs";
import { writeFile } from "fs/promises";
import { nearestUsableTick, Tick, TickMath } from "@uniswap/v3-sdk";

import { SortedMap } from "../libs/sorted-map";
import { generateFetchingTickInfoCall } from "./tick-info";
import { TickInfo, viemTickInfoType } from "../dtos/tick-info";
import {
  debugLog,
  liquidity,
  blockNumber,
  tickSpacing,
  publicClient,
} from "../libs/config";

const multicallSize = 100 * tickSpacing;

const getTicksRange = () => {
  const ranges: number[] = [];
  for (let i = TickMath.MIN_TICK; i <= TickMath.MAX_TICK; i++)
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
  if (debugLog) console.log("Number of iterations:", endIteration);

  while (iteration < endIteration) {
    const startOfSlice = iteration * multicallSize;
    const endOfSlice = Math.min(
      startOfSlice + multicallSize,
      ticksRange.length - 1
    );
    const rangeSlice = ticksRange.slice(startOfSlice, endOfSlice + 1);
    const result = await publicClient.multicall({
      blockNumber: blockNumber,
      contracts: rangeSlice.map((t) => generateFetchingTickInfoCall([t])),
    });
    if (!Array.isArray(result)) throw new Error("Something went wrong");
    result.forEach((r, i) => {
      if (r.status !== "success") throw new Error("Something went wrong");
      const info = new TickInfo(<viemTickInfoType>r.result);
      if (!info.initialized) return;
      const t = rangeSlice[i];
      tickInfoList.push({ tick: t, info });
    });
    if (debugLog) console.log(`Iteration ${iteration} done.`);
    iteration += 1;
  }

  for (const { info, tick } of tickInfoList) initializedTicks.add(tick, info);
  await writeFile(filename, initializedTicks.toJSON(), "utf8");
}

export class ActiveLiquidity {
  private activeLiquidities = new SortedMap<number, TickInfo>((a, b) => a - b);
  private readonly liquidityNetSum = JSBI.BigInt("0");

  constructor(path: string) {
    try {
      this.activeLiquidities.fromJSON(readFileSync(path, "utf8"), Number);
    } catch (error) {
      if (debugLog)
        console.error("Failed to fetch active liquidities json file.", error);
      return;
    }
    const len = this.activeLiquidities.size();
    for (let index = 0; index < len; index++) {
      const [_, value] = this.activeLiquidities.getItemAndValueByIndex(index);
      this.liquidityNetSum = JSBI.add(
        this.liquidityNetSum,
        JSBI.BigInt(value?.liquidityNet.toString() || "0")
      );
    }
  }

  public getActiveLiquidityByTick(tick: number) {
    const normalizedTick = Math.min(tick / tickSpacing) * tickSpacing;
    return this.activeLiquidities.getValueByItem(normalizedTick);
  }

  public getSdkTicks(): Array<Tick> {
    const ticks: Array<Tick> = [];
    const exist: Record<number, boolean> = {};

    const len = this.activeLiquidities.size();
    for (let index = 0; index < len; index++) {
      const [item, value] =
        this.activeLiquidities.getItemAndValueByIndex(index);
      if (!item || !value) continue;
      if (
        Number(item) >= TickMath.MAX_TICK ||
        Number(item) <= TickMath.MIN_TICK
      ) {
        continue;
      }
      ticks.push({
        index: Number(item),
        liquidityGross: JSBI.BigInt(value.liquidityGross),
        liquidityNet: JSBI.BigInt(value.liquidityNet),
      });
      exist[Number(item)] = true;
    }

    const L = JSBI.BigInt(liquidity.toString());
    const lowerTickBound = nearestUsableTick(TickMath.MIN_TICK, tickSpacing);
    const upperTickBound = nearestUsableTick(TickMath.MAX_TICK, tickSpacing);

    for (let t = TickMath.MIN_TICK; t <= TickMath.MAX_TICK; t++) {
      if (exist[t] || t % tickSpacing !== 0) continue;
      if (t <= lowerTickBound || t >= upperTickBound) continue;
      ticks.push({
        index: t,
        liquidityNet: JSBI.BigInt("0"),
        liquidityGross: JSBI.BigInt("0"),
      });
    }

    ticks.push({
      index: lowerTickBound,
      liquidityNet: L,
      liquidityGross: L,
    });
    ticks.push({
      index: upperTickBound,
      liquidityGross: L,
      liquidityNet: JSBI.multiply(
        JSBI.add(this.liquidityNetSum, L),
        JSBI.BigInt(-1)
      ),
    });

    return ticks.sort((a, b) => Number(a.index) - Number(b.index));
  }
}
