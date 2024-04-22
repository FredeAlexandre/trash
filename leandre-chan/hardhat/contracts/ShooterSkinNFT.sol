// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { ERC721 } from "solmate/src/tokens/ERC721.sol";
import { Auth, Authority } from "solmate/src/auth/Auth.sol";

/// @notice Shooter Skin NFT contract.
/// @author Alexandre Frede (https://github.com/FredeAlexandre)
contract ShooterSkinNFT is ERC721("Shooter Skin NFT", "SSN"), Auth {
    ERC721Renderer public renderer;

    constructor(ERC721Renderer _renderer, Authority _authority) Auth(address(0), _authority) {
        renderer = _renderer;
    }

    function mint(address to, uint256 id) public requiresAuth {
        _mint(to, id);
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        return renderer.render(id);
    }
}

/// @notice A generic interface for contract that render tokens.
/// @author Alexandre Frede (https://github.com/FredeAlexandre)
abstract contract ERC721Renderer {
    function render(uint256 id) public view virtual returns (string memory);
}
