//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UbeGrants is Ownable {
    Grant[] public grants;

    // Events
    event GrantCreated(uint256 grantId, uint256[] milestoneAmounts, address creator, string ipfsHash);
    event GrantState(uint256 grantId, uint256 state);
    event GrantMilestone(uint256 grantId, uint256 milestoneId, uint256 amount, string ipfsHash, bool approved);

    // States
    // Pending - waiting for approval
    // Approved - approved by the community or DAO multiseg address
    // Rejected - rejected by the community or DAO multiseg address
    // Completed - completed by the grantee
    // Cancelled - Cancelled after getting accepeted by the community or DAO multiseg address
    enum State { Pending, Active, Rejected, Completed, Cancelled }

    struct Grant {
        uint256 id;
        string name;
        address grantee;
        string ipfsHash;
        State state;
        uint256 nextPayout;
        uint256[] milestoneAmounts;
        string[] milestoneDeliveries;
    }

    address public daoMultisig;

    constructor(address _daoMultisig) {
        daoMultisig = _daoMultisig;
        // Genisis grant
        grants.push(Grant(0, "", address(0), "", State.Pending, 0, new uint256[](0), new string[](0)));
    }


    function changeDaoAddress(address _newDaoMultisig) public onlyOwner {
        daoMultisig = _newDaoMultisig;
    }

    // Grantee will be able to apply for grants and add milestones
    function applyForGrant(string memory _name, string memory _ipfsHash, uint256[] memory milestoneAmounts) external {
        uint256 grantId = grants.length;
        Grant memory newGrant = Grant({
            id: grantId,
            name: _name,
            grantee: msg.sender,
            ipfsHash: _ipfsHash,
            state: State.Pending,
            nextPayout: 0,
            milestoneAmounts: milestoneAmounts,
            milestoneDeliveries: new string[](0)
        });

        require(newGrant.grantee != address(0), "Grant must have a grantee");
        require(newGrant.milestoneAmounts.length > 0, "Grant must have at least one milestone");

        grants.push(newGrant);
        emit GrantCreated(grantId, milestoneAmounts, msg.sender, _ipfsHash);
    }

    function approveOrRejectGrant(uint256 _grantId, bool approve) external {
        require(msg.sender == daoMultisig, "Only DAO multisig can approve grants");
        require(grants[_grantId].state == State.Pending, "Grant must be in pending state");
        Grant storage grant = grants[_grantId];
        if (approve) {
            grant.state = State.Active;
        } else {
            grant.state = State.Rejected;
        }

        // TODO: Work on taking escrow amount from DAO multisig

        emit GrantState(_grantId, uint256(grant.state));
    }

    function cancelGrant(uint256 _grantId) external {
        Grant storage grant = grants[_grantId];
        require(grant.grantee == msg.sender, "Only grantee can cancel grant");
        grant.state = State.Cancelled;

        // TODO: Send the remaining grant amount back to the DAO

        emit GrantState(_grantId, uint256(grant.state));
    }

    function applyForGrantMilestone(uint256 grantId, string memory ipfsHash) external {
        Grant storage grant = grants[grantId];
        require(grant.grantee == msg.sender, "Only grantee can complete milestones");
        require(grant.state == State.Active, "Grant must be active");
        require(grant.nextPayout < grant.milestoneAmounts.length, "All milestones have been completed");
        
        grant.milestoneDeliveries.push(ipfsHash);

        emit GrantState(grantId, uint256(grant.state));
    }

    function approveOrRejectMilestone(uint256 grantId, bool approve) external {
        require(msg.sender == daoMultisig, "Only DAO multisig can approve milestones");
        Grant storage grant = grants[grantId];
        require(grant.state == State.Active, "Grant must be active");
        require(grant.nextPayout < grant.milestoneAmounts.length, "All milestones have been completed");
        uint256 payout = grant.nextPayout;
        if (approve) {
            grant.nextPayout++;
        }

        // TODO: Send the milestone amount to the grantee

        emit GrantMilestone(grantId, payout, grant.milestoneAmounts[payout], grant.milestoneDeliveries[grant.milestoneDeliveries.length - 1], approve);
    }

    function getGrant(uint256 grantId) external view returns (Grant memory) {
        return grants[grantId];
    }

}
