const { ethers } = require("ethers");
var fs = require("fs");
require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const {
  eoaCode,
  getContractDeployer,
  isVerified,
  isDeployerKnown,
  isEoa,
} = require("./utils");

const provider = new ethers.providers.JsonRpcProvider(
  `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API}`
);

async function run() {
  console.log("running");

  var addressesJson = require("./addresses.json");
  let contractAddresses = addressesJson.contractAddresses;
  let deployerAddresses = addressesJson.known_deployer;
  let allProblemContracts = new Array();

  for (let i = 0; i < contractAddresses.length; i++) {
    let contractAddress = addressesJson.contractAddresses[i];
    let isAddressEoa = await isEoa(provider, contractAddress);
    let isContractVerified;
    let deployerAddress;

    if (!isAddressEoa) {
      isContractVerified = await isVerified(contractAddress);
      if (!isContractVerified) {
        deployerAddress = await getContractDeployer(contractAddress);
        if (deployerAddress == "GENESIS") {
          allProblemContracts.push({
            address: contractAddress,
            deployer: deployerAddress,
            known: "GENESIS",
          });
        } else {
          let knownDeployer = isDeployerKnown(
            deployerAddress,
            deployerAddresses
          );
          allProblemContracts.push({
            address: contractAddress,
            deployer: deployerAddress,
            known: knownDeployer,
          });
        }
      }
    }
  }

  console.log(allProblemContracts);
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
