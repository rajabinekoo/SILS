import { parseUnits } from "viem";

import { USDC, WETH } from "./libs/config";
import { ArtificialPool } from "./scripts/artificial-pool";
import { Actions } from "./scripts/actions";
import { Game } from "./scripts/game";

async function main() {
  const pool = new ArtificialPool(USDC, WETH, "activeLiquidities.json");
  const actions = new Actions("dataset.csv");
  const game = new Game(actions, pool);
  const piAvg = await game.calcAvgPriceImpact();
  console.log(piAvg);
}

main()
  .then(() => console.log("Process done"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
