import { type HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "hardhat-watcher";

import "./tasks"

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  watcher: {
    dev: {
      tasks: [
        "export-abis"
      ]
    },
  },
  exportAbis: {
    contracts: ["ERC721"],
    outputDirectory: "../ponder/abis"
  }
};

export default config;
