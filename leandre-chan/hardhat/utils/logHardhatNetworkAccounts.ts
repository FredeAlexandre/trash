import type { HardhatNetworkConfig } from "hardhat/types";
import { HARDHAT_NETWORK_MNEMONIC } from "hardhat/internal/core/config/default-config"
import { normalizeHardhatNetworkAccountsConfig  } from "hardhat/internal/core/providers/util"

import { printDefaultConfigWarning } from "./printDefaultConfigWarning"

import { bytesToHex as bufferToHex, privateToAddress, toBytes, toChecksumAddress } from "@nomicfoundation/ethereumjs-util"

export function logHardhatNetworkAccounts(networkConfig: HardhatNetworkConfig) {
  const isDefaultConfig =
    !Array.isArray(networkConfig.accounts) &&
    networkConfig.accounts.mnemonic === HARDHAT_NETWORK_MNEMONIC;

  console.log("Accounts");
  console.log("========");

  if (isDefaultConfig) {
    console.log();
    printDefaultConfigWarning();
    console.log();
  }

  const accounts = normalizeHardhatNetworkAccountsConfig(
    networkConfig.accounts
  );

  for (const [index, account] of accounts.entries()) {
    const address = toChecksumAddress(
      bufferToHex(privateToAddress(toBytes(account.privateKey)))
    );

    const balance = (BigInt(account.balance) / 10n ** 18n).toString(10);

    let entry = `Account #${index}: ${address} (${balance} ETH)`;

    if (isDefaultConfig) {
      const privateKey = bufferToHex(toBytes(account.privateKey));
      entry += `
Private Key: ${privateKey}`;
    }

    console.log(entry);
    console.log();
  }

  if (isDefaultConfig) {
    printDefaultConfigWarning();
    console.log();
  }
}