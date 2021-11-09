const { ethers } = require("ethers");
require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const {
  getContractDeployer,
  isVerified,
  isDeployerKnown,
  isEoa,
} = require("../utils");

const provider = new ethers.providers.JsonRpcProvider(
  `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API}`
);

async function run() {
  console.log("running");

  
}

function main() {
  const startTime = Date.now();
  run()
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      const timeElapsed = Date.now() - startTime;
      console.log(`Done in ${(timeElapsed / 1000).toFixed(2)}s`);
      process.exit(1);
    });
}
main();
