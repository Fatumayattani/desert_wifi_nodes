import { useState, useEffect } from 'react';
import { X, Clock, DollarSign, MapPin, ArrowLeft } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';
import { WifiNode } from '../lib/supabase';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  selectedNode?: WifiNode | null;
}

export default function PaymentModal({ isOpen, onClose, onPaymentSuccess, selectedNode }: PaymentModalProps) {
  const { makePayment, isLoading } = useWeb3();
  const [nodeId, setNodeId] = useState('1');
  const [duration, setDuration] = useState('3600');
  const [amount, setAmount] = useState('0.001');
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setNodeId(selectedNode.node_id.toString());
      setAmount(selectedNode.price_per_hour_eth.toString());
    }
  }, [selectedNode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await makePayment(parseInt(nodeId), parseInt(duration), amount);
      onPaymentSuccess();
      onClose();
      setNodeId('1');
      setDuration('3600');
      setAmount('0.001');
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    }
  };

  const durationOptions = [
    { label: '1 Hour', value: '3600' },
    { label: '6 Hours', value: '21600' },
    { label: '12 Hours', value: '43200' },
    { label: '24 Hours', value: '86400' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border-4 border-gray-100 relative overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-coral-500 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-white">Make Payment</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white/90 mt-2">
            {selectedNode ? `Selected: ${selectedNode.location}` : 'Connect to a node and add funds to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {selectedNode && (
            <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-gray-900">{selectedNode.location}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Node ID:</span>
                      <span className="font-bold text-gray-900">#{selectedNode.node_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price (ETH):</span>
                      <span className="font-bold text-gray-900">{selectedNode.price_per_hour_eth} ETH/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price (USD):</span>
                      <span className="font-bold text-gray-900">${selectedNode.price_per_hour_usd}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reputation:</span>
                      <span className="font-bold text-teal-600">{selectedNode.reputation_score}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedNode && (
            <div className="bg-sunny-50 border-2 border-sunny-200 rounded-xl p-4">
              <p className="text-sm text-sunny-800 font-medium">
                ⚠️ No node selected. Please browse and select a node first.
              </p>
            </div>
          )}

          <div style={{ display: selectedNode ? 'none' : 'block' }}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Node ID
            </label>
            <input
              type="number"
              min="1"
              value={nodeId}
              onChange={(e) => setNodeId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Enter the node ID you want to connect to</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium"
            >
              {durationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Amount (ETH)
            </label>
            <input
              type="number"
              step="0.0001"
              min="0.0001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Minimum payment: 0.0001 ETH</p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-teal-500 to-coral-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
