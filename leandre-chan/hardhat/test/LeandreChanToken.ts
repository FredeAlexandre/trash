import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("LeandreChanToken", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner] = await hre.viem.getWalletClients();

    const contract = await hre.viem.deployContract("LeandreChanToken", ["https://api.leandrechan.com/token/"]);

    return {
      contract,
      owner
    };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { contract } = await loadFixture(deployFixture);

      expect(await contract.read.baseURI()).to.equal("https://api.leandrechan.com/token/");
    });
  });

  describe("Token URI", function () {
    it("Should return the uri with token concatanated", async function () {
      const { contract, owner } = await loadFixture(deployFixture);

      await contract.write.mint([owner.account.address, 1n])

      expect(await contract.read.tokenURI([0n])).to.equal("https://api.leandrechan.com/token/0");
    });

    it("Should revert if the token doesn't exist", async function () {
      const { contract } = await loadFixture(deployFixture);

      await expect(contract.read.tokenURI([0n])).to.be.rejectedWith(`InvalidTokenId`);
    });
  });
});
