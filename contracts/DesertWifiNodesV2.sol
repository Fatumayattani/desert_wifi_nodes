// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract DesertWifiNodesV2 {
    address public owner;
    address public treasury;
    uint256 public treasuryFeePercent = 10;

    IERC20 public usdcToken;
    IERC20 public usdtToken;

    enum PaymentType { ETH, USDC, USDT }

    struct Node {
        address owner;
        string location;
        uint256 pricePerHourETH;
        uint256 pricePerHourUSD;
        uint256 totalEarningsETH;
        uint256 totalEarningsUSDC;
        uint256 totalEarningsUSDT;
        bool isActive;
        uint256 registeredAt;
        uint256 reputationScore;
        uint256 totalConnections;
        uint256 upvotes;
        uint256 downvotes;
    }

    struct Payment {
        address user;
        uint256 nodeId;
        uint256 amount;
        uint256 duration;
        uint256 timestamp;
        PaymentType paymentType;
    }

    struct GovernanceProposal {
        uint256 id;
        address proposer;
        string description;
        uint256 targetNodeId;
        ProposalType proposalType;
        uint256 newValue;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 createdAt;
        uint256 expiresAt;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    enum ProposalType {
        UPDATE_TREASURY_FEE,
        REMOVE_NODE,
        UPDATE_MIN_REPUTATION,
        TREASURY_WITHDRAWAL
    }

    mapping(uint256 => Node) public nodes;
    mapping(address => uint256[]) public userNodes;
    mapping(address => Payment[]) public userPayments;
    mapping(uint256 => Payment[]) public nodePayments;
    mapping(uint256 => GovernanceProposal) public proposals;
    mapping(address => uint256) public userReputationScore;
    mapping(address => bool) public isGovernanceMember;

    uint256 public nextNodeId = 1;
    uint256 public nextProposalId = 1;
    uint256 public totalNodes;
    uint256 public activeNodes;
    uint256 public totalVolumeETH;
    uint256 public totalVolumeUSDC;
    uint256 public totalVolumeUSDT;
    uint256 public totalUsers;
    uint256 public minReputationForGovernance = 100;

    mapping(address => bool) private hasUsedNetwork;

    event NodeRegistered(uint256 indexed nodeId, address indexed owner, string location);
    event NodeDeactivated(uint256 indexed nodeId);
    event NodeReactivated(uint256 indexed nodeId);
    event PaymentMade(address indexed user, uint256 indexed nodeId, uint256 amount, uint256 duration, PaymentType paymentType);
    event FundsWithdrawn(uint256 indexed nodeId, address indexed owner, uint256 amountETH, uint256 amountUSDC, uint256 amountUSDT);
    event TreasuryWithdrawn(address indexed treasury, uint256 amountETH, uint256 amountUSDC, uint256 amountUSDT);
    event NodeRated(uint256 indexed nodeId, address indexed user, bool isPositive);
    event ReputationUpdated(address indexed user, uint256 newScore);
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, ProposalType proposalType);
    event ProposalVoted(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId);
    event GovernanceMemberAdded(address indexed member);
    event TreasuryFeeUpdated(uint256 newFee);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier onlyGovernance() {
        require(isGovernanceMember[msg.sender] || userReputationScore[msg.sender] >= minReputationForGovernance, "Not governance member");
        _;
    }

    constructor(address _treasury, address _usdcToken, address _usdtToken) {
        owner = msg.sender;
        treasury = _treasury;
        usdcToken = IERC20(_usdcToken);
        usdtToken = IERC20(_usdtToken);
        isGovernanceMember[msg.sender] = true;
    }

    function registerNode(
        string memory _location,
        uint256 _pricePerHourETH,
        uint256 _pricePerHourUSD
    ) external returns (uint256) {
        require(_pricePerHourETH > 0 || _pricePerHourUSD > 0, "Price must be greater than 0");
        require(bytes(_location).length > 0, "Location cannot be empty");

        uint256 nodeId = nextNodeId++;

        nodes[nodeId] = Node({
            owner: msg.sender,
            location: _location,
            pricePerHourETH: _pricePerHourETH,
            pricePerHourUSD: _pricePerHourUSD,
            totalEarningsETH: 0,
            totalEarningsUSDC: 0,
            totalEarningsUSDT: 0,
            isActive: true,
            registeredAt: block.timestamp,
            reputationScore: 50,
            totalConnections: 0,
            upvotes: 0,
            downvotes: 0
        });

        userNodes[msg.sender].push(nodeId);
        totalNodes++;
        activeNodes++;

        emit NodeRegistered(nodeId, msg.sender, _location);

        return nodeId;
    }

    function makePaymentETH(uint256 _nodeId, uint256 _duration) external payable {
        require(_nodeId > 0 && _nodeId < nextNodeId, "Invalid node ID");
        require(nodes[_nodeId].isActive, "Node is not active");
        require(_duration > 0, "Duration must be greater than 0");
        require(nodes[_nodeId].pricePerHourETH > 0, "Node doesn't accept ETH");

        uint256 requiredAmount = (nodes[_nodeId].pricePerHourETH * _duration) / 3600;
        require(msg.value >= requiredAmount, "Insufficient payment");

        _processPayment(_nodeId, msg.value, _duration, PaymentType.ETH);

        uint256 treasuryAmount = (msg.value * treasuryFeePercent) / 100;
        uint256 nodeOwnerAmount = msg.value - treasuryAmount;

        nodes[_nodeId].totalEarningsETH += nodeOwnerAmount;
        totalVolumeETH += msg.value;
    }

    function makePaymentStablecoin(
        uint256 _nodeId,
        uint256 _duration,
        uint256 _amount,
        PaymentType _paymentType
    ) external {
        require(_nodeId > 0 && _nodeId < nextNodeId, "Invalid node ID");
        require(nodes[_nodeId].isActive, "Node is not active");
        require(_duration > 0, "Duration must be greater than 0");
        require(nodes[_nodeId].pricePerHourUSD > 0, "Node doesn't accept stablecoins");
        require(_paymentType == PaymentType.USDC || _paymentType == PaymentType.USDT, "Invalid payment type");

        uint256 requiredAmount = (nodes[_nodeId].pricePerHourUSD * _duration) / 3600;
        require(_amount >= requiredAmount, "Insufficient payment");

        IERC20 token = _paymentType == PaymentType.USDC ? usdcToken : usdtToken;
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        _processPayment(_nodeId, _amount, _duration, _paymentType);

        uint256 treasuryAmount = (_amount * treasuryFeePercent) / 100;
        uint256 nodeOwnerAmount = _amount - treasuryAmount;

        if (_paymentType == PaymentType.USDC) {
            nodes[_nodeId].totalEarningsUSDC += nodeOwnerAmount;
            totalVolumeUSDC += _amount;
        } else {
            nodes[_nodeId].totalEarningsUSDT += nodeOwnerAmount;
            totalVolumeUSDT += _amount;
        }
    }

    function _processPayment(uint256 _nodeId, uint256 _amount, uint256 _duration, PaymentType _paymentType) private {
        if (!hasUsedNetwork[msg.sender]) {
            hasUsedNetwork[msg.sender] = true;
            totalUsers++;
            userReputationScore[msg.sender] = 10;
        }

        Payment memory payment = Payment({
            user: msg.sender,
            nodeId: _nodeId,
            amount: _amount,
            duration: _duration,
            timestamp: block.timestamp,
            paymentType: _paymentType
        });

        userPayments[msg.sender].push(payment);
        nodePayments[_nodeId].push(payment);

        nodes[_nodeId].totalConnections++;
        userReputationScore[msg.sender] += 1;

        emit PaymentMade(msg.sender, _nodeId, _amount, _duration, _paymentType);
        emit ReputationUpdated(msg.sender, userReputationScore[msg.sender]);
    }

    function rateNode(uint256 _nodeId, bool _isPositive) external {
        require(_nodeId > 0 && _nodeId < nextNodeId, "Invalid node ID");
        require(hasUsedNetwork[msg.sender], "Must use network first");

        if (_isPositive) {
            nodes[_nodeId].upvotes++;
            nodes[_nodeId].reputationScore += 5;
        } else {
            nodes[_nodeId].downvotes++;
            if (nodes[_nodeId].reputationScore >= 5) {
                nodes[_nodeId].reputationScore -= 5;
            }
        }

        userReputationScore[msg.sender] += 2;

        address nodeOwner = nodes[_nodeId].owner;
        if (_isPositive) {
            userReputationScore[nodeOwner] += 10;
        } else if (userReputationScore[nodeOwner] >= 5) {
            userReputationScore[nodeOwner] -= 5;
        }

        emit NodeRated(_nodeId, msg.sender, _isPositive);
        emit ReputationUpdated(msg.sender, userReputationScore[msg.sender]);
        emit ReputationUpdated(nodeOwner, userReputationScore[nodeOwner]);
    }

    function withdrawEarnings(uint256 _nodeId) external {
        require(nodes[_nodeId].owner == msg.sender, "Not node owner");

        uint256 ethAmount = nodes[_nodeId].totalEarningsETH;
        uint256 usdcAmount = nodes[_nodeId].totalEarningsUSDC;
        uint256 usdtAmount = nodes[_nodeId].totalEarningsUSDT;

        require(ethAmount > 0 || usdcAmount > 0 || usdtAmount > 0, "No earnings to withdraw");

        nodes[_nodeId].totalEarningsETH = 0;
        nodes[_nodeId].totalEarningsUSDC = 0;
        nodes[_nodeId].totalEarningsUSDT = 0;

        if (ethAmount > 0) {
            (bool success, ) = payable(msg.sender).call{value: ethAmount}("");
            require(success, "ETH transfer failed");
        }

        if (usdcAmount > 0) {
            require(usdcToken.transfer(msg.sender, usdcAmount), "USDC transfer failed");
        }

        if (usdtAmount > 0) {
            require(usdtToken.transfer(msg.sender, usdtAmount), "USDT transfer failed");
        }

        emit FundsWithdrawn(_nodeId, msg.sender, ethAmount, usdcAmount, usdtAmount);
    }

    function withdrawTreasury() external onlyOwner {
        uint256 treasuryETH = (totalVolumeETH * treasuryFeePercent) / 100;
        uint256 treasuryUSDC = (totalVolumeUSDC * treasuryFeePercent) / 100;
        uint256 treasuryUSDT = (totalVolumeUSDT * treasuryFeePercent) / 100;

        uint256 ethBalance = address(this).balance;
        uint256 usdcBalance = usdcToken.balanceOf(address(this));
        uint256 usdtBalance = usdtToken.balanceOf(address(this));

        uint256 withdrawETH = treasuryETH > ethBalance ? ethBalance : treasuryETH;
        uint256 withdrawUSDC = treasuryUSDC > usdcBalance ? usdcBalance : treasuryUSDC;
        uint256 withdrawUSDT = treasuryUSDT > usdtBalance ? usdtBalance : treasuryUSDT;

        if (withdrawETH > 0) {
            (bool success, ) = payable(treasury).call{value: withdrawETH}("");
            require(success, "ETH transfer failed");
        }

        if (withdrawUSDC > 0) {
            require(usdcToken.transfer(treasury, withdrawUSDC), "USDC transfer failed");
        }

        if (withdrawUSDT > 0) {
            require(usdtToken.transfer(treasury, withdrawUSDT), "USDT transfer failed");
        }

        emit TreasuryWithdrawn(treasury, withdrawETH, withdrawUSDC, withdrawUSDT);
    }

    function createProposal(
        string memory _description,
        ProposalType _proposalType,
        uint256 _targetNodeId,
        uint256 _newValue
    ) external onlyGovernance returns (uint256) {
        uint256 proposalId = nextProposalId++;

        GovernanceProposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.description = _description;
        proposal.targetNodeId = _targetNodeId;
        proposal.proposalType = _proposalType;
        proposal.newValue = _newValue;
        proposal.votesFor = 0;
        proposal.votesAgainst = 0;
        proposal.createdAt = block.timestamp;
        proposal.expiresAt = block.timestamp + 7 days;
        proposal.executed = false;

        emit ProposalCreated(proposalId, msg.sender, _proposalType);

        return proposalId;
    }

    function voteOnProposal(uint256 _proposalId, bool _support) external onlyGovernance {
        GovernanceProposal storage proposal = proposals[_proposalId];

        require(!proposal.executed, "Proposal already executed");
        require(block.timestamp < proposal.expiresAt, "Proposal expired");
        require(!proposal.hasVoted[msg.sender], "Already voted");

        proposal.hasVoted[msg.sender] = true;

        if (_support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }

        emit ProposalVoted(_proposalId, msg.sender, _support);
    }

    function executeProposal(uint256 _proposalId) external onlyGovernance {
        GovernanceProposal storage proposal = proposals[_proposalId];

        require(!proposal.executed, "Proposal already executed");
        require(block.timestamp < proposal.expiresAt, "Proposal expired");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal not approved");

        proposal.executed = true;

        if (proposal.proposalType == ProposalType.UPDATE_TREASURY_FEE) {
            require(proposal.newValue <= 50, "Fee too high");
            treasuryFeePercent = proposal.newValue;
            emit TreasuryFeeUpdated(proposal.newValue);
        } else if (proposal.proposalType == ProposalType.REMOVE_NODE) {
            nodes[proposal.targetNodeId].isActive = false;
            activeNodes--;
            emit NodeDeactivated(proposal.targetNodeId);
        } else if (proposal.proposalType == ProposalType.UPDATE_MIN_REPUTATION) {
            minReputationForGovernance = proposal.newValue;
        }

        emit ProposalExecuted(_proposalId);
    }

    function addGovernanceMember(address _member) external onlyOwner {
        isGovernanceMember[_member] = true;
        emit GovernanceMemberAdded(_member);
    }

    function updateTreasury(address _newTreasury) external onlyOwner {
        treasury = _newTreasury;
    }

    function deactivateNode(uint256 _nodeId) external {
        require(nodes[_nodeId].owner == msg.sender, "Not node owner");
        require(nodes[_nodeId].isActive, "Node already inactive");

        nodes[_nodeId].isActive = false;
        activeNodes--;

        emit NodeDeactivated(_nodeId);
    }

    function reactivateNode(uint256 _nodeId) external {
        require(nodes[_nodeId].owner == msg.sender, "Not node owner");
        require(!nodes[_nodeId].isActive, "Node already active");

        nodes[_nodeId].isActive = true;
        activeNodes++;

        emit NodeReactivated(_nodeId);
    }

    function updateNodePrice(uint256 _nodeId, uint256 _newPriceETH, uint256 _newPriceUSD) external {
        require(nodes[_nodeId].owner == msg.sender, "Not node owner");
        require(_newPriceETH > 0 || _newPriceUSD > 0, "Price must be greater than 0");

        nodes[_nodeId].pricePerHourETH = _newPriceETH;
        nodes[_nodeId].pricePerHourUSD = _newPriceUSD;
    }

    function getNode(uint256 _nodeId) external view returns (Node memory) {
        require(_nodeId > 0 && _nodeId < nextNodeId, "Invalid node ID");
        return nodes[_nodeId];
    }

    function getUserNodes(address _user) external view returns (uint256[] memory) {
        return userNodes[_user];
    }

    function getUserPayments(address _user) external view returns (Payment[] memory) {
        return userPayments[_user];
    }

    function getNodePayments(uint256 _nodeId) external view returns (Payment[] memory) {
        return nodePayments[_nodeId];
    }

    function getNetworkStats() external view returns (
        uint256 _totalNodes,
        uint256 _activeNodes,
        uint256 _totalVolumeETH,
        uint256 _totalVolumeUSDC,
        uint256 _totalVolumeUSDT,
        uint256 _totalUsers
    ) {
        return (totalNodes, activeNodes, totalVolumeETH, totalVolumeUSDC, totalVolumeUSDT, totalUsers);
    }

    function getProposalDetails(uint256 _proposalId) external view returns (
        address proposer,
        string memory description,
        uint256 targetNodeId,
        ProposalType proposalType,
        uint256 newValue,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 createdAt,
        uint256 expiresAt,
        bool executed
    ) {
        GovernanceProposal storage proposal = proposals[_proposalId];
        return (
            proposal.proposer,
            proposal.description,
            proposal.targetNodeId,
            proposal.proposalType,
            proposal.newValue,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.createdAt,
            proposal.expiresAt,
            proposal.executed
        );
    }

    function getUserReputation(address _user) external view returns (uint256) {
        return userReputationScore[_user];
    }

    function canParticipateInGovernance(address _user) external view returns (bool) {
        return isGovernanceMember[_user] || userReputationScore[_user] >= minReputationForGovernance;
    }
}
