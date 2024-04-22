import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LeandreChanTokenModule = buildModule("LeandreChanTokenModule", (m) => {
  const baseURI = m.getParameter("baseURI", "https://api.leandrechan.com/token/");

  return { "leandre-chan-token": m.contract("LeandreChanToken", [baseURI]) };
});

export default LeandreChanTokenModule;
