//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract UbeGrants is Ownable {
    using SafeERC20 for IERC20;

    Grant[] public grants;
    mapping(uint256 => MilestoneDelivery[]) public grantToMilestones;
    address public ubeTokenAddress;

    // Events
    event GrantCreated(uint256 grantId, uint256[] milestoneAmounts, address creator, string ipfsHash);
    event GrantStateChanged(uint256 grantId, uint256 state);
    event GrantMilestoneStatus(uint256 grantId, uint256 milestoneId, uint256 amount, string ipfsHash, bool approved);
    event GrantMilestoneApplied(uint256 grantId, uint256 milestoneId, string ipfsHash);

    // States
    // Pending - waiting for approval
    // Active - active by the community or DAO multiseg address
    // Rejected - rejected by the community or DAO multiseg address
    // Completed - completed by the grantee
    // Cancelled - Cancelled after getting accepeted by the community or DAO multiseg address
    enum State { Pending, Active, Rejected, Completed, Cancelled }

    enum MilestoneStatus { Pending, Approved, Rejected }

    struct MilestoneDelivery {
        string ipfsHash;
        uint256 amount;
        MilestoneStatus state;
    }

    struct Grant {
        uint256 id;
        address grantee;
        string ipfsHash;
        State state;
        uint256 nextPayout;
        uint256 totalAmount;
        uint256[] milestoneAmounts;
    }

    address public daoMultisig;

    constructor(address _daoMultisig, address _ubeTokenAddress) {
        daoMultisig = _daoMultisig;
        // Genisis grant
        grants.push(Grant(0, address(0), "", State.Pending, 0, 0, new uint256[](0)));
        ubeTokenAddress = _ubeTokenAddress;
    }


    function changeDaoAddress(address _newDaoMultisig) public onlyOwner {
        daoMultisig = _newDaoMultisig;
    }

    // Grantee will be able to apply for grants and add milestones
    // Form - 
    // 1. Name of the grant
    // 2. Description of the grant
    // 3. Milestones
    function applyForGrant(string memory _ipfsHash, uint256[] memory milestoneAmounts) external {
        uint256 grantId = grants.length;
        uint256 totalGrantAmount = 0;

        for (uint256 i = 0; i < milestoneAmounts.length; i++) {
            totalGrantAmount += milestoneAmounts[i];
        }

        Grant memory newGrant = Grant({
            id: grantId,
            grantee: msg.sender,
            ipfsHash: _ipfsHash,
            state: State.Pending,
            nextPayout: 0,
            totalAmount: totalGrantAmount,
            milestoneAmounts: milestoneAmounts
        });

        require(newGrant.grantee != address(0), "Grant must have a grantee");
        require(newGrant.milestoneAmounts.length > 0, "Grant must have at least one milestone");

        grants.push(newGrant);
        emit GrantCreated(grantId, milestoneAmounts, msg.sender, _ipfsHash);
    }

    function approveOrRejectGrant(uint256 _grantId, bool approve) external {
        require(msg.sender == daoMultisig, "Only DAO multisig can approve or reject grants");
        require(grants[_grantId].state == State.Pending, "Grant must be in pending state");
        Grant storage grant = grants[_grantId];

        if (approve) {
            grant.state = State.Active;
            // Send tokens from msg.sender to this contract
            IERC20(ubeTokenAddress).safeTransferFrom(msg.sender, address(this), grant.totalAmount);
        } else {
            grant.state = State.Rejected;
        }

        emit GrantStateChanged(_grantId, uint256(grant.state));
    }

    function cancelGrant(uint256 _grantId) external {
        Grant storage grant = grants[_grantId];
        require((daoMultisig == msg.sender || grant.grantee == msg.sender), "Only dao or grantee can cancel a grant");
        grant.state = State.Cancelled;

        uint256 amountToSend = grant.totalAmount;
        if (grant.nextPayout > 0) {
            for (uint256 i = 0; i < grant.nextPayout; i++) {
                amountToSend -= grant.milestoneAmounts[i];
            }
        }
        
        IERC20(ubeTokenAddress).safeTransfer(daoMultisig, amountToSend);


        emit GrantStateChanged(_grantId, uint256(grant.state));
    }

    function applyForGrantMilestone(uint256 grantId, string memory ipfsHash) external {
        Grant storage grant = grants[grantId];
        require(grant.grantee == msg.sender, "Only grantee can apply for complete milestones");
        require(grant.state == State.Active, "Grant must be active");
        require(grant.nextPayout < grant.milestoneAmounts.length, "All milestones have been completed");
        require(grant.nextPayout == grantToMilestones[grantId].length, "Already applied for this milestone");

        MilestoneDelivery memory milestone = MilestoneDelivery({
            ipfsHash: ipfsHash,
            amount: grant.milestoneAmounts[grant.nextPayout],
            state: MilestoneStatus.Pending
        });

        grantToMilestones[grantId].push(milestone);

        emit GrantMilestoneApplied(grantId, grant.nextPayout, ipfsHash);
    }

    function approveOrRejectMilestone(uint256 grantId, uint256 milestoneId, bool approve) external {
        require(msg.sender == daoMultisig, "Only DAO multisig can approve or reject milestones");
        Grant storage grant = grants[grantId];
        require(grant.state == State.Active, "Grant must be active");
        require(grant.nextPayout < grant.milestoneAmounts.length, "All milestones have been completed");
        require(milestoneId == grant.nextPayout, "Cant approve or reject a future milestone");
        
        uint256 payout = grant.nextPayout;
        
        if (approve) {
            IERC20(ubeTokenAddress).safeTransfer(grant.grantee, grant.milestoneAmounts[payout]);
            grant.nextPayout++;
            grantToMilestones[grantId][milestoneId].state = MilestoneStatus.Approved;
        } else {
            grantToMilestones[grantId][milestoneId].state = MilestoneStatus.Rejected;
        }

        if (grant.nextPayout == grant.milestoneAmounts.length) {
            grant.state = State.Completed;
        }

        emit GrantMilestoneStatus(grantId, milestoneId, grant.milestoneAmounts[payout], grantToMilestones[grantId][milestoneId].ipfsHash, approve);
    }

    function getGrant(uint256 grantId) external view returns (Grant memory) {
        return grants[grantId];
    }

}
