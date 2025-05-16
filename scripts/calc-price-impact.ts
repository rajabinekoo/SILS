import JSBI from "jsbi";
import { Pool, Route, Tick, Trade } from "@uniswap/v3-sdk";
import { CurrencyAmount, Token, TradeType } from "@uniswap/sdk-core";

import { ActiveLiquidity } from "./active-liquidity";
import { fee, slot0, liquidity as baseLiquidty } from "../libs/config";

export async function calcPriceImpact(
  tokenIn: Token,
  tokenOut: Token,
  rawAmountIn: string
) {
  const sqrtPriceX96 = JSBI.BigInt(slot0.sqrtPriceX96);
  const liquidity = JSBI.BigInt(baseLiquidty.toString());
  const tickCurrent = Number(slot0.tick);

  const activeLiquidities = new ActiveLiquidity("activeLiquidities.json");
  const tickData: Tick[] = activeLiquidities.getSdkTicks();

  const pool = new Pool(
    tokenIn,
    tokenOut,
    fee,
    sqrtPriceX96.toString(),
    liquidity.toString(),
    tickCurrent,
    tickData
  );

  const amountIn = CurrencyAmount.fromRawAmount(tokenIn, rawAmountIn);

  const route = new Route([pool], tokenIn, tokenOut);

  const trade = await Trade.fromRoute(route, amountIn, TradeType.EXACT_INPUT);

  const executionPrice = trade.executionPrice.toSignificant(6);
  const midPrice = trade.route.midPrice.toSignificant(6);

  const priceImpact = trade.priceImpact.toSignificant(4);

  return { midPrice, priceImpact, executionPrice };
}
