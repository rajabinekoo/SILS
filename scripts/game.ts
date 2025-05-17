import { formatEther, parseEther } from "viem";

import { Actions } from "./actions";
import { ArtificialPool } from "./artificial-pool";
import { debugLog, USDC, WETH } from "../libs/config";

export class Game {
  constructor(
    private readonly actions: Actions,
    private readonly pool: ArtificialPool
  ) {}

  public async calcAvgPriceImpact() {
    const limit = 1000;
    const totalSwaps = await this.actions.count({ eventName: "Swap" });
    if (totalSwaps === 0) return "0.00000";

    const totalSwapPages = Math.ceil(totalSwaps / limit);
    if (debugLog) console.log("Total swaps pages:", totalSwapPages);

    let totalPriceImpact = 0n;

    for (let page = 1; page < totalSwapPages; page++) {
      if (debugLog)
        console.log("Doing price impact average operations for", page);

      const swaps = await this.actions.getActions(
        { page, limit },
        { eventName: "Swap" }
      );

      const priceImpacts = await Promise.all(
        swaps.map(async (s) => {
          if (s.amount0 === 0n || s.amount1 === 0n) return 0n;
          const is0to1 = s.amount0 < 0n && s.amount1 > 0n;
          const inputToken = is0to1 ? USDC : WETH;
          const outputToken = is0to1 ? WETH : USDC;
          const rawIn: bigint = is0to1 ? -s.amount0 : -s.amount1;
          return parseEther(
            await this.pool.calcPriceImpact(
              inputToken,
              outputToken,
              rawIn.toString()
            )
          );
        })
      );

      totalPriceImpact += priceImpacts.reduce((p, c) => p + c, 0n);
    }

    return (Number(formatEther(totalPriceImpact)) / totalSwaps).toFixed(5);
  }
}
