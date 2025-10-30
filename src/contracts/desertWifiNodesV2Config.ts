export const DESERT_WIFI_NODES_V2_ADDRESS = import.meta.env.VITE_CONTRACT_V2_ADDRESS || '0x0000000000000000000000000000000000000000';

export const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS || '0x0000000000000000000000000000000000000000';
export const USDT_ADDRESS = import.meta.env.VITE_USDT_ADDRESS || '0x0000000000000000000000000000000000000000';

export const SCROLL_SEPOLIA_CHAIN_ID = 534351;
export const SCROLL_MAINNET_CHAIN_ID = 534352;

export const SCROLL_SEPOLIA_RPC = 'https://sepolia-rpc.scroll.io';
export const SCROLL_MAINNET_RPC = 'https://rpc.scroll.io';

export const CURRENT_CHAIN_ID = parseInt(import.meta.env.VITE_NETWORK_CHAIN_ID || '534352');
export const CURRENT_NETWORK_NAME = import.meta.env.VITE_NETWORK_NAME || 'Scroll Mainnet';
export const CURRENT_RPC_URL = CURRENT_CHAIN_ID === SCROLL_MAINNET_CHAIN_ID ? SCROLL_MAINNET_RPC : SCROLL_SEPOLIA_RPC;
export const CURRENT_BLOCK_EXPLORER = CURRENT_CHAIN_ID === SCROLL_MAINNET_CHAIN_ID ? 'https://scrollscan.com/' : 'https://sepolia.scrollscan.com/';

export enum PaymentType {
  ETH = 0,
  USDC = 1,
  USDT = 2
}

export enum ProposalType {
  UPDATE_TREASURY_FEE = 0,
  REMOVE_NODE = 1,
  UPDATE_MIN_REPUTATION = 2,
  TREASURY_WITHDRAWAL = 3
}

export const ERC20_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const DESERT_WIFI_NODES_V2_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_treasury", "type": "address" },
      { "internalType": "address", "name": "_usdcToken", "type": "address" },
      { "internalType": "address", "name": "_usdtToken", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "member", "type": "address" }
    ],
    "name": "GovernanceMemberAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "nodeId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "bool", "name": "isPositive", "type": "bool" }
    ],
    "name": "NodeRated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "proposalId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "proposer", "type": "address" },
      { "indexed": false, "internalType": "uint8", "name": "proposalType", "type": "uint8" }
    ],
    "name": "ProposalCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "proposalId", "type": "uint256" }
    ],
    "name": "ProposalExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "proposalId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "voter", "type": "address" },
      { "indexed": false, "internalType": "bool", "name": "support", "type": "bool" }
    ],
    "name": "ProposalVoted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "newScore", "type": "uint256" }
    ],
    "name": "ReputationUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "newFee", "type": "uint256" }
    ],
    "name": "TreasuryFeeUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "activeNodes",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_member", "type": "address" }],
    "name": "addGovernanceMember",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "canParticipateInGovernance",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "uint8", "name": "_proposalType", "type": "uint8" },
      { "internalType": "uint256", "name": "_targetNodeId", "type": "uint256" },
      { "internalType": "uint256", "name": "_newValue", "type": "uint256" }
    ],
    "name": "createProposal",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_nodeId", "type": "uint256" }],
    "name": "deactivateNode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_proposalId", "type": "uint256" }],
    "name": "executeProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNetworkStats",
    "outputs": [
      { "internalType": "uint256", "name": "_totalNodes", "type": "uint256" },
      { "internalType": "uint256", "name": "_activeNodes", "type": "uint256" },
      { "internalType": "uint256", "name": "_totalVolumeETH", "type": "uint256" },
      { "internalType": "uint256", "name": "_totalVolumeUSDC", "type": "uint256" },
      { "internalType": "uint256", "name": "_totalVolumeUSDT", "type": "uint256" },
      { "internalType": "uint256", "name": "_totalUsers", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_nodeId", "type": "uint256" }],
    "name": "getNode",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "string", "name": "location", "type": "string" },
          { "internalType": "uint256", "name": "pricePerHourETH", "type": "uint256" },
          { "internalType": "uint256", "name": "pricePerHourUSD", "type": "uint256" },
          { "internalType": "uint256", "name": "totalEarningsETH", "type": "uint256" },
          { "internalType": "uint256", "name": "totalEarningsUSDC", "type": "uint256" },
          { "internalType": "uint256", "name": "totalEarningsUSDT", "type": "uint256" },
          { "internalType": "bool", "name": "isActive", "type": "bool" },
          { "internalType": "uint256", "name": "registeredAt", "type": "uint256" },
          { "internalType": "uint256", "name": "reputationScore", "type": "uint256" },
          { "internalType": "uint256", "name": "totalConnections", "type": "uint256" },
          { "internalType": "uint256", "name": "upvotes", "type": "uint256" },
          { "internalType": "uint256", "name": "downvotes", "type": "uint256" }
        ],
        "internalType": "struct DesertWifiNodesV2.Node",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_nodeId", "type": "uint256" }],
    "name": "getNodePayments",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "user", "type": "address" },
          { "internalType": "uint256", "name": "nodeId", "type": "uint256" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "uint256", "name": "duration", "type": "uint256" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "uint8", "name": "paymentType", "type": "uint8" }
        ],
        "internalType": "struct DesertWifiNodesV2.Payment[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_proposalId", "type": "uint256" }],
    "name": "getProposalDetails",
    "outputs": [
      { "internalType": "address", "name": "proposer", "type": "address" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "uint256", "name": "targetNodeId", "type": "uint256" },
      { "internalType": "uint8", "name": "proposalType", "type": "uint8" },
      { "internalType": "uint256", "name": "newValue", "type": "uint256" },
      { "internalType": "uint256", "name": "votesFor", "type": "uint256" },
      { "internalType": "uint256", "name": "votesAgainst", "type": "uint256" },
      { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
      { "internalType": "uint256", "name": "expiresAt", "type": "uint256" },
      { "internalType": "bool", "name": "executed", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "getUserNodes",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "getUserPayments",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "user", "type": "address" },
          { "internalType": "uint256", "name": "nodeId", "type": "uint256" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "uint256", "name": "duration", "type": "uint256" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "uint8", "name": "paymentType", "type": "uint8" }
        ],
        "internalType": "struct DesertWifiNodesV2.Payment[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "getUserReputation",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_nodeId", "type": "uint256" },
      { "internalType": "uint256", "name": "_duration", "type": "uint256" }
    ],
    "name": "makePaymentETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_nodeId", "type": "uint256" },
      { "internalType": "uint256", "name": "_duration", "type": "uint256" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" },
      { "internalType": "uint8", "name": "_paymentType", "type": "uint8" }
    ],
    "name": "makePaymentStablecoin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "minReputationForGovernance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_nodeId", "type": "uint256" },
      { "internalType": "bool", "name": "_isPositive", "type": "bool" }
    ],
    "name": "rateNode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_nodeId", "type": "uint256" }],
    "name": "reactivateNode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_location", "type": "string" },
      { "internalType": "uint256", "name": "_pricePerHourETH", "type": "uint256" },
      { "internalType": "uint256", "name": "_pricePerHourUSD", "type": "uint256" }
    ],
    "name": "registerNode",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalNodes",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasuryFeePercent",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_nodeId", "type": "uint256" },
      { "internalType": "uint256", "name": "_newPriceETH", "type": "uint256" },
      { "internalType": "uint256", "name": "_newPriceUSD", "type": "uint256" }
    ],
    "name": "updateNodePrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_proposalId", "type": "uint256" },
      { "internalType": "bool", "name": "_support", "type": "bool" }
    ],
    "name": "voteOnProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_nodeId", "type": "uint256" }],
    "name": "withdrawEarnings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawTreasury",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
