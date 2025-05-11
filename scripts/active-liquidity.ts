import { writeFile } from "fs/promises";
import { getTickInfo } from "./tick-info";
import { TickInfo } from "../dtos/tick-info";
import { SortedMap } from "../libs/sorted-map";
import { int24Max, int24Min, tickSpacing } from "../libs/config";

const getTicksRange = () => {
  const ranges: number[] = [];
  for (let i = int24Min; i <= int24Max; i++)
    if (i % tickSpacing === 0) ranges.push(i);
  return ranges;
};

export async function getActiveLiquidityByTick(
  tickInput: bigint | number | string
) {
  const initializedTicks = new SortedMap<number, TickInfo>((a, b) => a - b);
  const tick = Number(tickInput);
  const ticksRange = getTicksRange();
  const tickInfoList: Array<{ tick: number; info: TickInfo }> = [];
  for (const t of ticksRange) {
    const info = await getTickInfo(tick);
    if (!info) {
      console.log(`System failed to fetch tick info for ${t}`);
      throw new Error("Something went wrong");
    }
    if (!info.initialized) continue;
    tickInfoList.push({ tick: t, info });
  }
  for (const { info, tick } of tickInfoList) initializedTicks.add(tick, info);
  await writeFile("test.json", initializedTicks.toJSON(), "utf8");
}
