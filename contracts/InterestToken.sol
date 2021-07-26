pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InterestToken is ERC20, Ownable{
    
    constructor() ERC20("InterestToken", "INTEREST") {
    }

    function getTokens(address receiver, uint amount) external onlyOwner {
        _mint(receiver, amount);
    }

    function slash(address account, uint amount) external onlyOwner {
        _burn(account, amount);
    }
}