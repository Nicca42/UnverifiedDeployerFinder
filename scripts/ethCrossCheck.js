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

  var addressesJson = require("../data/ethCrossCheck/verifiedContractAddresses.json");
  let verifiedContractAddresses = addressesJson.verified_contracts;
  var wethAddressesJson = require("../data/ethCrossCheck/wethAddresses.json");
  let wethAddresses = wethAddressesJson.known_weth_addresses;
  let caseFormatted = new Array();

  for (let i = 0; i < wethAddresses.length; i++) {
    caseFormatted[i] = wethAddresses[i].toUpperCase();
  }

  for (let i = 0; i < verifiedContractAddresses.length; i++) {
    let balance = await provider.getBalance(verifiedContractAddresses[i]);
    if(balance.toString() != "0") {
      if(!caseFormatted.includes(verifiedContractAddresses[i].toUpperCase())) {
        console.log("Not included: ", verifiedContractAddresses[i]);
        console.log("Eth balance: ", balance.toString())
      }
    }
  }  
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
