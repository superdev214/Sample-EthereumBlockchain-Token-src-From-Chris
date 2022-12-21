/* eslint-disable no-process-exit */
// works for deployment to rinkeby
const { ethers } = require('hardhat');

async function main() {
  // Start Deploying
  console.log('Deploying contracts with the account...');

  const Finitycoin = await ethers.getContractFactory('Finitycoin');
  const finitycoin = await Finitycoin.deploy();

  await finitycoin.deployed();

  console.log('Finitycoin deployed to:', finitycoin.address);

  try {
    await run('verify:verify', {
      address: finitycoin.address,
      constructorArguments: [],
    });
    console.log('Finitycoin verify success');
  } catch (e) {
    console.log(e);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  // npx hardhat run --network testnet scripts/1_finity_deploy.js