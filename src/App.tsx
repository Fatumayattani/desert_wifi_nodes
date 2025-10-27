import { useState } from 'react';
import { useWeb3 } from './contexts/Web3Context';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import CommunityOwnership from './components/CommunityOwnership';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const { isConnected, connectWallet, disconnectWallet } = useWeb3();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setShowDashboard(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setShowDashboard(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {!showDashboard && (
        <Navbar
          onConnect={handleConnectWallet}
          isConnected={isConnected}
        />
      )}
      {!showDashboard ? (
        <>
          <Hero />
          <HowItWorks />
          <CommunityOwnership />
          <Footer />
        </>
      ) : (
        <Dashboard
          onDisconnect={handleDisconnect}
          isConnected={isConnected}
        />
      )}
    </div>
  );
}

export default App;
