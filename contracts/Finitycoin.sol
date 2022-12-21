// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Finitycoin is ERC20, Ownable {
    uint256 private constant RATE_DENOMINATOR = 10**3;
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD; 

    uint256 public _burnFee = 30;
    uint256 public _taxFee = 30;

    address public taxAddress;
    mapping(address => bool) public _isExcludedFromTax;

    constructor(address _taxAddress) ERC20("Finitycoin", "FINITY") {
        _mint(msg.sender, 6000000000000000 * 10**18);
        taxAddress = _taxAddress;
        _isExcludedFromTax[msg.sender] = true;
        _isExcludedFromTax[address(this)] = true;
        _isExcludedFromTax[_taxAddress] = true;
    }

    function updateBurnFee(uint256 burnFee) external onlyOwner {
        _burnFee = burnFee;
    }

    function updateTaxFee(uint256 taxFee) external onlyOwner {
        _taxFee = taxFee;
    }

    function updateTaxAddress(address _taxAddress) external onlyOwner {
        taxAddress = _taxAddress;
    }

    function excludeFromTax(address _account) external onlyOwner {
        require(_account != address(0), "zero address not allowed");
        _isExcludedFromTax[_account] = true;
    }

    function _transfer(address from, address to, uint256 amount) internal virtual override {
        uint256 _transAmount = amount;
        if (!_isExcludedFromTax[from]) {
            uint256 burnFeeAmount = calcBurnFee(amount);
            uint256 taxFeeAmount = calcTaxFee(amount);

            _transAmount = amount - burnFeeAmount - taxFeeAmount;

            super._transfer(from, BURN_ADDRESS, burnFeeAmount);
            super._transfer(from, taxAddress, taxFeeAmount);
        }
        super._transfer(from, to, _transAmount);
    }

    function calcBurnFee(uint256 amount) private view returns (uint256) {
        return amount * _burnFee / RATE_DENOMINATOR;
    }

    function calcTaxFee(uint256 amount) private view returns (uint256) {
        return amount * _taxFee / RATE_DENOMINATOR;
    }
}