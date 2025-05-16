import JSBI from "jsbi";
import { Pool, Route, Tick, Trade } from "@uniswap/v3-sdk";
import { BigintIsh, CurrencyAmount, Token, TradeType } from "@uniswap/sdk-core";

import * as configs from "../libs/config";
import { ActiveLiquidity } from "./active-liquidity";

export class ArtificialPool extends Pool {
  private readonly activeLiquidities!: ActiveLiquidity;
  private readonly poolTokenAddresses!: Record<string, boolean>;

  constructor(tokenA: Token, tokenB: Token, activeLiquiditiesPath: string) {
    const activeLiquidities = new ActiveLiquidity(activeLiquiditiesPath);
    const tickData: Tick[] = activeLiquidities.getSdkTicks();

    super(
      tokenA,
      tokenB,
      configs.fee,
      JSBI.BigInt(configs.slot0.sqrtPriceX96),
      JSBI.BigInt(configs.liquidity.toString()),
      Number(configs.slot0.tick),
      tickData
    );
    this.activeLiquidities = activeLiquidities;
    this.poolTokenAddresses = {
      [this.token0.address.toLowerCase()]: true,
      [this.token1.address.toLowerCase()]: true,
    };
  }

  private inputTokensValidation(tokenA: Token, tokenB: Token) {
    const tokenInAddr = tokenA.address.toLowerCase();
    const tokenOutAddr = tokenB.address.toLowerCase();
    if (!this.poolTokenAddresses[tokenInAddr])
      throw new Error("Invalid tokenA");
    if (!this.poolTokenAddresses[tokenOutAddr])
      throw new Error("Invalid tokenB");
  }

  public async calcPriceImpact(
    tokenIn: Token,
    tokenOut: Token,
    rawAmountIn: BigintIsh
  ) {
    this.inputTokensValidation(tokenIn, tokenOut);
    const amountIn = CurrencyAmount.fromRawAmount(tokenIn, rawAmountIn);
    const route = new Route([this], tokenIn, tokenOut);
    const trade = await Trade.fromRoute(route, amountIn, TradeType.EXACT_INPUT);
    return trade.priceImpact.toSignificant(4);
  }

  public async calcMidImpact(
    tokenIn: Token,
    tokenOut: Token,
    rawAmountIn: BigintIsh
  ) {
    this.inputTokensValidation(tokenIn, tokenOut);
    const amountIn = CurrencyAmount.fromRawAmount(tokenIn, rawAmountIn);
    const route = new Route([this], tokenIn, tokenOut);
    const trade = await Trade.fromRoute(route, amountIn, TradeType.EXACT_INPUT);
    return trade.route.midPrice.toSignificant(6);
  }

  public async calcExecutiveImpact(
    tokenIn: Token,
    tokenOut: Token,
    rawAmountIn: BigintIsh
  ) {
    this.inputTokensValidation(tokenIn, tokenOut);
    const amountIn = CurrencyAmount.fromRawAmount(tokenIn, rawAmountIn);
    const route = new Route([this], tokenIn, tokenOut);
    const trade = await Trade.fromRoute(route, amountIn, TradeType.EXACT_INPUT);
    return trade.executionPrice.toSignificant(6);
  }
}
