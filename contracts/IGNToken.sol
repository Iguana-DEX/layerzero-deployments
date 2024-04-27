// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract IGNToken is OFT, ERC20Permit {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint, // LayerZero Endpoint address
        address _owner // token owner
    ) OFT(_name, _symbol, _lzEndpoint, _owner) Ownable() ERC20Permit(_name) {
        // check if the chain is etherlinkTestnet
        if (block.chainid == 128123) {
            _mint(msg.sender, 1_000_000_000 ether); // mints 1bn tokens to the deployer
        }
    }
}
