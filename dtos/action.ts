import { RowData } from "duckdb";
import { Address } from "viem";

type actionType = "Swap" | "Mint" | "Burn";

export class Action {
  amount0!: bigint;
  amount1!: bigint;
  blockNumber!: bigint;
  blockTimestamp!: bigint;
  id!: string;
  liquidity!: bigint;
  owner!: string;
  logIndex!: bigint;
  sender!: Address;
  tickLower!: bigint;
  tickUpper!: bigint;
  origin!: Address;
  event!: actionType;
  tick!: bigint;
  recipient!: Address;
  sqrtPriceX96!: bigint;

  constructor(data: RowData) {
    this.tick = BigInt(data.tick);
    this.amount0 = BigInt(data.amount0);
    this.amount1 = BigInt(data.amount1);
    this.logIndex = BigInt(data.logIndex);
    this.liquidity = BigInt(data.liquidity);
    this.tickUpper = BigInt(data.tickUpper);
    this.tickLower = BigInt(data.tickLower);
    this.blockNumber = BigInt(data.blockNumber);
    this.sqrtPriceX96 = BigInt(data.sqrtPriceX96);
    this.blockTimestamp = BigInt(data.blockTimestamp);
    this.id = data.id;
    this.owner = data.owner;
    this.event = data.event;
    this.origin = data.origin;
    this.sender = data.sender;
    this.recipient = data.recipient;
  }
}

export interface IGetActionsReq {
  page?: number;
  limit?: number;
}

export interface IActionsQuery {
  eventName?: string;
}
