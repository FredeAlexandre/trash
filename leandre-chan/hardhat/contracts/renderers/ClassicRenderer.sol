// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { LibString } from "solmate/src/utils/LibString.sol";
import { Auth, Authority } from "solmate/src/auth/Auth.sol";
import { ERC721Renderer } from "../ShooterSkinNFT.sol";

/// @notice Classic ERC721 Renderer.
/// @author Alexandre Frede (https://github.com/FredeAlexandre)
contract ClassicRenderer is ERC721Renderer, Auth {
  using LibString for uint256;

  string public baseURI;

  constructor(string memory _baseURI, Authority _authority) Auth(address(0), _authority) {
    baseURI = _baseURI;
  }

  function render(uint256 id) public view override virtual returns (string memory) {
    return string(abi.encodePacked(baseURI, id.toString()));
  }

  function setBaseURI(string memory _baseURI) public requiresAuth {
    baseURI = _baseURI;
  }
}
