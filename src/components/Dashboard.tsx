import { useState, useEffect } from 'react';
import { Users, Wifi, DollarSign, ArrowLeft, Activity, TrendingUp, Search, RefreshCw, SlidersHorizontal, MapPin, Star, TrendingDown as TrendingDownIcon, History } from 'lucide-react';
import { formatEther } from 'ethers';
import { useWeb3 } from '../contexts/Web3ContextV2';
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
          totalVolume: `${formatEther(stats.totalVolume)} ETH`,
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
    setSelectedNode(node);
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

  const stats = [
    {
      icon: Wifi,
      label: 'Active Nodes',
      value: isLoading ? '...' : networkStats.activeNodes,
      change: 'Network-wide',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      icon: Users,
      label: 'Connected Users',
      value: isLoading ? '...' : networkStats.totalUsers,
      change: 'Network-wide',
      color: 'text-coral-600',
      bgColor: 'bg-coral-50',
    },
    {
      icon: DollarSign,
      label: 'Total Volume',
      value: isLoading ? '...' : networkStats.totalVolume,
      change: 'Network-wide',
      color: 'text-sunny-600',
      bgColor: 'bg-sunny-50',
    },
    {
      icon: Activity,
      label: 'Network Uptime',
      value: networkStats.uptime,
      change: 'Last 30 days',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="bg-white/90 backdrop-blur-lg border-b-4 border-teal-200 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={onDisconnect}
              className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold">Back to Home</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="inline-block bg-teal-100 text-teal-600 px-5 py-2 rounded-full text-sm font-bold mb-4">
            YOUR DASHBOARD
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">Available WiFi Nodes</h1>
          <p className="text-gray-600 text-lg">Connect to affordable, community-powered internet near you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-xl border-4 border-gray-100 hover:border-teal-200 hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              <div className={`${stat.bgColor} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 font-bold mb-2">{stat.label}</div>
              <div className="flex items-center gap-1 text-xs text-teal-600 font-semibold bg-teal-50 px-2 py-1 rounded-full inline-flex">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex gap-2 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab('nodes')}
              className={`px-6 py-3 font-bold transition-all ${
                activeTab === 'nodes'
                  ? 'border-b-4 border-teal-500 text-teal-600 -mb-0.5'
                  : 'text-gray-600 hover:text-teal-600'
              }`}
            >
              <Wifi className="w-5 h-5 inline mr-2" />
              WiFi Nodes
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-bold transition-all ${
                activeTab === 'history'
                  ? 'border-b-4 border-teal-500 text-teal-600 -mb-0.5'
                  : 'text-gray-600 hover:text-teal-600'
              }`}
            >
              <History className="w-5 h-5 inline mr-2" />
              Payment History
            </button>
          </div>
        </div>

        {activeTab === 'nodes' ? (
          <>
            <div className="bg-white rounded-3xl shadow-xl border-4 border-gray-100 p-6 mb-8">
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
                  className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                    showFilters ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </button>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
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
              <div className="bg-white rounded-3xl shadow-xl border-4 border-gray-100 p-16 text-center">
                <Wifi className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Nodes Found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-teal-300 hover:shadow-xl transition-all relative"
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
                      className="w-full bg-gradient-to-r from-teal-500 to-coral-500 text-white px-4 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      Connect & Pay
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border-4 border-gray-100 overflow-hidden">
            <div className="p-8 bg-gradient-to-r from-teal-50 to-coral-50 border-b-4 border-gray-100">
              <h2 className="text-3xl font-extrabold text-gray-900">Payment History</h2>
              <p className="text-gray-600 mt-2 font-medium">Your recent transactions on the network</p>
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
                      <tr key={payment.id} className="hover:bg-teal-50 transition-colors">
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
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-teal-100 text-teal-700 border-2 border-teal-200">
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
