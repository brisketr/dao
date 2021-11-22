// We require the Hardhat Runtime Environment explicitly here. This is optional but useful for running the
// script in a standalone fashion through `node <script>`. When running the script with `hardhat run <script>`,
// you'll find the Hardhat Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

import {
  BRIBToken,
  BRIBToken__factory,
  BRIBSnapshot202107,
  BRIBSnapshot202107__factory,
  BRIBAirdrop202107,
  BRIBAirdrop202107__factory,
  BrisketTreasury__factory,
  BrisketTreasury
} from "../typechain";

async function main(): Promise<void> {
const { LedgerSigner } = require("@ethersproject/hardware-wallets");    

  var treasuryFactory: BrisketTreasury__factory = await ethers.getContractFactory("BrisketTreasury");
  const ledger = await new LedgerSigner(treasuryFactory.signer.provider, "hid", "m/44'/60'/0'/0/0");                                                                                                                              
  treasuryFactory = await treasuryFactory.connect(ledger);
  console.log("Signer address: " + await treasuryFactory.signer.getAddress());
  const treasury: BrisketTreasury = await treasuryFactory.deploy();

  var snapshotFactory: BRIBSnapshot202107__factory = await ethers.getContractFactory("BRIBSnapshot202107");
  snapshotFactory = await snapshotFactory.connect(ledger);
  const snapshot: BRIBSnapshot202107 = await snapshotFactory.deploy(treasury.address);

  await snapshot.deployed();
  console.log("BRIBSnapshot202107 deployed to: ", snapshot.address);

  var tokenFactory: BRIBToken__factory = await ethers.getContractFactory("BRIBToken");
  tokenFactory = await tokenFactory.connect(ledger);
  const token: BRIBToken = await tokenFactory.deploy(snapshot.address);

  await token.deployed();
  console.log("BRIBToken deployed to: ", token.address);
}

// We recommend this pattern to be able to use async/await everywhere and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
