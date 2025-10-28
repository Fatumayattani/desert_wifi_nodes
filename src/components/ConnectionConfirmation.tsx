import { CheckCircle, Wallet } from 'lucide-react';

interface ConnectionConfirmationProps {
  isOpen: boolean;
  walletAddress: string;
  onContinue: () => void;
}

export default function ConnectionConfirmation({
  isOpen,
  walletAddress,
  onContinue,
}: ConnectionConfirmationProps) {
  if (!isOpen) return null;

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 border-4 border-teal-200 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="bg-teal-100 rounded-full p-6">
              <Wallet className="w-12 h-12 text-teal-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
              <CheckCircle className="w-8 h-8 text-teal-500" />
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            Wallet Connected!
          </h2>

          <p className="text-gray-600 mb-6">
            Your MetaMask wallet has been successfully connected to Deslink
          </p>

          <div className="w-full bg-gradient-to-r from-teal-50 to-coral-50 rounded-2xl p-5 mb-6 border-2 border-teal-100">
            <div className="text-xs text-gray-600 font-semibold mb-2">Connected Address</div>
            <div className="font-mono text-lg font-bold text-gray-900 break-all">
              {formatAddress(walletAddress)}
            </div>
            <div className="text-xs text-gray-500 mt-2 font-medium">
              {walletAddress}
            </div>
          </div>

          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-teal-500 to-coral-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-teal-600 hover:to-coral-600 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
