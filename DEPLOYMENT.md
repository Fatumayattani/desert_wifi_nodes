# Smart Contract Deployment Guide

This guide explains how to deploy the Desert WiFi Nodes smart contracts to the Scroll network and configure the frontend application.

## Contract Versions

We provide two versions of the smart contract:

### V1: Basic (DesertWifiNodes.sol)
- ETH-only payments
- Basic node registration and management
- Simple payment tracking
- Good for getting started quickly

### V2: Enhanced (DesertWifiNodesV2.sol) **RECOMMENDED**
- **Multi-Currency Support**: Accept payments in ETH, USDC, and USDT
- **Payment Splitting**: Automatic treasury fee distribution (default 10%)
- **Reputation System**: Track user and node reputation scores
- **Governance**: Community-driven decision making with proposals and voting
- **Enhanced Node Management**: Reputation-based node ratings
- **Treasury Management**: Secure treasury withdrawal system

## Prerequisites

Before deploying the smart contract, ensure you have:

1. Node.js 18+ installed
2. A Web3 wallet (MetaMask recommended) with:
   - ETH on Scroll Sepolia testnet (for testing) or Scroll mainnet
   - Get testnet ETH from [Scroll Sepolia Faucet](https://sepolia.scroll.io/faucet)
3. Basic familiarity with Solidity and blockchain deployment
4. For V2: USDC and USDT token addresses on your target network

## Contract Overview

### V1 Features

The `DesertWifiNodes.sol` smart contract includes:

- **Node Registration**: Node operators can register their WiFi nodes
- **Payment Processing**: Users can pay for WiFi access time in ETH
- **Earnings Management**: Node operators can withdraw earnings
- **Network Statistics**: Real-time tracking of nodes, users, and transaction volume
- **Node Management**: Activate/deactivate nodes and update pricing

### V2 Features (Enhanced)

The `DesertWifiNodesV2.sol` smart contract includes everything from V1 plus:

- **Stablecoin Support**: Accept USDC and USDT payments
- **Payment Splitting**: Automatic treasury fee (10% default, governance adjustable)
- **Reputation System**:
  - Users earn reputation by using network and rating nodes
  - Nodes earn reputation through positive ratings
  - Reputation unlocks governance participation
- **Governance System**:
  - Create proposals (treasury fee updates, node removal, etc.)
  - Vote on proposals with reputation-based access
  - Execute approved proposals
- **Enhanced Node Data**: Track upvotes, downvotes, connections, and reputation
- **Node Ratings**: Users can rate nodes to improve network quality

## Deployment Options

### Option 1: Using Remix IDE (Recommended for Beginners)

1. **Open Remix IDE**
   - Visit [https://remix.ethereum.org](https://remix.ethereum.org)

2. **Create the Contract File**
   - Create a new file: `contracts/DesertWifiNodes.sol`
   - Copy the contract code from `contracts/DesertWifiNodes.sol` in this repository

3. **Compile the Contract**
   - Select Solidity compiler version: `0.8.20+`
   - Click "Compile DesertWifiNodes.sol"
   - Ensure there are no errors

4. **Connect to Scroll Network**
   - In MetaMask, add Scroll Sepolia network:
     - Network Name: `Scroll Sepolia Testnet`
     - RPC URL: `https://sepolia-rpc.scroll.io`
     - Chain ID: `534351`
     - Currency Symbol: `ETH`
     - Block Explorer: `https://sepolia.scrollscan.com/`

5. **Deploy the Contract**
   - In Remix, go to "Deploy & Run Transactions"
   - Environment: Select "Injected Provider - MetaMask"
   - Ensure MetaMask is connected to Scroll Sepolia
   - Click "Deploy"
   - Confirm the transaction in MetaMask
   - Wait for deployment confirmation

6. **Copy the Contract Address**
   - After deployment, copy the contract address from Remix
   - You'll need this for the frontend configuration

### Option 2: Using Hardhat (For Advanced Users)

1. **Install Hardhat**
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   npx hardhat init
   ```

2. **Configure Hardhat**
   Create `hardhat.config.js`:
   ```javascript
   require("@nomicfoundation/hardhat-toolbox");
   require("dotenv").config();

   module.exports = {
     solidity: "0.8.20",
     networks: {
       scrollSepolia: {
         url: "https://sepolia-rpc.scroll.io",
         accounts: [process.env.PRIVATE_KEY],
         chainId: 534351,
       },
       scrollMainnet: {
         url: "https://rpc.scroll.io",
         accounts: [process.env.PRIVATE_KEY],
         chainId: 534352,
       },
     },
   };
   ```

3. **Create Deployment Script**
   Create `scripts/deploy.js`:
   ```javascript
   const hre = require("hardhat");

   async function main() {
     const DesertWifiNodes = await hre.ethers.getContractFactory("DesertWifiNodes");
     const contract = await DesertWifiNodes.deploy();
     await contract.waitForDeployment();

     const address = await contract.getAddress();
     console.log("DesertWifiNodes deployed to:", address);
   }

   main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });
   ```

4. **Deploy**
   ```bash
   npx hardhat run scripts/deploy.js --network scrollSepolia
   ```

### Option 3: Using Foundry

1. **Install Foundry**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Initialize Foundry Project**
   ```bash
   forge init
   ```

3. **Deploy**
   ```bash
   forge create --rpc-url https://sepolia-rpc.scroll.io \
     --private-key <YOUR_PRIVATE_KEY> \
     contracts/DesertWifiNodes.sol:DesertWifiNodes
   ```

## Frontend Configuration

After deploying the contract, configure the frontend application:

1. **Create Environment File**
   Create or update `.env` in the project root:
   ```env
   VITE_CONTRACT_ADDRESS=0xYourContractAddressHere
   ```

2. **Update Configuration (Optional)**
   The contract address is automatically loaded from the environment variable in `src/contracts/desertWifiNodesConfig.ts`

3. **Verify Network Configuration**
   Ensure the app is configured for the correct network:
   - Testnet: Scroll Sepolia (Chain ID: 534351)
   - Mainnet: Scroll (Chain ID: 534352)

## Testing the Deployment

1. **Start the Application**
   ```bash
   npm run dev
   ```

2. **Connect Wallet**
   - Open the app in your browser
   - Click "Connect Wallet"
   - Ensure MetaMask is on the Scroll network
   - Approve the connection

3. **Test Node Registration (Optional)**
   Open browser console and run:
   ```javascript
   // This requires contract interaction setup
   const tx = await contract.registerNode("Test Location", "1000000000000000"); // 0.001 ETH per hour
   await tx.wait();
   ```

4. **Test Payment**
   - Click "Add Funds" in the dashboard
   - Enter a valid node ID (e.g., 1)
   - Choose duration
   - Enter payment amount
   - Confirm transaction in MetaMask

## Contract Verification (Optional)

To verify your contract on Scrollscan:

1. **Using Hardhat**
   ```bash
   npx hardhat verify --network scrollSepolia <CONTRACT_ADDRESS>
   ```

2. **Manual Verification**
   - Visit [Scrollscan](https://sepolia.scrollscan.com/)
   - Navigate to your contract address
   - Click "Verify and Publish"
   - Fill in the verification form with contract details

## Security Considerations

1. **Private Keys**
   - NEVER commit private keys to version control
   - Use environment variables for sensitive data
   - Consider using a hardware wallet for mainnet deployments

2. **Testing**
   - Always test thoroughly on Scroll Sepolia testnet first
   - Test all contract functions before mainnet deployment
   - Consider a security audit for production use

3. **Access Control**
   - Review and understand all contract functions
   - Ensure proper access control is in place
   - Test emergency scenarios

## Troubleshooting

### Contract Deployment Fails
- Ensure you have enough ETH for gas fees
- Check that you're connected to the correct network
- Verify contract code compiles without errors

### Transactions Fail
- Check gas settings in MetaMask
- Ensure contract address is correct in `.env`
- Verify you're on the correct network

### Frontend Doesn't Connect
- Clear browser cache and reload
- Check console for error messages
- Verify MetaMask is unlocked and on correct network
- Ensure contract address is correctly set

## Mainnet Deployment Checklist

Before deploying to Scroll mainnet:

- [ ] Contract thoroughly tested on testnet
- [ ] Security audit completed (recommended)
- [ ] Frontend tested with testnet contract
- [ ] Sufficient ETH for deployment and initial operations
- [ ] Team aware of deployment time and plan
- [ ] Monitoring and alerts configured
- [ ] Emergency procedures documented
- [ ] Contract verification plan ready

## Support Resources

- [Scroll Documentation](https://docs.scroll.io/)
- [Scroll Discord](https://discord.gg/scroll)
- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)
- [Solidity Documentation](https://docs.soliditylang.org/)

## Contract Functions Reference

### User Functions
- `makePayment(nodeId, duration)` - Pay for WiFi access
- `getUserPayments(address)` - Get payment history
- `getNetworkStats()` - Get network statistics

### Node Operator Functions
- `registerNode(location, pricePerHour)` - Register a new node
- `withdrawEarnings(nodeId)` - Withdraw node earnings
- `deactivateNode(nodeId)` - Temporarily disable a node
- `reactivateNode(nodeId)` - Re-enable a node
- `updateNodePrice(nodeId, newPrice)` - Update node pricing

### View Functions
- `getNode(nodeId)` - Get node details
- `getUserNodes(address)` - Get user's owned nodes
- `getNodePayments(nodeId)` - Get node payment history
- `getNodeEarnings(nodeId)` - Get pending earnings
- `calculateUptime(nodeId)` - Calculate node uptime

## License

This contract is released under the MIT License.

## Deploying V2 Contract (Enhanced Version)

### V2 Constructor Parameters

The V2 contract requires three parameters at deployment:

1. **Treasury Address**: The wallet address that will receive the treasury fees
2. **USDC Token Address**: The address of the USDC token contract on your network
3. **USDT Token Address**: The address of the USDT token contract on your network

#### Token Addresses on Scroll Networks

**Scroll Mainnet:**
- USDC: Check [Scroll Token List](https://scroll.io/bridge) for official addresses
- USDT: Check [Scroll Token List](https://scroll.io/bridge) for official addresses

**Scroll Sepolia Testnet:**
- For testing, you can deploy mock ERC20 tokens or use testnet versions if available
- See the "Deploying Test Tokens" section below

### Deploying with Remix IDE (V2)

1. Open Remix and create `DesertWifiNodesV2.sol`
2. Compile with Solidity 0.8.20+
3. Before deployment, prepare:
   - Your treasury wallet address
   - USDC token address on target network
   - USDT token address on target network
4. In the Deploy tab, enter constructor parameters:
   ```
   _treasury: 0xYourTreasuryAddress
   _usdcToken: 0xUSDCTokenAddress
   _usdtToken: 0xUSDTTokenAddress
   ```
5. Deploy and save the contract address

### Deploying Test ERC20 Tokens (For Testing)

If you need test USDC/USDT tokens for Scroll Sepolia, deploy simple ERC20 contracts:

```solidity
// SimpleUSDC.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleUSDC {
    string public name = "Test USDC";
    string public symbol = "USDC";
    uint8 public decimals = 6;
    uint256 public totalSupply = 1000000 * 10**6;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }
    
    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }
}
```

Deploy this contract twice (once for USDC, once for USDT, changing the name/symbol).

## Frontend Configuration

### For V1 Contract

1. Update `.env`:
```env
VITE_CONTRACT_ADDRESS=0xYourDeployedV1Address
```

2. The app will use `Web3Context` and connect to V1 features

### For V2 Contract (Recommended)

1. Update `.env`:
```env
VITE_CONTRACT_V2_ADDRESS=0xYourDeployedV2Address
VITE_USDC_ADDRESS=0xUSDCTokenAddress
VITE_USDT_ADDRESS=0xUSDTTokenAddress
```

2. Update `src/main.tsx` to use V2 provider:
```typescript
import { Web3ProviderV2 } from './contexts/Web3ContextV2';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3ProviderV2>
      <App />
    </Web3ProviderV2>
  </StrictMode>
);
```

3. Update components to import from V2:
```typescript
import { useWeb3V2 } from '../contexts/Web3ContextV2';
```

## V2-Specific Features

### Governance Participation

Users can participate in governance when they:
1. Have reputation score ≥ 100 (default, adjustable via governance)
2. Are added as governance members by the contract owner

To earn reputation:
- Use the network (make payments): +1 per payment
- Rate nodes: +2 per rating
- Receive positive ratings (node owners): +10 per upvote
- Initial network use: +10 first-time bonus

### Treasury Fee Management

The treasury fee:
- Starts at 10% of all payments
- Can be adjusted through governance proposals (max 50%)
- Is automatically deducted from payments
- Node owners receive 90% (default), treasury receives 10%

### Creating Proposals

Governance members can create proposals to:
1. Update treasury fee percentage (0-50%)
2. Remove malicious or inactive nodes
3. Update minimum reputation for governance
4. Trigger treasury withdrawals

### Payment Flow with Stablecoins

1. User selects USDC or USDT in payment modal
2. First transaction: Approve token spending
3. Second transaction: Complete payment
4. Contract automatically splits payment (90% to node, 10% to treasury)

## Testing the V2 Contract

1. **Get Test Tokens**
   - If using test contracts, mint tokens to your wallet
   - Use the `mint()` function on your test ERC20 contracts

2. **Register a Node**
   - Call `registerNode()` with both ETH and USD prices
   - Node starts with 50 reputation

3. **Make Payments**
   - Test ETH payment via `makePaymentETH()`
   - Test USDC payment: approve then `makePaymentStablecoin()`
   - Verify automatic fee splitting

4. **Test Reputation**
   - Make payments to earn reputation
   - Rate nodes with `rateNode()`
   - Check reputation with `getUserReputation()`

5. **Test Governance**
   - Reach 100+ reputation or get added as member
   - Create a proposal with `createProposal()`
   - Vote using `voteOnProposal()`
   - Execute with `executeProposal()`

## Security Considerations for V2

1. **Treasury Address**: Ensure treasury address is a multisig or secure address
2. **Token Addresses**: Verify USDC/USDT addresses are correct for your network
3. **Governance**: Monitor governance proposals carefully
4. **Fee Limits**: Treasury fee is capped at 50% by contract
5. **Reputation System**: Reputation can influence governance, monitor for abuse

## V2 Contract Functions Reference

### User Functions
- `makePaymentETH(nodeId, duration)` - Pay with ETH
- `makePaymentStablecoin(nodeId, duration, amount, paymentType)` - Pay with USDC/USDT
- `rateNode(nodeId, isPositive)` - Rate a node (upvote/downvote)
- `getUserReputation(address)` - Check reputation score
- `canParticipateInGovernance(address)` - Check governance eligibility

### Node Operator Functions
- `registerNode(location, pricePerHourETH, pricePerHourUSD)` - Register node
- `updateNodePrice(nodeId, newPriceETH, newPriceUSD)` - Update pricing
- `withdrawEarnings(nodeId)` - Withdraw all earnings (ETH + stablecoins)
- `deactivateNode(nodeId)` / `reactivateNode(nodeId)` - Manage node status

### Governance Functions
- `createProposal(description, type, targetNodeId, newValue)` - Create proposal
- `voteOnProposal(proposalId, support)` - Vote on proposal
- `executeProposal(proposalId)` - Execute approved proposal
- `getProposalDetails(proposalId)` - Get proposal information

### Admin Functions (Contract Owner)
- `addGovernanceMember(address)` - Add governance member
- `updateTreasury(address)` - Change treasury address
- `withdrawTreasury()` - Withdraw treasury fees

### View Functions
- `getNetworkStats()` - Get network statistics (includes all currencies)
- `getNode(nodeId)` - Get node details with reputation data
- `getUserNodes(address)` - Get nodes owned by address
- `getUserPayments(address)` - Get payment history
- `treasuryFeePercent()` - Current treasury fee percentage
- `minReputationForGovernance()` - Minimum reputation needed

## Mainnet Deployment Checklist (V2)

Before deploying to Scroll mainnet:

- [ ] V2 contract thoroughly tested on Scroll Sepolia
- [ ] Correct USDC and USDT addresses verified
- [ ] Treasury address is secure (preferably multisig)
- [ ] Treasury fee percentage appropriate (10% recommended)
- [ ] Security audit completed (highly recommended)
- [ ] Frontend fully tested with V2 contract
- [ ] Governance process documented for community
- [ ] Initial governance members identified
- [ ] Emergency procedures documented
- [ ] Monitoring and alerts configured

