import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, Contract, parseEther, parseUnits } from 'ethers';
import {
  DESERT_WIFI_NODES_V2_ABI,
  DESERT_WIFI_NODES_V2_ADDRESS,
  SCROLL_SEPOLIA_CHAIN_ID,
  PaymentType,
  ProposalType,
  ERC20_ABI,
  USDC_ADDRESS,
  USDT_ADDRESS
} from '../contracts/desertWifiNodesV2Config';

interface Payment {
  user: string;
  nodeId: bigint;
  amount: bigint;
  duration: bigint;
  timestamp: bigint;
  paymentType: number;
}

interface NetworkStats {
  totalNodes: bigint;
  activeNodes: bigint;
  totalVolumeETH: bigint;
  totalVolumeUSDC: bigint;
  totalVolumeUSDT: bigint;
  totalUsers: bigint;
}

interface NodeData {
  owner: string;
  location: string;
  pricePerHourETH: bigint;
  pricePerHourUSD: bigint;
  totalEarningsETH: bigint;
  totalEarningsUSDC: bigint;
  totalEarningsUSDT: bigint;
  isActive: boolean;
  registeredAt: bigint;
  reputationScore: bigint;
  totalConnections: bigint;
  upvotes: bigint;
  downvotes: bigint;
}

interface ProposalData {
  proposer: string;
  description: string;
  targetNodeId: bigint;
  proposalType: number;
  newValue: bigint;
  votesFor: bigint;
  votesAgainst: bigint;
  createdAt: bigint;
  expiresAt: bigint;
  executed: boolean;
}

interface Web3ContextV2Type {
  account: string | null;
  isConnected: boolean;
  provider: BrowserProvider | null;
  contract: Contract | null;
  usdcContract: Contract | null;
  usdtContract: Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToScrollNetwork: () => Promise<void>;
  makePaymentETH: (nodeId: number, duration: number, amount: string) => Promise<void>;
  makePaymentStablecoin: (nodeId: number, duration: number, amount: string, paymentType: PaymentType) => Promise<void>;
  approveStablecoin: (tokenAddress: string, amount: string) => Promise<void>;
  registerNode: (location: string, pricePerHourETH: string, pricePerHourUSD: string) => Promise<void>;
  getUserPayments: () => Promise<Payment[]>;
  getNetworkStats: () => Promise<NetworkStats | null>;
  getUserReputation: (address: string) => Promise<bigint>;
  rateNode: (nodeId: number, isPositive: boolean) => Promise<void>;
  canParticipateInGovernance: (address: string) => Promise<boolean>;
  createProposal: (description: string, proposalType: ProposalType, targetNodeId: number, newValue: number) => Promise<void>;
  voteOnProposal: (proposalId: number, support: boolean) => Promise<void>;
  executeProposal: (proposalId: number) => Promise<void>;
  getProposalDetails: (proposalId: number) => Promise<ProposalData | null>;
  getNode: (nodeId: number) => Promise<NodeData | null>;
  isLoading: boolean;
  error: string | null;
}

const Web3ContextV2 = createContext<Web3ContextV2Type | undefined>(undefined);

export function Web3ProviderV2({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [usdcContract, setUsdcContract] = useState<Contract | null>(null);
  const [usdtContract, setUsdtContract] = useState<Contract | null>(null);
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
        DESERT_WIFI_NODES_V2_ADDRESS,
        DESERT_WIFI_NODES_V2_ABI,
        signer
      );

      const usdc = new Contract(USDC_ADDRESS, ERC20_ABI, signer);
      const usdt = new Contract(USDT_ADDRESS, ERC20_ABI, signer);

      setProvider(browserProvider);
      setContract(desertWifiContract);
      setUsdcContract(usdc);
      setUsdtContract(usdt);
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
    setUsdcContract(null);
    setUsdtContract(null);
    setError(null);
  };

  const makePaymentETH = async (_nodeId: number, duration: number, amount: string) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.makePaymentETH(1, duration, {
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

  const approveStablecoin = async (tokenAddress: string, amount: string) => {
    if (!usdcContract || !usdtContract) {
      throw new Error('Token contracts not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tokenContract = tokenAddress === USDC_ADDRESS ? usdcContract : usdtContract;
      const tx = await tokenContract.approve(DESERT_WIFI_NODES_V2_ADDRESS, parseUnits(amount, 6));
      await tx.wait();
    } catch (err: any) {
      console.error('Error approving token:', err);
      setError(err.message || 'Failed to approve token');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const makePaymentStablecoin = async (
    _nodeId: number,
    duration: number,
    amount: string,
    paymentType: PaymentType
  ) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const amountInUnits = parseUnits(amount, 6);
      const tx = await contract.makePaymentStablecoin(1, duration, amountInUnits, paymentType);
      await tx.wait();
    } catch (err: any) {
      console.error('Error making stablecoin payment:', err);
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
        totalVolumeETH: stats[2],
        totalVolumeUSDC: stats[3],
        totalVolumeUSDT: stats[4],
        totalUsers: stats[5],
      };
    } catch (err) {
      console.error('Error fetching network stats:', err);
      return null;
    }
  };

  const getUserReputation = async (address: string): Promise<bigint> => {
    if (!contract) {
      return BigInt(0);
    }

    try {
      return await contract.getUserReputation(address);
    } catch (err) {
      console.error('Error fetching user reputation:', err);
      return BigInt(0);
    }
  };

  const rateNode = async (nodeId: number, isPositive: boolean) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.rateNode(nodeId, isPositive);
      await tx.wait();
    } catch (err: any) {
      console.error('Error rating node:', err);
      setError(err.message || 'Failed to rate node');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const canParticipateInGovernance = async (address: string): Promise<boolean> => {
    if (!contract) {
      return false;
    }

    try {
      return await contract.canParticipateInGovernance(address);
    } catch (err) {
      console.error('Error checking governance eligibility:', err);
      return false;
    }
  };

  const createProposal = async (
    description: string,
    proposalType: ProposalType,
    targetNodeId: number,
    newValue: number
  ) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.createProposal(description, proposalType, targetNodeId, newValue);
      await tx.wait();
    } catch (err: any) {
      console.error('Error creating proposal:', err);
      setError(err.message || 'Failed to create proposal');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const voteOnProposal = async (proposalId: number, support: boolean) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.voteOnProposal(proposalId, support);
      await tx.wait();
    } catch (err: any) {
      console.error('Error voting on proposal:', err);
      setError(err.message || 'Failed to vote');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const executeProposal = async (proposalId: number) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.executeProposal(proposalId);
      await tx.wait();
    } catch (err: any) {
      console.error('Error executing proposal:', err);
      setError(err.message || 'Failed to execute proposal');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getProposalDetails = async (proposalId: number): Promise<ProposalData | null> => {
    if (!contract) {
      return null;
    }

    try {
      const proposal = await contract.getProposalDetails(proposalId);
      return {
        proposer: proposal[0],
        description: proposal[1],
        targetNodeId: proposal[2],
        proposalType: proposal[3],
        newValue: proposal[4],
        votesFor: proposal[5],
        votesAgainst: proposal[6],
        createdAt: proposal[7],
        expiresAt: proposal[8],
        executed: proposal[9],
      };
    } catch (err) {
      console.error('Error fetching proposal details:', err);
      return null;
    }
  };

  const getNode = async (nodeId: number): Promise<NodeData | null> => {
    if (!contract) {
      return null;
    }

    try {
      return await contract.getNode(nodeId);
    } catch (err) {
      console.error('Error fetching node:', err);
      return null;
    }
  };

  const registerNode = async (location: string, pricePerHourETH: string, pricePerHourUSD: string) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const priceETHInWei = parseEther(pricePerHourETH);
      const priceUSDInUnits = parseUnits(pricePerHourUSD, 6);

      const tx = await contract.registerNode(location, priceETHInWei, priceUSDInUnits);
      await tx.wait();
    } catch (err: any) {
      console.error('Error registering node:', err);
      setError(err.message || 'Failed to register node');
      throw err;
    } finally {
      setIsLoading(false);
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
    <Web3ContextV2.Provider
      value={{
        account,
        isConnected,
        provider,
        contract,
        usdcContract,
        usdtContract,
        connectWallet,
        disconnectWallet,
        switchToScrollNetwork,
        makePaymentETH,
        makePaymentStablecoin,
        approveStablecoin,
        registerNode,
        getUserPayments,
        getNetworkStats,
        getUserReputation,
        rateNode,
        canParticipateInGovernance,
        createProposal,
        voteOnProposal,
        executeProposal,
        getProposalDetails,
        getNode,
        isLoading,
        error,
      }}
    >
      {children}
    </Web3ContextV2.Provider>
  );
}

export function useWeb3V2() {
  const context = useContext(Web3ContextV2);
  if (context === undefined) {
    throw new Error('useWeb3V2 must be used within a Web3ProviderV2');
  }
  return context;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
