import { fetchAndSaveActiveLiquidities } from "./scripts/active-liquidity";

async function main() {
  await fetchAndSaveActiveLiquidities("activeLiquidities.json");
}

main()
  .then(() => console.log("Process done"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
