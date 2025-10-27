# Smart Contract Deployment Guide

This guide explains how to deploy the Desert WiFi Nodes smart contract to the Scroll network and configure the frontend application.

## Prerequisites

Before deploying the smart contract, ensure you have:

1. Node.js 18+ installed
2. A Web3 wallet (MetaMask recommended) with:
   - ETH on Scroll Sepolia testnet (for testing) or Scroll mainnet
   - Get testnet ETH from [Scroll Sepolia Faucet](https://sepolia.scroll.io/faucet)
3. Basic familiarity with Solidity and blockchain deployment

## Contract Overview

The `DesertWifiNodes.sol` smart contract includes:

- **Node Registration**: Node operators can register their WiFi nodes
- **Payment Processing**: Users can pay for WiFi access time
- **Earnings Management**: Node operators can withdraw earnings
- **Network Statistics**: Real-time tracking of nodes, users, and transaction volume
- **Node Management**: Activate/deactivate nodes and update pricing

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
