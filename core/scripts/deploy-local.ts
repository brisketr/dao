import { ethers } from "hardhat";

import {
  BRIBToken,
  BRIBToken__factory,
  MockBRIBSnapshot202107,
  MockBRIBSnapshot202107__factory,
  BRIBAirdrop202107,
  BRIBAirdrop202107__factory,
  BrisketTreasury,
  BrisketTreasury__factory
} from "../typechain";

async function main(): Promise<void> {
  const signers = await ethers.getSigners();
  console.log("Signer 0 address: ", signers[0].address)

  const BrisketTreasury: BrisketTreasury__factory = await ethers.getContractFactory("BrisketTreasury");
  const brisketTreasury: BrisketTreasury = await BrisketTreasury.deploy();

  await brisketTreasury.deployed();
  console.log("BrisketTreasury deployed to: ", brisketTreasury.address);

  const mockBRIBSnapshot202107: MockBRIBSnapshot202107__factory = await ethers.getContractFactory("MockBRIBSnapshot202107");
  const snapshot: MockBRIBSnapshot202107 = await mockBRIBSnapshot202107.deploy();

  await snapshot.deployed();
  console.log("MockBRIBSnapshot202107 deployed to: ", snapshot.address);

  // Make signer 0 qualified for the airdrop
  await snapshot.setAmount(signers[0].address, ethers.utils.parseUnits("1000", 18));
  console.log("Made signer 0 eligible for airdrop: ", signers[0].address);

  // Set token amount on BrisketTreasury
  await snapshot.setAmount(brisketTreasury.address, ethers.utils.parseUnits("1000", 18));
  console.log("Set BrisketTreasury token amount to 1000 BRIB");

  const BRIBToken: BRIBToken__factory = await ethers.getContractFactory("BRIBToken");
  const token: BRIBToken = await BRIBToken.deploy(snapshot.address);

  await token.deployed();
  console.log("BRIBToken deployed to: ", token.address);

  const BRIBAirdrop202107: BRIBAirdrop202107__factory = await ethers.getContractFactory("BRIBAirdrop202107");
  const airdrop: BRIBAirdrop202107 = await BRIBAirdrop202107.deploy(token.address, snapshot.address);

  await airdrop.deployed();
  console.log("BRIBAirdrop202107 deployed to: ", airdrop.address);

  // Mint tokens to the airdrop contract
  await token.mint(airdrop.address, ethers.utils.parseUnits('10000', 18));
  console.log("Minted airdrop tokens to ", airdrop.address);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
