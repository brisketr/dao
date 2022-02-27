import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { expect } from "chai";

import { InfoExchange } from "../../../typechain/InfoExchange";
import { BRIBToken } from "../../../typechain/BRIBToken";
import { MockBRIBSnapshot202107 } from "../../../typechain/MockBRIBSnapshot202107";
import { Signers } from "../../../types";

const { deployContract } = hre.waffle;

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];

    // Set this.signers.users to be an array of signers of size 25.
    this.users = [];

    // Generate wallets
    for (let i = 1; i <= 25; i++) {
      let entropy: Uint8Array

      // Set entropy to 16 bytes of deterministic randomness seeded by i.
      entropy = new Uint8Array(16);
      entropy[0] = i;

      // Generate mnemonic from entropy
      const mnemonic = await hre.ethers.utils.entropyToMnemonic(entropy);
      const wallet = hre.ethers.Wallet.fromMnemonic(mnemonic)
      this.users.push(wallet.connect(hre.ethers.provider));
    }

    // Set this.initialBRIBBalances to be an array of balances of size 25 where
    // each element is random and out of order.
    this.initialBRIBBalances = [
      15985,
      2874987,
      198,
      49823,
      10,
      998,
      3287644,
      876324,
      9134,
      23489,
      5985,
      287987,
      898,
      4823,
      1000,
      998,
      787644,
      7324,
      134,
      3489,
      198511,
      89898,
      7985,
      88858,
      885,
    ];

    // Assert that this.initialBRIBBalances is of same size as this.users.
    expect(this.initialBRIBBalances.length).to.equal(this.users.length);

    // Log address and balanceof each signer
    for (let i = 0; i < this.users.length; i++) {
      console.log(`user ${i}: ${this.users[i].address}`);
      console.log(`balance: ${this.initialBRIBBalances[i]}`);
    }

    // Log # of users
    console.log(`# users: ${this.users.length}`);

  });

  describe("InfoExchange", function () {
    beforeEach(async function () {
      // Deploy mock snapshot
      const snapshotArtifact: Artifact = await hre.artifacts.readArtifact("MockBRIBSnapshot202107");
      this.snapshot = <MockBRIBSnapshot202107>await deployContract(
        this.signers.admin, snapshotArtifact, []
      );

      // Set admin signer amount to 1000 BRIB
      await this.snapshot.connect(this.signers.admin)
        .setAmount(this.signers.admin.address, hre.ethers.utils.parseUnits('1000', 18));

      // Transfer 1 eth from admin to each user account for gas
      for (let i = 0; i < this.users.length; i++) {
        // Create a transaction object
        let tx = {
          to: this.users[i].address,
          value: hre.ethers.utils.parseEther('1')
        }

        // Send transaction
        console.log(`sending 1 eth to ${this.users[i].address}`);
        await this.signers.admin.sendTransaction(tx);
      }

      // Set user BRIB amounts
      for (let i = 0; i < this.users.length; i++) {
        console.log(`setting ${this.users[i].address} to ${this.initialBRIBBalances[i]} BRIB`);
        await this.snapshot.connect(this.signers.admin)
          .setAmount(this.users[i].address, hre.ethers.utils.parseUnits(this.initialBRIBBalances[i].toString(), 18));
      }

      // Deploy BRIB token
      const tokenArtifact: Artifact = await hre.artifacts.readArtifact("BRIBToken");
      this.token = <BRIBToken>await deployContract(
        this.signers.admin, tokenArtifact, [this.snapshot.address]
      );

      console.log(`BRIB token address: ${this.token.address}`);

      // Deploy InfoExchange contract
      const infoExchangeArtifact: Artifact = await hre.artifacts.readArtifact("InfoExchange");
      this.infoExchange = <InfoExchange>await deployContract(
        this.signers.admin, infoExchangeArtifact, [this.token.address]
      );
    });

    it("should have topStakers all zeroed by default", async function () {
      // Connect infoExchange contract with admin signer
      const infoExchange = this.infoExchange.connect(this.signers.admin);

      // Get zeroAddress
      const zeroAddress = hre.ethers.constants.AddressZero;

      // Get TOP_STAKER_COUNT
      const topStakerCount = await infoExchange.TOP_STAKER_COUNT();

      // Verify size of topStakers is equal to zeroed array of size infoExchange.TOP_STAKER_COUNT
      expect(await infoExchange.topStakers()).to.be.deep.equal(new Array(topStakerCount).fill(zeroAddress));
    });

    it("should have minStake() equal to 1 by default", async function () {
      // Connect infoExchange contract with admin signer
      const infoExchange = this.infoExchange.connect(this.signers.admin);

      // Verify minStake() is equal to 1
      expect(await infoExchange.minStake()).to.be.equal(hre.ethers.constants.One);
    });

    it("should have topStakers ordered by BRIB balance", async function () {
      let stakedBalances = [];

      for (let i = 0; i < 5; i++) {
        const staker = this.users[i].address;
        const amount = await this.token.connect(this.users[i]).balanceOf(staker);

        const bribAmount = hre.ethers.utils.formatUnits(amount, 18);

        // Approve tokens to stake
        console.log(`staker ${staker} approving ${bribAmount} BRIB`);
        await this.token.connect(this.users[i]).approve(this.infoExchange.address, amount);

        // Stake tokens
        console.log(`staker ${staker} staking ${bribAmount} BRIB`);
        await this.infoExchange.connect(this.users[i]).stake(staker, amount);

        // Verify user BRIB amount now equals 0 because all was staked.
        const userBalance = await this.token.connect(this.users[i]).balanceOf(staker);
        expect(userBalance).to.be.equal(0);

        stakedBalances.push([staker, bribAmount]);
      }

      // Get top stakers
      const topStakers = await this.infoExchange.topStakers();

      // Log top stakers
      console.log(`top stakers:`);

      for (let i = 0; i < topStakers.length; i++) {
        console.log(`${i}: ${topStakers[i]} stakedBalance ${hre.ethers.utils.formatUnits(await this.infoExchange.connect(this.users[i]).stakedBalance(topStakers[i]), 18)}`);
      }

      // Verify last 5 elements in topStakers are the staked balances of the
      // first 5 users in order of staked balance and that all other elements
      // are zeroed.

      // Sort stakedBalances by balance.
      stakedBalances.sort((a, b) => {
        return a[1] - b[1];
      });

      // Define array of expected topStakers
      const expectedTopStakers = [];

      // Get TOP_STAKER_COUNT
      const topStakerCount = await this.infoExchange.connect(this.signers.admin).TOP_STAKER_COUNT();

      // Zero out topStakers array
      for (let i = 0; i < topStakerCount - 5; i++) {
        expectedTopStakers.push(hre.ethers.constants.AddressZero);
      }

      // Add test stakers to expectedTopStakers
      for (let i = 0; i < 5; i++) {
        expectedTopStakers.push(stakedBalances[i][0]);
      }

      // Verify topStakers are equal to expectedTopStakers
      expect(topStakers).to.be.deep.equal(expectedTopStakers);
    });

    it("should evict the lowest staker when more than TOP_STAKER_COUNT stakers try to stake", async function () {
      // Get TOP_STAKER_COUNT
      const topStakerCount = await this.infoExchange.connect(this.signers.admin).TOP_STAKER_COUNT();

      // Verify isFull
      expect(await this.infoExchange.connect(this.signers.admin).isFull()).to.be.false;

      // Verify minStake
      expect(await this.infoExchange.connect(this.signers.admin).minStake()).to.be.equal(1);

      // Fill all staking slots.
      for (let i = 0; i < topStakerCount; i++) {
        const staker = this.users[i].address;
        const amount = await this.token.connect(this.users[i]).balanceOf(staker);

        const bribAmount = hre.ethers.utils.formatUnits(amount, 18);

        // Approve tokens to stake
        console.log(`staker ${staker} approving ${bribAmount} BRIB`);
        await this.token.connect(this.users[i]).approve(this.infoExchange.address, amount);

        // Stake tokens
        console.log(`staker ${staker} staking ${bribAmount} BRIB`);
        await this.infoExchange.connect(this.users[i]).stake(staker, amount);
      }

      // Verify minStake
      expect(await this.infoExchange.connect(this.signers.admin).minStake()).to.be.equal(hre.ethers.utils.parseUnits('10', 18).add(1));

      // Get top stakers
      const topStakers = await this.infoExchange.topStakers();

      // Log top stakers
      console.log(`top stakers:`);

      for (let i = 0; i < topStakers.length; i++) {
        console.log(`${i}: ${topStakers[i]} stakedBalance ${hre.ethers.utils.formatUnits(await this.infoExchange.connect(this.users[i]).stakedBalance(topStakers[i]), 18)}`);
      }

      // Stake one more and verify evict event
      const staker = this.users[topStakerCount].address;
      const amount = await this.token.connect(this.users[topStakerCount]).balanceOf(staker);
      const bribAmount = hre.ethers.utils.formatUnits(amount, 18);

      // Verify isFull
      expect(await this.infoExchange.connect(this.signers.admin).isFull()).to.be.true;

      // Approve tokens to stake
      console.log(`staker ${staker} approving ${bribAmount} BRIB`);
      await this.token.connect(this.users[topStakerCount]).approve(this.infoExchange.address, amount);

      // Stake tokens
      // Expect revert because a week hasn't passed
      await expect(this.infoExchange.connect(this.users[topStakerCount])
        .stake(staker, amount))
        .to.be.revertedWith("must stake for at least a week");


      expect((await this.infoExchange.connect(this.signers.admin).timeUntilEvict()).gt(600000)).to.be.true;

      // Increase time by 5 days
      await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 5]);
      await hre.ethers.provider.send("evm_mine", []);

      expect((await this.infoExchange.connect(this.signers.admin).timeUntilEvict()).lt(190000)).to.be.true;
      expect((await this.infoExchange.connect(this.signers.admin).timeUntilEvict()).gt(170000)).to.be.true;

      // Increase time by 5 days
      await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 5]);
      await hre.ethers.provider.send("evm_mine", []);

      expect(await this.infoExchange.connect(this.signers.admin).timeUntilEvict()).to.be.equal(0);

      await expect(this.infoExchange.connect(this.users[topStakerCount])
        .stake(staker, amount)).to.emit(this.infoExchange, "EvictStaker").withArgs('0x8cC23CAA26d90311816cdb327A7f0B5FAe0f5cee');

      // Verify minStake
      expect(await this.infoExchange.connect(this.signers.admin).minStake()).to.be.equal(hre.ethers.utils.parseUnits('134', 18).add(1));

    });

    it("should unstake and return tokens", async function () {
      let stakedBalances = [];

      for (let i = 0; i < 5; i++) {
        const staker = this.users[i].address;
        const amount = await this.token.connect(this.users[i]).balanceOf(staker);

        const bribAmount = hre.ethers.utils.formatUnits(amount, 18);

        // Approve tokens to stake
        console.log(`staker ${staker} approving ${bribAmount} BRIB`);
        await this.token.connect(this.users[i]).approve(this.infoExchange.address, amount);

        // Stake tokens
        console.log(`staker ${staker} staking ${bribAmount} BRIB`);
        await this.infoExchange.connect(this.users[i]).stake(staker, amount);

        // Verify user BRIB amount now equals 0 because all was staked.
        const userBalance = await this.token.connect(this.users[i]).balanceOf(staker);
        expect(userBalance).to.be.equal(0);

        stakedBalances.push([staker, bribAmount]);
      }

      // Get top stakers
      let topStakers = await this.infoExchange.topStakers();

      // Log top stakers
      console.log(`top stakers:`);

      for (let i = 0; i < topStakers.length; i++) {
        console.log(`${i}: ${topStakers[i]} stakedBalance ${hre.ethers.utils.formatUnits(await this.infoExchange.connect(this.users[i]).stakedBalance(topStakers[i]), 18)}`);
      }

      // Verify that unstake works
      console.log(`unstaking ${this.users[0].address}`);
      expect(await this.token.connect(this.users[0]).balanceOf(this.users[0].address)).to.be.equal(0);

      // Expect revert because a week hasn't passed
      await expect(this.infoExchange.connect(this.users[0])
        .unstake(this.users[0].address, hre.ethers.utils.parseUnits(this.initialBRIBBalances[0].toString())))
        .to.be.revertedWith("must stake for at least a week");
      
      // Increase time by a week
      await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 7]);
      
      // Unstake
      await expect(this.infoExchange.connect(this.users[0])
        .unstake(this.users[0].address, hre.ethers.utils.parseUnits(this.initialBRIBBalances[0].toString())))
        .to.emit(this.infoExchange, "Unstaked").withArgs(this.users[0].address, hre.ethers.utils.parseUnits(this.initialBRIBBalances[0].toString()));

      // Verify balance
      expect(await this.token.connect(this.users[0]).balanceOf(this.users[0].address)).to.be.equal(hre.ethers.utils.parseUnits(this.initialBRIBBalances[0].toString()));

      // Get top stakers
      topStakers = await this.infoExchange.topStakers();

      // Log top stakers
      console.log(`top stakers:`);

      for (let i = 0; i < topStakers.length; i++) {
        console.log(`${i}: ${topStakers[i]} stakedBalance ${hre.ethers.utils.formatUnits(await this.infoExchange.connect(this.users[i]).stakedBalance(topStakers[i]), 18)}`);
      }
    });

    it("should be able to get/set CID", async function () {
      const cid = 'QmeY8AKomGLvmDy7asmFRdEe3BfYweJPtnkAGpk4iHAHf1';

      // Verify initial conditions
      expect(await this.infoExchange.connect(this.signers.admin).cid(this.signers.admin.address)).to.be.equal('');

      // Register CID
      await this.infoExchange.connect(this.signers.admin).registerCid(cid);

      // Verify CID
      expect(await this.infoExchange.connect(this.signers.admin).cid(this.signers.admin.address)).to.be.equal(cid);
    });
  });
});
