import { getActiveLiquidityByTick } from "./scripts/active-liquidity";
import { getSlot0Status } from "./scripts/slot0-status";

async function main() {
  console.log(await getSlot0Status());
  
  await getActiveLiquidityByTick(12345);
}

main();

// import { createPublicClient, http } from "viem";
// import { mainnet } from "viem/chains";
// import { Abi, parseAbi } from "viem";
// import { poolAddress, publicClient } from "./libs/config";

// // آدرس استخر و ABI لازم
// const POOL_ADDRESS = poolAddress;
// const POOL_ABI = parseAbi([
//   // فقط توابعی که نیاز داریم
//   "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16, uint16, uint16, uint8, bool)",
//   "function tickSpacing() view returns (int24)",
//   "function ticks(int24) view returns (uint128 liquidityGross, int128 liquidityNet, uint256 feeGrowthOutside0X128, uint256 feeGrowthOutside1X128, int56 tickCumulativeOutside, uint160 secondsPerLiquidityOutsideX128, uint32 secondsOutside, bool initialized)",
// ]);

// async function getActiveLiquidityByRange() {
//   // 1. خواندن tickSpacing و current tick
//   const tickSpacing = (await publicClient.readContract({
//     address: POOL_ADDRESS,
//     abi: POOL_ABI,
//     functionName: "tickSpacing",
//   })) as number;

//   const { tick: currentTick } = (await publicClient.readContract({
//     address: POOL_ADDRESS,
//     abi: POOL_ABI,
//     functionName: "slot0",
//   })) as unknown as { tick: number };
//   console.log(`current tick: ${currentTick}`);

//   // 2. تعیین حداقل و حداکثر tick مجاز (بر اساس استاندارد Uniswap V3)
//   const MIN_TICK = Math.ceil(-887272 / tickSpacing) * tickSpacing;
//   const MAX_TICK = Math.floor(887272 / tickSpacing) * tickSpacing;

//   // 3. پیمایش همه tickها و انبار کردن آن‌هایی که initialized هستند
//   type TickInfo = {
//     liquidityGross: bigint;
//     liquidityNet: bigint;
//     feeGrowthOutside0X128: bigint;
//     feeGrowthOutside1X128: bigint;
//     tickCumulativeOutside: bigint;
//     secondsPerLiquidityOutsideX128: bigint;
//     secondsOutside: number;
//     initialized: boolean;
//   };
//   const initializedTicks: number[] = [];

//   for (let t = MIN_TICK; t <= MAX_TICK; t += tickSpacing) {
//     const info = (await publicClient.readContract({
//       address: POOL_ADDRESS,
//       abi: POOL_ABI,
//       functionName: "ticks",
//       args: [t],
//     })) as unknown as TickInfo;

//     if (info.initialized) {
//       initializedTicks.push(t);
//     }
//   }

//   // 4. مرتب‌سازی و محاسبه Active Liquidity در هر بازه
//   initializedTicks.sort((a, b) => a - b);
//   let runningLiquidity = 0n;
//   const liquidityByRange: { rangeStart: number; activeLiquidity: bigint }[] =
//     [];

//   for (const t of initializedTicks) {
//     runningLiquidity += (
//       (await publicClient.readContract({
//         address: POOL_ADDRESS,
//         abi: POOL_ABI,
//         functionName: "ticks",
//         args: [t],
//       })) as unknown as TickInfo
//     ).liquidityNet;

//     liquidityByRange.push({
//       rangeStart: t,
//       activeLiquidity: runningLiquidity,
//     });
//   }

//   // 5. خروجی
//   return liquidityByRange.map(({ rangeStart, activeLiquidity }) => ({
//     range: `[${rangeStart}, ${rangeStart + tickSpacing})`,
//     activeLiquidity: activeLiquidity.toString(),
//   }));
// }

// getActiveLiquidityByRange()
//   .then((data) => console.table(data))
//   .catch((err) => console.error(err));
