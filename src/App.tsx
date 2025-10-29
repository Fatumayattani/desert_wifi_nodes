import { useState, useEffect } from 'react';
import { useWeb3V2 } from './contexts/Web3ContextV2';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import CommunityOwnership from './components/CommunityOwnership';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import ConnectionConfirmation from './components/ConnectionConfirmation';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { isConnected, connectWallet, disconnectWallet, account } = useWeb3V2();

  useEffect(() => {
    if (isConnected && account && !showDashboard) {
      setShowConfirmation(true);
    }
  }, [isConnected, account, showDashboard]);

  const handleConnectWallet = async () => {
    if (isConnected && account) {
      setShowDashboard(true);
    } else {
      try {
        await connectWallet();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

  const handleContinueToDashboard = () => {
    setShowConfirmation(false);
    setShowDashboard(true);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setShowDashboard(false);
    setShowConfirmation(false);
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
          <Hero
            onConnect={handleConnectWallet}
            isConnected={isConnected}
          />
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

      {showConfirmation && account && (
        <ConnectionConfirmation
          isOpen={showConfirmation}
          walletAddress={account}
          onContinue={handleContinueToDashboard}
        />
      )}
    </div>
  );
}

export default App;
