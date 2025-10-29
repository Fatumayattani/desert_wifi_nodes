import { useState } from 'react';
import { X, MapPin, DollarSign, Coins } from 'lucide-react';
import { useWeb3V2 } from '../contexts/Web3ContextV2';

interface RegisterNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterNodeModal({ isOpen, onClose, onSuccess }: RegisterNodeModalProps) {
  const { registerNode, isLoading } = useWeb3V2();
  const [location, setLocation] = useState('');
  const [priceETH, setPriceETH] = useState('0.001');
  const [priceUSD, setPriceUSD] = useState('1');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (!location.trim()) {
        setError('Please enter a location');
        return;
      }

      const parsedPriceETH = parseFloat(priceETH);
      const parsedPriceUSD = parseFloat(priceUSD);

      if (isNaN(parsedPriceETH) || parsedPriceETH < 0) {
        setError('Please enter a valid ETH price (0 or greater)');
        return;
      }

      if (isNaN(parsedPriceUSD) || parsedPriceUSD < 0) {
        setError('Please enter a valid USD price (0 or greater)');
        return;
      }

      if (parsedPriceETH === 0 && parsedPriceUSD === 0) {
        setError('At least one price (ETH or USD) must be greater than 0');
        return;
      }

      await registerNode(location, priceETH, priceUSD);

      onSuccess();
      onClose();
      setLocation('');
      setPriceETH('0.001');
      setPriceUSD('1');
    } catch (err: any) {
      console.error('Registration error:', err);
      let errorMessage = 'Failed to register node. Please try again.';

      if (err.message) {
        if (err.message.includes('user rejected')) {
          errorMessage = 'Transaction was rejected by user.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border-4 border-gray-100 relative overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-coral-500 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-white">Register Node</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white/90 mt-2">
            Register your WiFi node on the network
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Desert Valley Community Center"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Describe your node location</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <Coins className="w-4 h-4 inline mr-1" />
              Price per Hour (ETH)
            </label>
            <input
              type="number"
              step="0.0001"
              min="0"
              value={priceETH}
              onChange={(e) => setPriceETH(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Set to 0 if you don't accept ETH payments</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Price per Hour (USD)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={priceUSD}
              onChange={(e) => setPriceUSD(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              For USDC/USDT payments. Set to 0 if you don't accept stablecoins
            </p>
          </div>

          <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4">
            <p className="text-sm text-teal-800 font-medium">
              💡 Tip: At least one price must be greater than 0. You can accept ETH, stablecoins, or both!
            </p>
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
              {isLoading ? 'Registering...' : 'Register Node'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
