# Desert WiFi Nodes

A decentralized, community-owned WiFi network platform powered by solar energy and Scroll blockchain payments. This project aims to bridge the digital gap by providing affordable, reliable internet access to underserved communities.

![Desert WiFi Nodes](public/desertw.png)

## Overview

Desert WiFi Nodes is a web application that enables communities to establish and manage their own solar-powered WiFi mesh networks. Users can connect to local nodes, make affordable payments via cryptocurrency on the Scroll network, and track their usage through an intuitive dashboard.

## Features

- **Wallet Integration**: Connect via MetaMask or other Web3 wallets
- **User Dashboard**: Real-time network metrics and payment history
- **Payment Tracking**: View transaction history and node usage
- **Community Focus**: Built for community ownership and sustainability
- **Solar-Powered**: 100% renewable energy network infrastructure
- **Secure & Private**: Decentralized mesh network with encrypted connections

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Blockchain**: Scroll Network (L2 Ethereum)
- **Wallet**: MetaMask / Web3 Compatible
- **Backend (Ready)**: Supabase (PostgreSQL database)

## Project Architecture

### Application Structure

```
desert-wifi-nodes/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Navigation with wallet connect
│   │   ├── Hero.tsx             # Landing page hero section
│   │   ├── HowItWorks.tsx       # 3-step process explanation
│   │   ├── CommunityOwnership.tsx # Feature showcase
│   │   ├── Dashboard.tsx        # User dashboard (authenticated)
│   │   └── Footer.tsx           # Site footer
│   ├── App.tsx                  # Main app component & routing
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles & Tailwind
├── public/                      # Static assets
└── dist/                        # Production build
```

### Component Architecture

```
App (Root)
├── State Management
│   ├── showDashboard (boolean)
│   └── isWalletConnected (boolean)
│
├── Landing Page View
│   ├── Navbar
│   ├── Hero
│   ├── HowItWorks
│   ├── CommunityOwnership
│   └── Footer
│
└── Dashboard View (Authenticated)
    ├── Header (with disconnect)
    ├── Stats Cards
    ├── Payment History Table
    └── Footer
```

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Landing Page                            │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │   Hero     │  │ How It     │  │  Community           │  │
│  │  Section   │  │  Works     │  │  Ownership           │  │
│  └────────────┘  └────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Click "Connect Wallet"
                            ▼
                  ┌──────────────────┐
                  │  MetaMask Popup  │
                  │  Authorization   │
                  └──────────────────┘
                            │
                ┌───────────┴────────────┐
                │                        │
         User Approves            User Rejects
                │                        │
                ▼                        ▼
    ┌──────────────────────┐    Stay on Landing Page
    │   User Dashboard     │
    │                      │
    │  ┌────────────────┐ │
    │  │ Network Stats  │ │
    │  ├────────────────┤ │
    │  │ Payment        │ │
    │  │ History        │ │
    │  ├────────────────┤ │
    │  │ Add Funds CTA  │ │
    │  └────────────────┘ │
    └──────────────────────┘
                │
                │ Click "Disconnect"
                ▼
         Return to Landing Page
```

## Payment Flow (Scroll Network)

```
┌──────────────┐
│   User       │
│   Wallet     │
└──────┬───────┘
       │ 1. Connect Wallet
       ▼
┌──────────────────┐
│  MetaMask/Web3   │
│   Provider       │
└──────┬───────────┘
       │ 2. Request Access
       ▼
┌──────────────────────────────────┐
│   Scroll Network (L2)            │
│                                  │
│  ┌────────────────────────────┐ │
│  │  Smart Contract (Future)   │ │
│  │  - Payment Processing      │ │
│  │  - Node Registration       │ │
│  │  - Usage Tracking          │ │
│  └────────────────────────────┘ │
└──────────────────────────────────┘
       │ 3. Transaction Confirmed
       ▼
┌──────────────────┐
│   Dashboard      │
│   - Update Stats │
│   - Show History │
└──────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│                                                              │
│  ┌──────────────┐         ┌──────────────────────────────┐ │
│  │   App.tsx    │────────▶│  Component State             │ │
│  │              │         │  - isWalletConnected         │ │
│  │              │         │  - showDashboard             │ │
│  └──────┬───────┘         └──────────────────────────────┘ │
│         │                                                    │
│         │                                                    │
│  ┌──────┴───────────────────────────────────────────────┐  │
│  │              Component Layer                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  │
│  │  │ Navbar   │  │   Hero   │  │   Dashboard      │   │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Web3 Provider
                            ▼
                  ┌──────────────────┐
                  │   MetaMask API   │
                  └──────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  Scroll Network  │
                  │  (Blockchain)    │
                  └──────────────────┘
                            │
                            │ (Future Integration)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Supabase Backend (Ready)                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                 │  │
│  │  - users table                                       │  │
│  │  - nodes table                                       │  │
│  │  - transactions table                                │  │
│  │  - network_stats table                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Row Level Security (RLS)                            │  │
│  │  - User data isolation                               │  │
│  │  - Secure API access                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask browser extension (for wallet functionality)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd desert-wifi-nodes
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# .env file (already configured with Supabase)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Features in Detail

### 1. Wallet Connection
Users connect their Web3 wallet (MetaMask) to access the platform. The connection state is managed at the application level and determines which view is shown.

### 2. Dashboard
After connecting, users see:
- **Active Nodes**: Number of operational WiFi nodes
- **Connected Users**: Total users on the network
- **Total Volume**: Transaction volume in ETH
- **Network Uptime**: Network reliability metrics

### 3. Payment History
Displays user's transaction history including:
- Transaction date
- Node ID
- Payment amount (in ETH)
- Transaction status

### 4. Landing Page
Educates visitors about:
- How the system works (3-step process)
- Community ownership model
- Solar-powered infrastructure
- Security and privacy features

## Future Enhancements

### Smart Contract Integration
- Deploy payment processing contract on Scroll
- Automated node registration and verification
- Staking mechanism for node operators
- Governance token for community decisions

### Database Integration (Supabase Ready)
- User profile management
- Real-time network statistics
- Historical transaction data
- Node operator dashboard

### Additional Features
- Mobile app (React Native)
- Node operator portal
- Advanced analytics dashboard
- Multi-language support
- Geographic node mapping
- Bandwidth monitoring
- Referral system

## Network Architecture

### Mesh Network Topology

```
        ☀️ Solar Panel
           │
      ┌────┴────┐
      │  Node A │◄──────┐
      └────┬────┘       │
           │            │
     ┌─────┼─────┐      │
     │     │     │      │
┌────▼──┐ ┌▼────┐ ┌────▼──┐
│Node B │ │Node C│ │Node D │
└───────┘ └──────┘ └───────┘
    │        │         │
    └────────┼─────────┘
             │
        ┌────▼────┐
        │  Users  │
        └─────────┘
```

Each node:
- Runs on solar power
- Connects to multiple other nodes (mesh)
- Serves local users
- Processes Scroll payments
- Reports stats to network

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Code Structure

The application follows a component-based architecture:

1. **App.tsx**: Main application logic and routing
2. **Components**: Reusable UI components
3. **Hooks**: Custom React hooks (future)
4. **Utils**: Helper functions and utilities (future)
5. **Types**: TypeScript type definitions (future)

### Styling

Tailwind CSS utility classes are used throughout for consistent styling:
- **Teal**: Primary color (network/tech theme)
- **Coral**: Secondary color (warmth/community)
- **Sunny Yellow**: Accent (solar energy)

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- All wallet connections use standard Web3 providers
- No private keys are stored or transmitted
- Row Level Security (RLS) enabled on database (when integrated)
- HTTPS required for production deployments

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

## Acknowledgments

- Built with React and Vite
- Powered by Scroll Network for affordable transactions
- Inspired by community-driven connectivity initiatives
- Solar energy advocacy for sustainable technology

---

**Built with ❤️ for underserved communities worldwide**
