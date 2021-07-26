pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YoshiToken is ERC20{
    
    constructor() ERC20("YoshiToken", "YOSHI") {
        _mint(msg.sender, 100 * (10 ** 18));
    }

    function getTokens(uint amount) external {
        _mint(msg.sender, amount);
    }
}

