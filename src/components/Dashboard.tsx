import { useState, useEffect } from 'react';
import { Users, Wifi, ArrowLeft, Search, RefreshCw, SlidersHorizontal, MapPin, Star, TrendingDown as TrendingDownIcon, History, TrendingUp } from 'lucide-react';
import { formatEther } from 'ethers';
import { useWeb3V2 } from '../contexts/Web3ContextV2';
import Footer from './Footer';
import PaymentModal from './PaymentModal';
import WalletAddressDisplay from './WalletAddressDisplay';
import { WifiNode } from '../lib/supabase';
import { searchNodes, NodeFilters, SortOption } from '../services/nodeService';

interface DashboardProps {
  onDisconnect: () => void;
  isConnected: boolean;
}

export default function Dashboard({ onDisconnect, isConnected }: DashboardProps) {
  const { getUserPayments, getNetworkStats, account } = useWeb3V2();
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [networkStats, setNetworkStats] = useState({
    activeNodes: '0',
    totalUsers: '0',
    totalVolume: '0.0 ETH',
    uptime: '100%',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<WifiNode | null>(null);
  const [nodes, setNodes] = useState<WifiNode[]>([]);
  const [nodesLoading, setNodesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('reputation_desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<NodeFilters>({
    activeOnly: true,
  });
  const [activeTab, setActiveTab] = useState<'nodes' | 'history'>('nodes');

  const fetchNodes = async () => {
    setNodesLoading(true);
    try {
      const results = await searchNodes(
        {
          ...filters,
          searchQuery: searchQuery || undefined,
        },
        sortBy
      );
      setNodes(results);
    } catch (error) {
      console.error('Error fetching nodes:', error);
    } finally {
      setNodesLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [payments, stats] = await Promise.all([
        getUserPayments(),
        getNetworkStats(),
      ]);

      const formattedPayments = payments.map((payment, index) => ({
        id: index + 1,
        date: new Date(Number(payment.timestamp) * 1000).toLocaleDateString(),
        amount: `${formatEther(payment.amount)} ETH`,
        status: 'Completed',
        node: `Node-${payment.nodeId}`,
      }));

      setPaymentHistory(formattedPayments.reverse().slice(0, 10));

      if (stats) {
        setNetworkStats({
          activeNodes: stats.activeNodes.toString(),
          totalUsers: stats.totalUsers.toString(),
          totalVolume: `${formatEther(stats.totalVolumeETH)} ETH`,
          uptime: '99.8%',
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchData();
      fetchNodes();
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      fetchNodes();
    }
  }, [sortBy, filters]);

  useEffect(() => {
    if (!isConnected) return;

    const delaySearch = setTimeout(() => {
      fetchNodes();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handlePaymentSuccess = () => {
    fetchData();
    setSelectedNode(null);
  };

  const handleSelectNode = (node: WifiNode) => {
    const nodeWithFixedId = { ...node, node_id: 1 };
    setSelectedNode(nodeWithFixedId);
    setIsPaymentModalOpen(true);
  };

  const handleRefresh = () => {
    fetchNodes();
    fetchData();
  };

  const handleClearFilters = () => {
    setFilters({ activeOnly: true });
    setSearchQuery('');
    setSortBy('reputation_desc');
  };

  const getReputationColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-teal-600';
    if (score >= 50) return 'text-sunny-600';
    return 'text-coral-600';
  };

  const getRatingPercentage = (upvotes: number, downvotes: number) => {
    const total = upvotes + downvotes;
    if (total === 0) return 0;
    return Math.round((upvotes / total) * 100);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedNode(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-teal-500 to-coral-500 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dashboard-waves" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M0 100 Q 50 80, 100 100 T 200 100" fill="none" stroke="white" strokeWidth="2" opacity="0.3"/>
              <path d="M0 120 Q 50 100, 100 120 T 200 120" fill="none" stroke="white" strokeWidth="2" opacity="0.2"/>
              <circle cx="50" cy="50" r="30" fill="white" opacity="0.1"/>
              <circle cx="150" cy="150" r="40" fill="white" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dashboard-waves)"/>
        </svg>
      </div>

      <div className="bg-white/10 backdrop-blur-md border-b-2 border-white/20 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={onDisconnect}
              className="flex items-center gap-2 text-white hover:bg-white/20 px-4 py-2 rounded-full transition-all font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>

            <div className="flex items-center gap-3">
              {account && (
                <WalletAddressDisplay
                  address={account}
                  onDisconnect={onDisconnect}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <svg viewBox="0 0 120 120" className="w-20 h-20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="40" r="30" fill="#fde047" opacity="0.9"/>
                <ellipse cx="60" cy="75" rx="20" ry="30" fill="#fde047" opacity="0.9"/>
                <circle cx="56" cy="35" r="4" fill="#1f2937"/>
                <circle cx="64" cy="35" r="4" fill="#1f2937"/>
                <path d="M 56 45 Q 60 48 64 45" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <rect x="50" y="85" width="7" height="18" fill="#14b8a6" rx="2"/>
                <rect x="63" y="85" width="7" height="18" fill="#14b8a6" rx="2"/>
                <rect x="48" y="103" width="24" height="5" fill="#1f2937" rx="2"/>
                <g transform="translate(50, 60)">
                  <circle cx="10" cy="10" r="12" fill="#fb7185"/>
                  <path d="M 5 10 L 8 13 L 15 6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </svg>
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Find Your WiFi Node
          </h1>
          <p className="text-xl text-white/90 font-medium max-w-2xl mx-auto">
            Browse available nodes and connect to affordable, community-powered internet
          </p>
        </div>

        <div className="mb-8">
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setActiveTab('nodes')}
              className={`px-8 py-4 font-bold transition-all rounded-2xl flex items-center gap-2 ${
                activeTab === 'nodes'
                  ? 'bg-white text-teal-600 shadow-2xl scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Wifi className="w-5 h-5" />
              WiFi Nodes
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-8 py-4 font-bold transition-all rounded-2xl flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-white text-teal-600 shadow-2xl scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <History className="w-5 h-5" />
              Payment History
            </button>
          </div>
        </div>

        {activeTab === 'nodes' ? (
          <>
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-white/50 p-6 mb-8">
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-teal-500 font-medium"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg ${
                    showFilters ? 'bg-gradient-to-r from-teal-500 to-coral-500 text-white' : 'bg-sunny-400 text-white hover:bg-sunny-500'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </button>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-3 bg-coral-500 text-white rounded-xl font-bold hover:bg-coral-600 transition-all shadow-lg"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="w-full px-3 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-900 font-medium"
                      >
                        <option value="reputation_desc">Highest Reputation</option>
                        <option value="price_eth_asc">Lowest Price (ETH)</option>
                        <option value="price_eth_desc">Highest Price (ETH)</option>
                        <option value="price_usd_asc">Lowest Price (USD)</option>
                        <option value="price_usd_desc">Highest Price (USD)</option>
                        <option value="connections_desc">Most Popular</option>
                        <option value="newest">Newest First</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Min Reputation</label>
                      <select
                        value={filters.minReputation || ''}
                        onChange={(e) =>
                          setFilters({ ...filters, minReputation: e.target.value ? Number(e.target.value) : undefined })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-900 font-medium"
                      >
                        <option value="">Any</option>
                        <option value="50">50+</option>
                        <option value="70">70+</option>
                        <option value="85">85+</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={handleClearFilters}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center">
                    <input
                      type="checkbox"
                      id="activeOnly"
                      checked={filters.activeOnly}
                      onChange={(e) => setFilters({ ...filters, activeOnly: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <label htmlFor="activeOnly" className="ml-2 text-gray-700 text-sm font-medium">
                      Show only active nodes
                    </label>
                  </div>
                </div>
              )}
            </div>

            {nodesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-2xl p-6 animate-pulse"
                    style={{ height: '280px' }}
                  />
                ))}
              </div>
            ) : nodes.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-white/50 p-16 text-center">
                <Wifi className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Nodes Found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border-4 border-white/50 hover:border-sunny-300 hover:shadow-2xl hover:scale-105 transition-all relative"
                  >
                    <div className="absolute top-4 right-4">
                      {node.is_active ? (
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          Active
                        </div>
                      ) : (
                        <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">
                          Inactive
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{node.location}</h3>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 font-medium">ETH Price/hr</span>
                        <span className="text-sm font-bold text-gray-900">{node.price_per_hour_eth} ETH</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 font-medium">USD Price/hr</span>
                        <span className="text-sm font-bold text-gray-900">${node.price_per_hour_usd}</span>
                      </div>
                    </div>

                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <Star className={`w-4 h-4 ${getReputationColor(node.reputation_score)} fill-current`} />
                          <span className={`font-bold ${getReputationColor(node.reputation_score)}`}>
                            {node.reputation_score}
                          </span>
                          <span className="text-xs text-gray-500">/100</span>
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          {getRatingPercentage(node.upvotes, node.downvotes)}% positive
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="w-3 h-3" />
                          <span>{node.upvotes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-600">
                          <TrendingDownIcon className="w-3 h-3" />
                          <span>{node.downvotes}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">{node.total_connections} connections</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectNode(node)}
                      className="w-full bg-gradient-to-r from-teal-500 via-sunny-400 to-coral-500 text-white px-4 py-3 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
                    >
                      Pay & Connect
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-white/50 overflow-hidden">
            <div className="p-8 bg-gradient-to-r from-sunny-400 to-coral-500 border-b-4 border-white/50">
              <h2 className="text-3xl font-extrabold text-white">Payment History</h2>
              <p className="text-white/90 mt-2 font-medium">Your recent transactions on the network</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-teal-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">
                      Node
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        Loading payment history...
                      </td>
                    </tr>
                  ) : paymentHistory.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No payment history yet. Make your first payment to get started!
                      </td>
                    </tr>
                  ) : (
                    paymentHistory.map((payment) => (
                      <tr key={payment.id} className="hover:bg-sunny-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {payment.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">
                          {payment.node}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {payment.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-teal-500 to-coral-500 text-white border-2 border-white shadow-lg">
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        onPaymentSuccess={handlePaymentSuccess}
        selectedNode={selectedNode}
      />
    </div>
  );
}
