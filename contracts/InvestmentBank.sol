pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InvestmentBank is Ownable {

    using SafeMath for uint;

    mapping(address => mapping(bytes32 => Deposit)) public deposits;

    mapping(bytes32 => Token) public tokenMapping;
    
    address public interestTokenAddress;

    modifier tokenExists(bytes32 ticker) {
        require(tokenMapping[ticker].tokenAddress != address(0));
        _;
    }

    struct Deposit {
        uint depositTime;
        uint depositValue;
    }

    struct Token {
        address tokenAddress;
        uint tokenInterest;
    }

    // Owner can add new tokens to the bank.
    function addToken(bytes32 ticker, address tokenAddress, uint tokenInterest) onlyOwner public {
        tokenMapping[ticker] = Token(tokenAddress, tokenInterest);
    }

    // Users can deposit tokens that have been added to the bank.
    function deposit(bytes32 ticker, uint amount) external tokenExists(ticker) {
        require(IERC20(tokenMapping[ticker].tokenAddress).balanceOf(msg.sender) >= amount);
        uint alreadyDeposited = deposits[msg.sender][ticker].depositValue;
        deposits[msg.sender][ticker] = Deposit(block.timestamp, alreadyDeposited.add(amount));
        IERC20(tokenMapping[ticker].tokenAddress).transferFrom(msg.sender, address(this), amount);
    }

    // Users can withdraw tokens and the interest is paid at the time of withdrawal.
    function withdraw(bytes32 ticker, uint amount) external tokenExists(ticker) {
        require(deposits[msg.sender][ticker].depositValue >= amount);
        uint interest = calculateInterest(ticker, amount);
        require(IERC20(interestTokenAddress).balanceOf(address(this)) >= interest);
        deposits[msg.sender][ticker].depositValue = deposits[msg.sender][ticker].depositValue.sub(amount);
        IERC20(tokenMapping[ticker].tokenAddress).transfer(msg.sender, amount);
        IERC20(interestTokenAddress).transfer(msg.sender, interest);
    }

    // Owner can change the address for interest token.
    function setInterestTokenAddress(address _address) external onlyOwner{
        interestTokenAddress = _address;
    }

    // This function calculates the amount of interest tokens paid at the time of withdrawal.
    function calculateInterest(bytes32 ticker, uint amount) internal view returns(uint) {
        uint depositTime = deposits[msg.sender][ticker].depositTime;
        uint currentTime = block.timestamp;
        uint interestTime = currentTime.sub(depositTime);
        return((tokenMapping[ticker].tokenInterest.mul(interestTime)).mul(amount));
    }

}