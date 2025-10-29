# Deslink

A decentralized, community-owned WiFi network platform powered by solar energy and Scroll blockchain payments. This project aims to bridge the digital gap by providing affordable, reliable internet access to underserved communities.


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
git clone https://github.com/Fatumayattani/deslink.git
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
VITE_CONTRACT_ADDRESS=0xxxxxx
VITE_NETWORK_CHAIN_ID=534351
VITE_NETWORK_NAME=Scroll Sepolia
VITE_USDC_ADDRESS=0xxxxxxx
VITE_USDT_ADDRESS=0xxxx
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
- Web3 Developer Clubs
- Supabase for real-time database
- Ethers.js for Web3 integration
- OpenZeppelin for secure smart contracts
- Inspired by community-driven connectivity initiatives

---

**Built with ❤️ for underserved communities worldwide**
