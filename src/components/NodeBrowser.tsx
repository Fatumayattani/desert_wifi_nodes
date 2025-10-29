import { useState, useEffect } from 'react';
import { X, Search, Wifi, MapPin, Star, Users, TrendingUp, TrendingDown, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { WifiNode } from '../lib/supabase';
import { searchNodes, NodeFilters, SortOption } from '../services/nodeService';

interface NodeBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (node: WifiNode) => void;
}

export default function NodeBrowser({ isOpen, onClose, onSelectNode }: NodeBrowserProps) {
  const [nodes, setNodes] = useState<WifiNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('reputation_desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<NodeFilters>({
    activeOnly: true,
  });

  const fetchNodes = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNodes();
    }
  }, [isOpen, sortBy, filters]);

  useEffect(() => {
    if (!isOpen) return;

    const delaySearch = setTimeout(() => {
      fetchNodes();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleRefresh = () => {
    fetchNodes();
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full border-4 border-gray-100 relative overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-teal-500 to-coral-500 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-extrabold text-white">Browse WiFi Nodes</h2>
              <p className="text-white/90 mt-1">Select a node to connect and make payment</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-white/40 font-medium"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                showFilters ? 'bg-white text-teal-600' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-sm font-bold mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 rounded-lg bg-white text-gray-900 font-medium"
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
                  <label className="block text-white text-sm font-bold mb-2">Min Reputation</label>
                  <select
                    value={filters.minReputation || ''}
                    onChange={(e) =>
                      setFilters({ ...filters, minReputation: e.target.value ? Number(e.target.value) : undefined })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white text-gray-900 font-medium"
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
                    className="w-full px-4 py-2 bg-white/20 text-white rounded-lg font-bold hover:bg-white/30 transition-all"
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
                <label htmlFor="activeOnly" className="ml-2 text-white text-sm font-medium">
                  Show only active nodes
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl p-6 animate-pulse"
                  style={{ height: '280px' }}
                />
              ))}
            </div>
          ) : nodes.length === 0 ? (
            <div className="text-center py-16">
              <Wifi className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Nodes Found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-teal-300 hover:shadow-xl transition-all relative group"
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
                        <TrendingDown className="w-3 h-3" />
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
                    onClick={() => onSelectNode(node)}
                    className="w-full bg-gradient-to-r from-teal-500 via-sunny-400 to-coral-500 text-white px-4 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    Pay & Connect
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <p className="text-center text-sm text-gray-600">
            Showing <span className="font-bold">{nodes.length}</span> node{nodes.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
