import { writeFile } from "fs/promises";
import { TickInfo } from "../dtos/tick-info";
import { int24Max, int24Min, tickSpacing } from "../libs/config";
import { SortedMap } from "../libs/sorted-map";
import { getTickInfo } from "./tick-info";

const getTicksRange = () => {
  const ranges: number[] = [];
  for (let i = 0; i <= int24Max; i++) if (i % tickSpacing === 0) ranges.push(i);
  // for (let i = int24Min; i <= int24Max; i++)
  //   if (i % tickSpacing === 0) ranges.push(i);
  return ranges;
};

export async function getActiveLiquidityByTick(
  tickInput: bigint | number | string
) {
  const initializedTicks = new SortedMap<number, TickInfo>((a, b) => a - b);
  const tick = Number(tickInput);
  const ticksRange = getTicksRange();
  let fetchingCount = 0;
  const tickInfoList: Array<{ tick: number; info: TickInfo }> = [];
  for (const t of ticksRange) {
    console.log("Fetching tick:", t);
    const info = await getTickInfo(tick);
    if (!info) {
      console.log(`System failed to fetch tick info for ${t}`);
      throw new Error("Something went wrong");
    }
    console.log("Ending tick:", t, info);
    if (!info.initialized) continue;
    console.log(t, "is activated");
    tickInfoList.push({ tick: t, info });
    fetchingCount += 1;
    if (fetchingCount === 3) break;
  }
  for (const { info, tick } of tickInfoList) initializedTicks.add(tick, info);
  await writeFile("test.json", initializedTicks.toJSON(), "utf8");
}
