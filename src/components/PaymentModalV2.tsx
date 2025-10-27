import { useState } from 'react';
import { X, Clock, DollarSign, Coins } from 'lucide-react';
import { useWeb3V2 } from '../contexts/Web3ContextV2';
import { PaymentType, USDC_ADDRESS, USDT_ADDRESS } from '../contracts/desertWifiNodesV2Config';

interface PaymentModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export default function PaymentModalV2({ isOpen, onClose, onPaymentSuccess }: PaymentModalV2Props) {
  const { makePaymentETH, makePaymentStablecoin, approveStablecoin, isLoading } = useWeb3V2();
  const [nodeId, setNodeId] = useState('1');
  const [duration, setDuration] = useState('3600');
  const [amount, setAmount] = useState('0.001');
  const [paymentMethod, setPaymentMethod] = useState<'ETH' | 'USDC' | 'USDT'>('ETH');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'payment' | 'approve'>('payment');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (paymentMethod === 'ETH') {
        await makePaymentETH(parseInt(nodeId), parseInt(duration), amount);
      } else {
        if (step === 'payment') {
          setStep('approve');
          const tokenAddress = paymentMethod === 'USDC' ? USDC_ADDRESS : USDT_ADDRESS;
          await approveStablecoin(tokenAddress, amount);
          setStep('payment');
        }

        const paymentType = paymentMethod === 'USDC' ? PaymentType.USDC : PaymentType.USDT;
        await makePaymentStablecoin(parseInt(nodeId), parseInt(duration), amount, paymentType);
      }

      onPaymentSuccess();
      onClose();
      setNodeId('1');
      setDuration('3600');
      setAmount('0.001');
      setStep('payment');
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
      setStep('payment');
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
            {step === 'approve' ? 'Approve token spending' : 'Connect to a node and add funds'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <Coins className="w-4 h-4 inline mr-1" />
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('ETH')}
                className={`px-4 py-3 rounded-xl font-bold transition-all ${
                  paymentMethod === 'ETH'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ETH
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('USDC')}
                className={`px-4 py-3 rounded-xl font-bold transition-all ${
                  paymentMethod === 'USDC'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                USDC
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('USDT')}
                className={`px-4 py-3 rounded-xl font-bold transition-all ${
                  paymentMethod === 'USDT'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                USDT
              </button>
            </div>
          </div>

          <div>
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
              Amount ({paymentMethod})
            </label>
            <input
              type="number"
              step={paymentMethod === 'ETH' ? '0.0001' : '0.01'}
              min={paymentMethod === 'ETH' ? '0.0001' : '0.01'}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Minimum: {paymentMethod === 'ETH' ? '0.0001 ETH' : '0.01 USD'}
            </p>
          </div>

          {paymentMethod !== 'ETH' && step === 'payment' && (
            <div className="bg-sunny-50 border-2 border-sunny-200 rounded-xl p-4">
              <p className="text-sm text-sunny-800 font-medium">
                ⚠️ Stablecoin payments require two transactions: first to approve token spending, then to complete the payment.
              </p>
            </div>
          )}

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
              {isLoading ? (
                step === 'approve' ? 'Approving...' : 'Processing...'
              ) : (
                step === 'approve' ? 'Approve' : 'Pay Now'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
