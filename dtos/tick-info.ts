export type viemTickInfoType = [
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  number,
  boolean
];

export class TickInfo {
  liquidityGross!: string;
  liquidityNet!: string;
  feeGrowthOutside0X128!: string;
  feeGrowthOutside1X128!: string;
  tickCumulativeOutside!: string;
  secondsPerLiquidityOutsideX128!: string;
  secondsOutside!: number;
  initialized!: boolean;

  constructor(data: viemTickInfoType) {
    this.liquidityGross = data[0].toString();
    this.liquidityNet = data[1].toString();
    this.feeGrowthOutside0X128 = data[2].toString();
    this.feeGrowthOutside1X128 = data[3].toString();
    this.tickCumulativeOutside = data[4].toString();
    this.secondsPerLiquidityOutsideX128 = data[5].toString();
    this.secondsOutside = data[6];
    this.initialized = data[7];
  }
}
