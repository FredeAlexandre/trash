import { createConfig } from "@ponder/core";
import { http } from "viem";
import { ERC721ABI } from "./abis/ERC721";

export default createConfig({
  networks: {
    hardhat: {
      chainId: 31337,
      transport: http("http://127.0.0.1:8545/"),
    },
  },
  contracts: {
    ERC721: {
      network: "hardhat",
      abi: ERC721ABI,
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    },
  },
});
