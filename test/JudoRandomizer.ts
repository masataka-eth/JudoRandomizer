import { expect } from "chai";
import { ethers } from "hardhat";
import { JudoRandomizer } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("JudoRandomizer", function () {
  let judoRandomizer: JudoRandomizer;
  let owner: SignerWithAddress;
  let otherAccount: SignerWithAddress;
  const subscriptionId = 1234; // テスト用のサブスクリプションID
  const vrfCoordinatorMock = "0x1234567890123456789012345678901234567890"; // モックVRFコーディネーターアドレス

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    const JudoRandomizer = await ethers.getContractFactory("JudoRandomizer");
    judoRandomizer = await JudoRandomizer.deploy(
      subscriptionId,
      vrfCoordinatorMock
    );
    await judoRandomizer.waitForDeployment();
  });

  describe("requestRandomWords", function () {
    it("オーナーのみが呼び出せるべき", async function () {
      await expect(judoRandomizer.connect(otherAccount).requestRandomWords(100))
        .to.be.rejected;
    });

    it("maxRangeが0より大きい値でなければならない", async function () {
      await expect(judoRandomizer.requestRandomWords(0)).to.be.revertedWith(
        "Max range must be greater than 0"
      );
    });
  });

  describe("getRandomNumber", function () {
    it("乱数が生成されていない場合はエラーを返すべき", async function () {
      await expect(judoRandomizer.getRandomNumber()).to.be.revertedWith(
        "Random number not generated yet"
      );
    });
  });
});
