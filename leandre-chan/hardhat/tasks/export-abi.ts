import { task, extendConfig } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";

import 'hardhat/types/config';
import 'hardhat/types/runtime';

import { promises as fs, existsSync } from "fs";
import path from "path";

import * as prettier from "prettier"

task("export-abi", "Export the ABI of the contract to a specific folder")
  .addPositionalParam("contract", "The contract to generate the ABI for")
  .addOptionalParam("outputDirectory", "The output directory", "./abi")
  .addOptionalParam("outputFile", "The output file")
  .addOptionalParam("cwd", "The current working directory", process.cwd())
  .setAction(async ({ contract, cwd, outputDirectory, outputFile }: { contract: string, cwd: string, outputDirectory: string, outputFile?: string }, hre) => {
    const artifact = await hre.artifacts.readArtifact(contract)

    const directory = path.resolve(cwd, outputDirectory)

    const exists = existsSync(directory)

    if (!exists) {
      await fs.mkdir(directory, { recursive: true })
    }

    const abi = JSON.stringify(artifact.abi, null, 2)
    const tsfile = await prettier.format(`export const ${artifact.contractName}ABI = ${abi} as const;`, { parser: "typescript" })
    const file = path.resolve(directory, outputFile || `${artifact.contractName}.ts`)
    console.log(`Exporting ABI for ${contract} to ${file}`)
    await fs.writeFile(file, tsfile)
  });

task("export-abis", "Export the ABI of the contracts specified in the hardhat config")
  .setAction(async (_, hre) => {
    const { contracts, outputDirectory } = hre.config.exportAbis

    await Promise.all(contracts.map((contract) => hre.run("export-abi", { contract, outputDirectory })))
  });

extendConfig((config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
  config.exportAbis = userConfig.exportAbis ?? { contracts: [], outputDirectory: "./abi" }
})

declare module 'hardhat/types/config' {
  export type ExportABIConfig = {
    contracts: string[],
    outputDirectory?: string,
  }

  export interface HardhatUserConfig {
    exportAbis?: ExportABIConfig
  }

  export interface HardhatConfig {
    exportAbis: ExportABIConfig
  }
}
