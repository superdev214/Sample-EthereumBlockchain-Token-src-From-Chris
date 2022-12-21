import { Contract, Wallet, BigNumber, ContractTransaction, ContractReceipt, constants } from 'ethers';
import { artifacts, ethers } from 'hardhat';
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
​
export async function waitTx(tx: ContractTransaction) {
  const receipt: ContractReceipt = await tx.wait();
  return receipt;
}
​
interface SharedFixture {
  deployer: SignerWithAddress;
  taxReceiver: SignerWithAddress;
  tester1: SignerWithAddress;
  tester2: SignerWithAddress;
  burnAddress: string;
​
  token: Contract;
}
​
export async function sharedFixture(): Promise<SharedFixture> {
  const [deployer, taxReceiver, tester1, tester2] = await ethers.getSigners();
​
  const burnAddress = "0x000000000000000000000000000000000000dEaD";

  // deploy token
  const Finitycoin = await ethers.getContractFactory('Finitycoin', deployer);
  const token = await Finitycoin.deploy(taxReceiver.address);
​
  return {
    deployer, taxReceiver, tester1, tester2, burnAddress, token
  };
}
