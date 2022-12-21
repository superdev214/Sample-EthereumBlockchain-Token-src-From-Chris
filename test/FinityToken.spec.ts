/* eslint-disable node/no-missing-import */
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Contract, constants } from 'ethers';
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
​
import { expect } from "chai";
import { ethers } from 'hardhat';
​
import { expandTo18Decimals } from './shared/utilities';
import { sharedFixture } from './shared/fixtures';
​
const TOTAL_SUPPLY = expandTo18Decimals(6000000000000000);
const TEST1_AMOUNT = expandTo18Decimals(10000);

const TEST2_AMOUNT = expandTo18Decimals(100);
const TEST2_TRANS_AMOUNT = expandTo18Decimals(94);
const TEST2_BURN_AMOUNT = expandTo18Decimals(3);
const TEST2_TAX_AMOUNT = expandTo18Decimals(3);
​
describe('FinityToken', () => {
  let deployer: SignerWithAddress;
  let taxReceiver: SignerWithAddress;
  let tester1: SignerWithAddress;
  let tester2: SignerWithAddress;
  let burnAddress: string;
​
  let token: Contract;
 
  before(async () => {
    const fixture = await loadFixture(sharedFixture);
      
    deployer = fixture.deployer;
    taxReceiver = fixture.taxReceiver;
    tester1 = fixture.tester1;
    tester2 = fixture.tester2;
    burnAddress = fixture.burnAddress;
​
    token = fixture.token;
  });
​
  it('name, symbol, decimals, totalSupply, balanceOf', async () => {
    expect(await token.name()).to.eq('Finitycoin');
    expect(await token.symbol()).to.eq('FINITY');
    expect(await token.decimals()).to.eq(18);
    expect(await token.totalSupply()).to.eq(TOTAL_SUPPLY);
    expect(await token.balanceOf(deployer.address)).to.eq(TOTAL_SUPPLY);
  });
​
  it('transfer', async () => {
    await token.connect(deployer).transfer(tester1.address, TEST1_AMOUNT);
    expect(await token.balanceOf(deployer.address)).to.eq(TOTAL_SUPPLY.sub(TEST1_AMOUNT));
    expect(await token.balanceOf(tester1.address)).to.eq(TEST1_AMOUNT);

    await token.connect(tester1).transfer(tester2.address, TEST2_AMOUNT);
    expect(await token.balanceOf(tester2.address)).to.eq(TEST2_TRANS_AMOUNT);
    expect(await token.balanceOf(taxReceiver.address)).to.eq(TEST2_TAX_AMOUNT);
    expect(await token.balanceOf(burnAddress)).to.eq(TEST2_BURN_AMOUNT);
  });
});