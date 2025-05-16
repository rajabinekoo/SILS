import { parseUnits } from "viem";

import { USDC, WETH } from "./libs/config";
import { ArtificialPool } from "./scripts/artificial-pool";

async function main() {
  const pool = new ArtificialPool(USDC, WETH, "activeLiquidities.json");
  const priceImpact = await pool.calcPriceImpact(
    USDC,
    WETH,
    parseUnits("100", USDC.decimals).toString()
  );
  console.log(`Price Impact: ${priceImpact}%`);
}

main()
  .then(() => console.log("Process done"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
