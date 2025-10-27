// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DesertWifiNodes {
    struct Node {
        address owner;
        string location;
        uint256 pricePerHour;
        uint256 totalEarnings;
        bool isActive;
        uint256 registeredAt;
    }

    struct Payment {
        address user;
        uint256 nodeId;
        uint256 amount;
        uint256 duration;
        uint256 timestamp;
    }

    mapping(uint256 => Node) public nodes;
    mapping(address => uint256[]) public userNodes;
    mapping(address => Payment[]) public userPayments;
    mapping(uint256 => Payment[]) public nodePayments;

    uint256 public nextNodeId = 1;
    uint256 public totalNodes;
    uint256 public activeNodes;
    uint256 public totalVolume;
    uint256 public totalUsers;
    mapping(address => bool) private hasUsedNetwork;

    event NodeRegistered(uint256 indexed nodeId, address indexed owner, string location, uint256 pricePerHour);
    event NodeDeactivated(uint256 indexed nodeId);
    event NodeReactivated(uint256 indexed nodeId);
    event PaymentMade(address indexed user, uint256 indexed nodeId, uint256 amount, uint256 duration);
    event FundsWithdrawn(uint256 indexed nodeId, address indexed owner, uint256 amount);

    function registerNode(string memory _location, uint256 _pricePerHour) external returns (uint256) {
        require(_pricePerHour > 0, "Price must be greater than 0");
        require(bytes(_location).length > 0, "Location cannot be empty");

        uint256 nodeId = nextNodeId++;

        nodes[nodeId] = Node({
            owner: msg.sender,
            location: _location,
            pricePerHour: _pricePerHour,
            totalEarnings: 0,
            isActive: true,
            registeredAt: block.timestamp
        });

        userNodes[msg.sender].push(nodeId);
        totalNodes++;
        activeNodes++;

        emit NodeRegistered(nodeId, msg.sender, _location, _pricePerHour);

        return nodeId;
    }

    function makePayment(uint256 _nodeId, uint256 _duration) external payable {
        require(_nodeId > 0 && _nodeId < nextNodeId, "Invalid node ID");
        require(nodes[_nodeId].isActive, "Node is not active");
        require(_duration > 0, "Duration must be greater than 0");

        uint256 requiredAmount = (nodes[_nodeId].pricePerHour * _duration) / 3600;
        require(msg.value >= requiredAmount, "Insufficient payment");

        if (!hasUsedNetwork[msg.sender]) {
            hasUsedNetwork[msg.sender] = true;
            totalUsers++;
        }

        Payment memory payment = Payment({
            user: msg.sender,
            nodeId: _nodeId,
            amount: msg.value,
            duration: _duration,
            timestamp: block.timestamp
        });

        userPayments[msg.sender].push(payment);
        nodePayments[_nodeId].push(payment);

        nodes[_nodeId].totalEarnings += msg.value;
        totalVolume += msg.value;

        emit PaymentMade(msg.sender, _nodeId, msg.value, _duration);
    }

    function withdrawEarnings(uint256 _nodeId) external {
        require(nodes[_nodeId].owner == msg.sender, "Not node owner");
        require(nodes[_nodeId].totalEarnings > 0, "No earnings to withdraw");

        uint256 amount = nodes[_nodeId].totalEarnings;
        nodes[_nodeId].totalEarnings = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(_nodeId, msg.sender, amount);
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

    function updateNodePrice(uint256 _nodeId, uint256 _newPrice) external {
        require(nodes[_nodeId].owner == msg.sender, "Not node owner");
        require(_newPrice > 0, "Price must be greater than 0");

        nodes[_nodeId].pricePerHour = _newPrice;
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
        uint256 _totalVolume,
        uint256 _totalUsers
    ) {
        return (totalNodes, activeNodes, totalVolume, totalUsers);
    }

    function getNodeEarnings(uint256 _nodeId) external view returns (uint256) {
        return nodes[_nodeId].totalEarnings;
    }

    function calculateUptime(uint256 _nodeId) external view returns (uint256) {
        require(_nodeId > 0 && _nodeId < nextNodeId, "Invalid node ID");
        if (!nodes[_nodeId].isActive) {
            return 0;
        }
        uint256 timeActive = block.timestamp - nodes[_nodeId].registeredAt;
        return (timeActive * 100) / (block.timestamp - nodes[_nodeId].registeredAt);
    }
}
