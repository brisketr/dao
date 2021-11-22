import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { expect } from "chai";

import { BRIBToken } from "../typechain/BRIBToken";
import { MockBRIBSnapshot202107 } from "../typechain/MockBRIBSnapshot202107";
import { BRIBAirdrop202107 } from "../typechain/BRIBAirdrop202107";
import { Signers } from "../types";

const { deployContract } = hre.waffle;

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.user = signers[1];
  });

  describe("BRIBAirdrop202107", function () {
    beforeEach(async function () {
      // Deploy mock snapshot
      const snapshotArtifact: Artifact = await hre.artifacts.readArtifact("MockBRIBSnapshot202107");
      this.snapshot = <MockBRIBSnapshot202107>await deployContract(
        this.signers.admin, snapshotArtifact, []
      );

      // Set admin signer amount to 1000 BRIB
      await this.snapshot.connect(this.signers.admin)
        .setAmount(this.signers.admin.address, hre.ethers.utils.parseUnits('1000', 18));

      // Deploy BRIB token
      const tokenArtifact: Artifact = await hre.artifacts.readArtifact("BRIBToken");
      this.token = <BRIBToken>await deployContract(
        this.signers.admin, tokenArtifact, [this.snapshot.address]
      );

      // Deploy airdrop contract
      const airdropArtifact: Artifact = await hre.artifacts.readArtifact("BRIBAirdrop202107");
      this.airdrop = <BRIBAirdrop202107>await deployContract(
        this.signers.admin,
        airdropArtifact,
        [
          this.token.address,
          this.snapshot.address
        ]
      );

      // Mint tokens to airdrop contract
      await this.token.connect(this.signers.admin)
        .mint(this.airdrop.address, await this.airdrop.AIRDROP_AMOUNT());
    });

    it("should qualify qualified signer and confirm has not already claimed", async function () {
      // Connect airdrop contract with admin signer
      const airdrop = this.airdrop.connect(this.signers.admin);

      // Check that signer qualifies and has not already claimed
      expect(await airdrop.qualifies()).to.be.true;
      expect(await airdrop.alreadyClaimed()).to.be.false;
    });

    it("should allow qualified signer to claim airdrop amount", async function () {
      // Connect airdrop contract with admin signer
      const airdrop = this.airdrop.connect(this.signers.admin);

      // Get the signer's starting balance
      const startBalance = await this.token.balanceOf(this.signers.admin.address);

      // Claim the airdrop
      expect(await airdrop.alreadyClaimed()).to.be.false;
      await airdrop.claim()
      expect(await airdrop.alreadyClaimed()).to.be.true;

      // Verify ending balance is starting balance + AIRDROP_AMOUNT
      expect(await this.token.balanceOf(this.signers.admin.address))
        .to.equal(startBalance.add(await this.airdrop.AIRDROP_AMOUNT()));
    });

    it("should allow qualified signer to claim only once", async function () {
      // Connect airdrop contract with admin signer
      const airdrop = this.airdrop.connect(this.signers.admin);

      // Get starting balance
      const startBalance = await this.token.balanceOf(this.signers.admin.address);

      // Claim the airdrop once
      expect(await airdrop.alreadyClaimed()).to.be.false;
      await airdrop.claim()
      expect(await airdrop.alreadyClaimed()).to.be.true;

      // Claim the airdrop again, which should fail
      await expect(airdrop.claim()).to.be.revertedWith("sender has not already claimed airdrop");
      expect(await airdrop.alreadyClaimed()).to.be.true;

      // Verify ending balance is starting balance + AIRDROP_AMOUNT
      expect(await this.token.balanceOf(this.signers.admin.address))
        .to.equal(startBalance.add(await this.airdrop.AIRDROP_AMOUNT()));
    });

    it("should not allow unqualified signer to claim airdrop", async function () {
      // Connect airdrop contract with admin signer
      const airdrop = this.airdrop.connect(this.signers.user);

      // Get the signer's starting balance
      const startBalance = await this.token.balanceOf(this.signers.user.address);

      // Verify user does not qualify
      expect(await airdrop.qualifies()).to.be.false;

      // Claim the airdrop
      expect(await airdrop.alreadyClaimed()).to.be.false;
      await expect(airdrop.claim()).to.be.revertedWith("sender qualifies for the airdrop");
      expect(await airdrop.alreadyClaimed()).to.be.false;

      // Verify ending balance is starting balance
      expect(await this.token.balanceOf(this.signers.user.address))
        .to.equal(startBalance);
    });
  });
});
