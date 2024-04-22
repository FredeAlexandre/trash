// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { Authority } from "solmate/src/auth/Auth.sol";
import { ClassicRenderer } from "./ClassicRenderer.sol";

/// @notice Flexible ERC721 Renderer.
/// @author Alexandre Frede (https://github.com/FredeAlexandre)
contract FlexibleRenderer is ClassicRenderer {

    mapping(uint256 => string) public tokenURIs;

    constructor(string memory _baseURI, Authority _authority) ClassicRenderer(_baseURI, _authority) {}

    function render(uint256 id) public view override returns (string memory) {
      string memory uri = tokenURIs[id];
      if (bytes(uri).length == 0) return super.render(id);
      return uri;
    }

    function setTokenURI(uint256 id, string memory uri) public requiresAuth {
      tokenURIs[id] = uri;
    }
}
