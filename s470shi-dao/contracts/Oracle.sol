// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAggregator {
    function latestAnswer() external view returns (int256);
}

contract S47PriceOracle {
    address public s47Feed;
    address public ocosFeed;

    constructor(address _s47Feed, address _ocosFeed) {
        s47Feed = _s47Feed;
        ocosFeed = _ocosFeed;
    }

    function getS47Price() public view returns (int256) {
        return IAggregator(s47Feed).latestAnswer();
    }

    function getOCOSPrice() public view returns (int256) {
        return IAggregator(ocosFeed).latestAnswer();
    }
}
