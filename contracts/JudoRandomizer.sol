// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {VRFConsumerBaseV2Plus} from  "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from  "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract JudoRandomizer is VRFConsumerBaseV2Plus {
    // using VRFV2PlusClient for VRFV2PlusClient.RandomWordsRequest;
    // using VRFV2PlusClient for VRFV2PlusClient.ExtraArgsV1;

    uint256 immutable SUBSCRIPTION_ID;
    bytes32 constant KEY_HASH = 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
    uint32 constant CALLBACK_GAS_LIMIT = 100000;
    uint16 constant REQUEST_CONFIRMATIONS = 3;
    uint32 constant NUM_WORDS = 1;

    uint256[] public s_randomWords;
    uint256 public s_requestId;
    uint256 public s_maxRange;

    event RandomNumberGenerated(uint256 randomNumber);

    constructor(uint256 subscriptionId, address vrfCoordinator)
    VRFConsumerBaseV2Plus(vrfCoordinator) {
        SUBSCRIPTION_ID = subscriptionId;
    }

    function requestRandomWords(uint256 _maxRange) external onlyOwnerOrCoordinator {
        require(_maxRange > 0, "Max range must be greater than 0");
        s_maxRange = _maxRange;
        s_requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: KEY_HASH,
                subId: SUBSCRIPTION_ID,
                requestConfirmations: REQUEST_CONFIRMATIONS,
                callbackGasLimit: CALLBACK_GAS_LIMIT,
                numWords: NUM_WORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: true})
            )
        }));
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) internal override {
        require(requestId == s_requestId, "RequestId does not match");
        s_randomWords = randomWords;
        uint256 randomNumber = (randomWords[0] % s_maxRange) + 1;
        emit RandomNumberGenerated(randomNumber);
    }

    function getRandomNumber() public view returns (uint256) {
        require(s_randomWords.length > 0, "Random number not generated yet");
        return (s_randomWords[0] % s_maxRange) + 1;
    }
}