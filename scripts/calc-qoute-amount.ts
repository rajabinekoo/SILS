import JSBI from "jsbi";
import { TickMath, FullMath } from "@uniswap/v3-sdk";

export function calcQoutePrice(
  inputAmount: number,
  currentTick: number,
  baseTokenDecimals: number,
  quoteTokenDecimals: number
) {
  const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(currentTick);
  const ratioX192 = JSBI.multiply(sqrtRatioX96, sqrtRatioX96);

  const baseAmount = JSBI.BigInt(inputAmount * 10 ** baseTokenDecimals);

  const shift = JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(192));

  const quoteAmount = FullMath.mulDivRoundingUp(ratioX192, baseAmount, shift);

  return {
    quoteAmount,
    qouteAmountPrice: Number(quoteAmount.toString()) / 10 ** quoteTokenDecimals,
  };
}

// console.log(calcQoutePrice(1, 267128, 8, 18)); // WBTC/WETH
