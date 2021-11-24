import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { BRIBToken } from "../typechain/BRIBToken";
import { MockBRIBSnapshot202107 } from "../typechain/MockBRIBSnapshot202107";
import { Signdrop } from "../typechain/Signdrop";
import { Signers } from "../types";

const { deployContract } = hre.waffle;

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.user = signers[1];
  });

  describe("Signdrop", function () {
    beforeEach(async function () {
      // Deploy mock snapshot
      const snapshotArtifact: Artifact = await hre.artifacts.readArtifact("MockBRIBSnapshot202107");
      this.snapshot = <MockBRIBSnapshot202107>await deployContract(
        this.signers.admin, snapshotArtifact, []
      );

      // Set admin signer amount to 1000 BRIB
      await this.snapshot.connect(this.signers.admin)
        .setAmount(this.signers.admin.address, hre.ethers.utils.parseUnits('1000', 18));

      // Generate 10 Wallets
      this.airdropWallets = [];

      for (let i = 0; i < 10; i++) {
        this.airdropWallets.push(hre.ethers.Wallet.createRandom());
      }

      // Initialize airdrop addresses to first address in each of the generated wallets
      this.airdropAddresses = [];

      this.airdropWallets.forEach((wallet: any) => {
        this.airdropAddresses.push(wallet.address);
      });

      // Deploy BRIB token
      const tokenArtifact: Artifact = await hre.artifacts.readArtifact("BRIBToken");
      this.token = <BRIBToken>await deployContract(
        this.signers.admin, tokenArtifact, [this.snapshot.address]
      );

      // Deploy signdrop contract
      const signdropArtifact: Artifact = await hre.artifacts.readArtifact("Signdrop");
      this.airdropAmount = hre.ethers.utils.parseUnits('100', 18);
      this.signdrop = <Signdrop>await deployContract(
        this.signers.admin,
        signdropArtifact,
        [
          this.token.address,
          this.airdropAmount,
          this.airdropAddresses,
        ]
      );

      // Mint tokens to signdrop contract
      await this.token.connect(this.signers.admin)
        .mint(this.signdrop.address, (await this.signdrop.getAirdropAmount()).mul(this.airdropAddresses.length));
    });

    it("should qualify qualified signer and confirm has not already claimed", async function () {
      // Connect signdrop contract with admin signer
      const signdrop: Signdrop = this.signdrop.connect(this.signers.admin);

      // Get first airdrop address
      const airdropAddress = this.airdropAddresses[0];

      // Check that address qualifies and has not already claimed
      expect(await signdrop.qualifies(airdropAddress)).to.be.true;
      expect(await signdrop.alreadyClaimed(airdropAddress)).to.be.false;
    });

    it("non qualified address does not qualify", async function () {
      // Connect signdrop contract with admin signer
      const signdrop: Signdrop = this.signdrop.connect(this.signers.admin);

      // Use admin address
      const airdropAddress = this.signers.admin.address;

      // Check that address does not qualify
      expect(await signdrop.qualifies(airdropAddress)).to.be.false;
      expect(await signdrop.alreadyClaimed(airdropAddress)).to.be.false;
    });

    it("qualified address can claim airdrop", async function () {
      // Connect signdrop contract with admin signer
      const signdrop: Signdrop = this.signdrop.connect(this.signers.user);

      // Use 1st wallet
      const airdropWallet = this.airdropWallets[0];

      // Log airdrop wallet address
      console.log(`Airdrop wallet address: ${airdropWallet.address}`);

      // Set message to be address of user signer as bytes20
      const message = this.signers.user.address
      console.log(`Message: ${message}`);

      // Sign message using airdrop wallet
      const signature = await airdropWallet.signMessage(hre.ethers.utils.arrayify(message));
      console.log(`Signature: ${signature}`);

      // Check that address qualifies and has not already claimed
      expect(await signdrop.qualifies(airdropWallet.address)).to.be.true;
      expect(await signdrop.alreadyClaimed(airdropWallet.address)).to.be.false;

      const claimTx = await signdrop.claim(message, signature);

      // Wait for transaction to be mined
      await claimTx.wait();

      // Verify that user's BRIB balance is equal to airdrop amount
      expect(await this.token.balanceOf(this.signers.user.address)).to.be.equal(this.airdropAmount);
    });

    it("qualified address cannot claim airdrop if message signed by signer that is not an airdrop address", async function () {
      // Connect signdrop contract with admin signer
      const signdrop: Signdrop = this.signdrop.connect(this.signers.user);

      // Use 1st wallet
      const airdropWallet = this.airdropWallets[0];

      // Log airdrop wallet address
      console.log(`Airdrop wallet address: ${airdropWallet.address}`);

      // Set message to be address of user signer as bytes20
      const message = this.signers.user.address
      console.log(`Message: ${message}`);

      // Sign message using user's wallet (not an airdrop wallet)
      const signature = await this.signers.user.signMessage(hre.ethers.utils.arrayify(message));
      console.log(`Signature: ${signature}`);

      // Check that address qualifies and has not already claimed
      expect(await signdrop.qualifies(airdropWallet.address)).to.be.true;
      expect(await signdrop.alreadyClaimed(airdropWallet.address)).to.be.false;

      await expect(signdrop.claim(message, signature)).to.be.revertedWith("signer must be in airdrop addresses");

      // Verify that user's BRIB balance is zero
      expect(await this.token.balanceOf(this.signers.user.address)).to.be.equal(0);
    });

    it("qualified address cannot claim airdrop if message is different than user's address", async function () {
      // Connect signdrop contract with admin signer
      const signdrop: Signdrop = this.signdrop.connect(this.signers.user);

      // Use 1st wallet
      const airdropWallet = this.airdropWallets[0];

      // Log airdrop wallet address
      console.log(`Airdrop wallet address: ${airdropWallet.address}`);

      // Set message to be address admin user signer as bytes20
      const message = this.signers.admin.address
      console.log(`Message: ${message}`);

      // Sign message using airdrop wallet
      const signature = await airdropWallet.signMessage(hre.ethers.utils.arrayify(message));
      console.log(`Signature: ${signature}`);

      // Check that address qualifies and has not already claimed
      expect(await signdrop.qualifies(airdropWallet.address)).to.be.true;
      expect(await signdrop.alreadyClaimed(airdropWallet.address)).to.be.false;

      await expect(signdrop.claim(message, signature)).to.be.revertedWith("signed to address must match sender");

      // Verify that user's BRIB balance is zero
      expect(await this.token.balanceOf(this.signers.user.address)).to.be.equal(0);
    });

    it("qualified address cannot claim airdrop if already claimed", async function () {
      // Connect signdrop contract with admin signer
      const signdrop: Signdrop = this.signdrop.connect(this.signers.user);

      // Use 1st wallet
      const airdropWallet = this.airdropWallets[0];

      // Log airdrop wallet address
      console.log(`Airdrop wallet address: ${airdropWallet.address}`);

      // Set message to be address of user signer as bytes20
      const message = this.signers.user.address
      console.log(`Message: ${message}`);

      // Sign message using airdrop wallet
      const signature = await airdropWallet.signMessage(hre.ethers.utils.arrayify(message));
      console.log(`Signature: ${signature}`);

      // Check that address qualifies and has not already claimed
      expect(await signdrop.qualifies(airdropWallet.address)).to.be.true;
      expect(await signdrop.alreadyClaimed(airdropWallet.address)).to.be.false;

      // Claim airdrop
      const claimTx = await signdrop.claim(message, signature);

      // Wait for transaction to be mined
      await claimTx.wait();

      // Verify that user's BRIB balance is equal to airdrop amount
      expect(await this.token.balanceOf(this.signers.user.address)).to.be.equal(this.airdropAmount);

      // Check that address still qualifies and has already claimed
      expect(await signdrop.qualifies(airdropWallet.address)).to.be.true;
      expect(await signdrop.alreadyClaimed(airdropWallet.address)).to.be.true;

      // Claim airdrop again
      await expect(signdrop.claim(message, signature)).to.be.revertedWith("signer must not have already claimed");

      // Verify that user's BRIB balance is equal to airdrop amount
      expect(await this.token.balanceOf(this.signers.user.address)).to.be.equal(this.airdropAmount);
    });
  });
});
