pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PikachuToken is ERC20{
    
    constructor() ERC20("PikachuToken", "PIKACHU") {
        _mint(msg.sender, 100 * (10 ** 18));
    }

    function getTokens(uint amount) external {
        _mint(msg.sender, amount);
    }
}