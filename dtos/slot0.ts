export type viemSlot0Type = [bigint, number, number, number, number, number, boolean]

export class Slot0 {
  sqrtPriceX96!: string;
  tick!: string;
  observationIndex!: string;
  observationCardinality!: string;
  observationCardinalityNext!: string;
  feeProtocol!: string;
  unlocked!: boolean;

  constructor(data: viemSlot0Type) {
    this.sqrtPriceX96 = data[0].toString();
    this.tick = data[1].toString();
    this.observationIndex = data[2].toString();
    this.observationCardinality = data[3].toString();
    this.observationCardinalityNext = data[4].toString();
    this.feeProtocol = data[5].toString();
    this.unlocked = data[6];
  }
}
