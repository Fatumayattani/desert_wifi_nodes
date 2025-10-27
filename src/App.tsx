import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import CommunityOwnership from './components/CommunityOwnership';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleConnectWallet = async () => {
    const ethereum = (window as any).ethereum;

    if (!ethereum) {
      alert('Please install MetaMask to connect to Desert WiFi Nodes');
      return;
    }

    let provider = ethereum;

    if (ethereum.providers?.length) {
      provider = ethereum.providers.find((p: any) => p.isMetaMask);
      if (!provider) {
        alert('MetaMask is not installed. Please install MetaMask to connect to Desert WiFi Nodes');
        return;
      }
    } else if (!ethereum.isMetaMask) {
      alert('MetaMask is not detected. Please install MetaMask or ensure it is enabled in your browser');
      return;
    }

    try {
      await provider.request({ method: 'eth_requestAccounts' });
      setIsWalletConnected(true);
      setShowDashboard(true);
    } catch (error) {
      console.error('User rejected connection');
    }
  };

  const handleDisconnect = () => {
    setIsWalletConnected(false);
    setShowDashboard(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {!showDashboard && (
        <Navbar
          onConnect={handleConnectWallet}
          isConnected={isWalletConnected}
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
          isConnected={isWalletConnected}
        />
      )}
    </div>
  );
}

export default App;
