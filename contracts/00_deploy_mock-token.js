const { sleep }  = require("../utils/sleep")

const isVerifying = true;
const VERIFY_DELAY = 100000;

const deployFunction = async ({ getNamedAccounts, deployments, ethers, upgrades, run }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const args = [
    'UBXT Token', 'UBXT', 18, '100000000000000000000000000000000000'
  ]
  // BaseERC20 Deploying//////////////////////////////////////
  console.log('BaseERC20 Token deploying...');
  const wethMock = await deploy("BaseERC20Token", {
    from: deployer,
    args: args,
  })

  const tokenAddress = wethMock.address;
  // const tokenAddress = "0x08656a923ac257DECa0BC7971cc8419597E95240";
  console.log('BaseERC20 Token address:', tokenAddress);

  if(isVerifying) {
    console.log("Verifying BaseERC20 token, can take some time")
    await sleep(VERIFY_DELAY);
    await run("verify:verify", {
        address: tokenAddress,
        constructorArguments: args,
        contract: "contracts/mock/BaseERC20Token.sol:BaseERC20Token"
    })
  }
};

module.exports = deployFunction;
module.exports.tags = ["BaseERC20Token"];


// ***** Deploying *****
// npx hardhat deploy --network goerli --tags BaseERC20Token
// npx hardhat deploy --network bsctestnet --tags BaseERC20Token

// JOY: 0x08656a923ac257DECa0BC7971cc8419597E95240
// UBXT: 0xAbe30B5B6Fd0bBb3D675b985Fa6f4829306a21A5