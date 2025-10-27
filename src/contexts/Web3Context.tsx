import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, Contract, parseEther } from 'ethers';
import { DESERT_WIFI_NODES_ABI, DESERT_WIFI_NODES_ADDRESS, SCROLL_SEPOLIA_CHAIN_ID } from '../contracts/desertWifiNodesConfig';

interface Payment {
  user: string;
  nodeId: bigint;
  amount: bigint;
  duration: bigint;
  timestamp: bigint;
}

interface NetworkStats {
  totalNodes: bigint;
  activeNodes: bigint;
  totalVolume: bigint;
  totalUsers: bigint;
}

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  provider: BrowserProvider | null;
  contract: Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToScrollNetwork: () => Promise<void>;
  makePayment: (nodeId: number, duration: number, amount: string) => Promise<void>;
  getUserPayments: () => Promise<Payment[]>;
  getNetworkStats: () => Promise<NetworkStats | null>;
  isLoading: boolean;
  error: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = account !== null;

  const switchToScrollNetwork = async () => {
    if (!window.ethereum) return;

    const chainIdHex = `0x${SCROLL_SEPOLIA_CHAIN_ID.toString(16)}`;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                chainName: 'Scroll Sepolia Testnet',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia-rpc.scroll.io'],
                blockExplorerUrls: ['https://sepolia.scrollscan.com/'],
              },
            ],
          });
        } catch (addError) {
          throw new Error('Failed to add Scroll network');
        }
      } else {
        throw switchError;
      }
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const browserProvider = new BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      await switchToScrollNetwork();

      const signer = await browserProvider.getSigner();
      const desertWifiContract = new Contract(
        DESERT_WIFI_NODES_ADDRESS,
        DESERT_WIFI_NODES_ABI,
        signer
      );

      setProvider(browserProvider);
      setContract(desertWifiContract);
      setAccount(accounts[0]);
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setContract(null);
    setError(null);
  };

  const makePayment = async (nodeId: number, duration: number, amount: string) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.makePayment(nodeId, duration, {
        value: parseEther(amount),
      });
      await tx.wait();
    } catch (err: any) {
      console.error('Error making payment:', err);
      setError(err.message || 'Failed to make payment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserPayments = async (): Promise<Payment[]> => {
    if (!contract || !account) {
      return [];
    }

    try {
      const payments = await contract.getUserPayments(account);
      return payments;
    } catch (err) {
      console.error('Error fetching user payments:', err);
      return [];
    }
  };

  const getNetworkStats = async (): Promise<NetworkStats | null> => {
    if (!contract) {
      return null;
    }

    try {
      const stats = await contract.getNetworkStats();
      return {
        totalNodes: stats[0],
        activeNodes: stats[1],
        totalVolume: stats[2],
        totalUsers: stats[3],
      };
    } catch (err) {
      console.error('Error fetching network stats:', err);
      return null;
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        provider,
        contract,
        connectWallet,
        disconnectWallet,
        switchToScrollNetwork,
        makePayment,
        getUserPayments,
        getNetworkStats,
        isLoading,
        error,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
