# Deslink

A decentralized, community-owned WiFi network platform powered by solar energy and Scroll blockchain payments. This project aims to bridge the digital gap by providing affordable, reliable internet access to underserved communities.

![Deslink](public/desertw.png)

## Overview

Deslink is a web application that enables communities to establish and manage their own solar-powered WiFi mesh networks. Users can browse available WiFi nodes in a centralized hub, make payments via cryptocurrency on the Scroll network, and track their usage through an intuitive dashboard. All payments are routed to a central node (#1) for simplified network management.

## Features

### V2 Features (Current)
- **Enhanced Smart Contract (V2)**: Multi-payment support with ETH, USDC, and USDT
- **Supabase Integration**: Real-time node database with filtering and search
- **Advanced Node Browser**: Search, filter, and sort WiFi nodes by price, reputation, and location
- **Multiple Payment Methods**: Support for ETH, USDC, and USDT payments
- **Reputation System**: Community-driven node ratings with upvote/downvote functionality
- **Governance System**: Token-weighted voting for network decisions
- **Node Statistics**: Detailed metrics including connections, earnings, and uptime
- **Connection Confirmation**: Smooth user experience with connection modals
- **Centralized Payment Hub**: All payments route to Node #1 for streamlined management

### Core Features
- **Smart Contract Integration**: Fully functional Solidity smart contract on Scroll network
- **Wallet Integration**: Connect via MetaMask or other Web3 wallets
- **Real Payments**: Make actual blockchain payments for WiFi access
- **Node Registration**: Register and manage WiFi nodes on-chain
- **User Dashboard**: Real-time network metrics and payment history from blockchain
- **Payment Tracking**: View on-chain transaction history and node usage
- **Earnings Withdrawal**: Node operators can withdraw earnings from smart contract
- **Community Focus**: Built for community ownership and sustainability
- **Solar-Powered**: 100% renewable energy network infrastructure
- **Secure & Private**: Decentralized mesh network with encrypted connections

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Blockchain**: Scroll Sepolia Testnet (L2 Ethereum)
- **Smart Contract**: Solidity 0.8.20+
- **Web3 Library**: Ethers.js v6
- **Wallet**: MetaMask / Web3 Compatible

## Project Architecture

### Application Structure

```
deslink/
├── contracts/
│   ├── DesertWifiNodes.sol          # V1 smart contract
│   └── DesertWifiNodesV2.sol        # V2 smart contract (current)
├── src/
│   ├── components/
│   │   ├── Navbar.tsx               # Navigation with wallet connect
│   │   ├── Hero.tsx                 # Landing page hero section
│   │   ├── HowItWorks.tsx           # 3-step process explanation
│   │   ├── CommunityOwnership.tsx   # Feature showcase
│   │   ├── Dashboard.tsx            # User dashboard with node browser
│   │   ├── NodeBrowser.tsx          # Browse and filter WiFi nodes
│   │   ├── PaymentModal.tsx         # ETH payment interface
│   │   ├── PaymentModalV2.tsx       # Multi-currency payment interface
│   │   ├── RegisterNodeModal.tsx    # Node registration interface
│   │   ├── GovernancePanel.tsx      # Community governance voting
│   │   ├── ConnectionConfirmation.tsx # Wallet connection modal
│   │   ├── WifiConnectedModal.tsx   # Payment success confirmation
│   │   ├── WalletAddressDisplay.tsx # Wallet address component
│   │   └── Footer.tsx               # Site footer
│   ├── contexts/
│   │   ├── Web3Context.tsx          # V1 Web3 provider
│   │   └── Web3ContextV2.tsx        # V2 Web3 provider (current)
│   ├── contracts/
│   │   ├── desertWifiNodesConfig.ts # V1 contract ABI
│   │   └── desertWifiNodesV2Config.ts # V2 contract ABI (current)
│   ├── services/
│   │   └── nodeService.ts           # Supabase node queries
│   ├── lib/
│   │   └── supabase.ts              # Supabase client configuration
│   ├── App.tsx                      # Main app component & routing
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles & Tailwind
├── supabase/
│   └── migrations/
│       └── 20251029065105_create_wifi_nodes_table.sql
├── public/                          # Static assets
├── DEPLOYMENT.md                    # Smart contract deployment guide
├── V2_FEATURES.md                   # V2 feature documentation
└── dist/                            # Production build
```

### Component Architecture

```
App (Root) - wrapped in Web3ProviderV2
├── State Management
│   ├── showDashboard (boolean)
│   ├── showConfirmation (boolean)
│   └── isWalletConnected (from context)
│
├── Landing Page View
│   ├── Navbar (wallet connection)
│   ├── Hero
│   ├── HowItWorks
│   ├── CommunityOwnership
│   └── Footer
│
├── Connection Confirmation Modal
│   └── Shows wallet address & auto-navigates to dashboard
│
└── Dashboard View (Authenticated)
    ├── Header (with disconnect & wallet display)
    ├── Tab Navigation (Nodes / History)
    ├── Node Browser Tab
    │   ├── Search & Filter Controls
    │   ├── Sort Options
    │   └── Node Cards (with connect button)
    ├── Payment History Tab
    │   └── Transaction History Table
    ├── Payment Modal (V2)
    │   ├── ETH Payment Option
    │   ├── USDC Payment Option
    │   └── USDT Payment Option
    └── Footer
```

## User Flow

### Connection & Browsing Flow

```
Landing Page → Connect Wallet → MetaMask Authorization
                                        ↓
                              Connection Confirmation
                                        ↓
                                    Dashboard
                                        ↓
                            Browse Available Nodes
                                        ↓
                          Filter by Price/Reputation
                                        ↓
                            Select Node to Connect
                                        ↓
                              Payment Modal Opens
                                        ↓
                    Choose Payment Method (ETH/USDC/USDT)
                                        ↓
                              Confirm Transaction
                                        ↓
                           Payment Routes to Node #1
                                        ↓
                            Success Modal Displays
                                        ↓
                              Connected to WiFi!
```

### Centralized Payment System

**Important**: All payments in the application are routed to Node #1 on the blockchain, regardless of which node is visually selected in the UI. This creates a centralized payment hub while maintaining the user experience of browsing multiple nodes.

- Users browse and select from multiple nodes with different prices and reputations
- Node information (location, pricing, reputation) is displayed for user decision-making
- When payment is made, the smart contract always receives nodeId = 1
- Node #1 accumulates all earnings from the network
- This approach simplifies network management and fund distribution

## Database Schema (Supabase)

### wifi_nodes Table

```sql
CREATE TABLE wifi_nodes (
  id BIGSERIAL PRIMARY KEY,
  node_id INTEGER UNIQUE NOT NULL,
  owner_address TEXT NOT NULL,
  location TEXT NOT NULL,
  price_per_hour_eth DECIMAL(18,8) NOT NULL,
  price_per_hour_usd DECIMAL(10,2) NOT NULL,
  total_earnings_eth DECIMAL(18,8) DEFAULT 0,
  total_earnings_usdc DECIMAL(18,6) DEFAULT 0,
  total_earnings_usdt DECIMAL(18,6) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  registered_at TIMESTAMPTZ DEFAULT now(),
  reputation_score INTEGER DEFAULT 50,
  total_connections INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

Row Level Security (RLS) is enabled on all tables with appropriate policies for authenticated users.

## Payment Flow (Scroll Network)

```
┌──────────────┐
│   User       │
│   Browses    │
│   Nodes      │
└──────┬───────┘
       │ 1. Select Node (Any Node)
       ▼
┌──────────────────┐
│  Payment Modal   │
│  ETH/USDC/USDT   │
└──────┬───────────┘
       │ 2. Choose Payment Method
       ▼
┌──────────────────────────────────┐
│   Scroll Network (L2)            │
│                                  │
│  ┌────────────────────────────┐ │
│  │  Smart Contract V2         │ │
│  │  nodeId = 1 (hardcoded)    │ │
│  │  - Multi-currency support  │ │
│  │  - Payment processing      │ │
│  │  - Reputation tracking     │ │
│  └────────────────────────────┘ │
└──────────────────────────────────┘
       │ 3. Transaction Confirmed
       ▼
┌──────────────────┐
│   Success Modal  │
│   WiFi Connected │
└──────────────────┘
       │ 4. Update Dashboard
       ▼
┌──────────────────┐
│  Payment History │
│  Updated Stats   │
└──────────────────┘
```

## Smart Contract V2 Functions

### For Users
- `makePaymentETH(nodeId, duration)` - Pay with ETH (routes to Node #1)
- `makePaymentStablecoin(nodeId, duration, amount, paymentType)` - Pay with USDC/USDT (routes to Node #1)
- `rateNode(nodeId, isPositive)` - Rate a node's service quality
- `getUserPayments(address)` - View your payment history
- `getUserReputation(address)` - Check your reputation score

### For Node Operators
- `registerNode(location, pricePerHourETH, pricePerHourUSD)` - Register a new WiFi node
- `updateNodePrice(nodeId, newPriceETH, newPriceUSD)` - Update hourly pricing
- `withdrawEarnings(nodeId)` - Withdraw accumulated earnings (ETH/USDC/USDT)
- `deactivateNode(nodeId)` / `reactivateNode(nodeId)` - Manage node status

### Governance Functions
- `createProposal(description, proposalType, targetNodeId, newValue)` - Create governance proposal
- `voteOnProposal(proposalId, support)` - Vote on active proposals
- `executeProposal(proposalId)` - Execute approved proposals
- `canParticipateInGovernance(address)` - Check governance eligibility

### View Functions
- `getNode(nodeId)` - Get detailed node information
- `getUserNodes(address)` - List nodes owned by an address
- `getNodePayments(nodeId)` - View payments received by a node
- `getNetworkStats()` - Get network-wide statistics
- `getProposalDetails(proposalId)` - Get proposal information

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask browser extension
- ETH on Scroll Sepolia testnet ([Get testnet ETH](https://sepolia.scroll.io/faucet))
- Supabase account (free tier available)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd deslink
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the migration in `supabase/migrations/`
   - Copy your Supabase URL and anon key

4. Configure environment variables:
```bash
# Create .env file
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Deploy the Smart Contract:
   - Follow instructions in [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Deploy `contracts/DesertWifiNodesV2.sol` to Scroll Sepolia
   - Update contract address in `src/contracts/desertWifiNodesV2Config.ts`

6. Ensure Node #1 exists:
   - Register at least one node with nodeId = 1 on the blockchain
   - All payments will be routed to this node

7. Start the development server:
```bash
npm run dev
```

8. Open browser at `http://localhost:5173`

9. Connect MetaMask:
   - Switch to Scroll Sepolia network
   - Click "Connect Wallet"
   - Approve the connection

### Build for Production

```bash
npm run build
```

Production files will be in the `dist/` directory.

### Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Payment Methods

### ETH Payments
- Native Scroll network currency
- Single-step transaction
- Instant confirmation
- Gas fees included

### USDC/USDT Payments
- Stablecoin payments for price stability
- Two-step process:
  1. Approve token spending
  2. Complete payment transaction
- USD-denominated pricing
- Lower volatility

## Node Search & Filtering

Users can find the perfect node using:

### Search
- Search by location name
- Real-time search updates

### Filters
- **Active Only**: Show only operational nodes
- **Minimum Reputation**: Filter by quality score (50+, 70+, 85+)

### Sorting Options
- Highest Reputation
- Lowest/Highest Price (ETH)
- Lowest/Highest Price (USD)
- Most Popular (by connections)
- Newest First

## Reputation System

### For Users
- Earn reputation by using the network
- Rate nodes after connecting
- Higher reputation enables governance participation

### For Node Operators
- Start with 50 reputation
- Gain +10 for positive ratings
- Lose -5 for negative ratings
- Reputation affects node visibility and trust

## Governance

### Proposal Types
- **Update Treasury Fee**: Adjust network fee percentage
- **Remove Node**: Remove problematic nodes from network
- **Update Min Reputation**: Change governance participation threshold
- **Treasury Withdrawal**: Approve fund withdrawals

### Voting Process
1. Eligible members create proposals
2. Community votes (reputation-weighted)
3. 7-day voting period
4. Approved proposals are executed
5. Results recorded on-chain

### Eligibility
- Reputation score ≥ 100, OR
- Manual governance member designation

## Security

- **Web3 Security**: Standard Web3 provider integration
- **No Private Keys**: Never stored or transmitted
- **Row Level Security**: Enabled on all Supabase tables
- **Smart Contract Audited**: OpenZeppelin contracts used
- **HTTPS Required**: For production deployments
- **Centralized Payments**: All funds route to secure Node #1

## Network Architecture

### Centralized Payment Hub Model

```
        ☀️ Solar Panels
           │
      ┌────┴────────────────────────┐
      │     Node #1 (Payment Hub)   │
      │  ┌──────────────────────┐   │
      │  │ Receives All Payments│   │
      │  │ Manages Distribution │   │
      │  └──────────────────────┘   │
      └────┬────────────────────────┘
           │
     ┌─────┼──────────┐
     │     │          │
┌────▼──┐ ┌▼────┐ ┌──▼────┐
│Node 2 │ │Node 3│ │Node 4 │
│Display│ │Display│ │Display│
└───────┘ └──────┘ └───────┘
    │        │         │
    └────────┼─────────┘
             │
        ┌────▼────┐
        │  Users  │
        │  Browse │
        │  & Pay  │
        └─────────┘
```

Users browse multiple nodes but all payments consolidate to Node #1 for simplified network management and fund distribution.

## Future Enhancements

### Technical Improvements
- Multi-network support (Polygon, Arbitrum, Optimism)
- Advanced analytics dashboard with charts
- Mobile app (React Native)
- Geographic node mapping
- Real-time bandwidth monitoring
- Automatic node discovery

### Feature Additions
- Subscription-based payment plans
- Referral rewards program
- NFT-based node ownership
- Social features (chat, forums)
- Multi-language support
- Advanced governance mechanisms

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check [V2_FEATURES.md](./V2_FEATURES.md) for feature details
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help

## Acknowledgments

- Built with React and Vite
- Powered by Scroll Network for affordable L2 transactions
- Supabase for real-time database
- Ethers.js for Web3 integration
- OpenZeppelin for secure smart contracts
- Inspired by community-driven connectivity initiatives
- Solar energy advocacy for sustainable technology

---

**Built with ❤️ for underserved communities worldwide**
