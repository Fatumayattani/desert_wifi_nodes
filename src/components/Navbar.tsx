import { Wifi, Sun, Wallet } from 'lucide-react';

interface NavbarProps {
  onConnect: () => void;
  isConnected: boolean;
  walletAddress?: string | null;
}

export default function Navbar({ onConnect, isConnected, walletAddress }: NavbarProps) {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b-4 border-teal-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="relative bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl p-3 shadow-lg">
              <Sun className="w-7 h-7 text-sunny-300" />
              <Wifi className="w-4 h-4 text-white absolute -bottom-1 -right-1 bg-coral-500 rounded-full p-0.5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Deslink</h1>
              <p className="text-xs font-semibold text-teal-600">Powered by Solar & Community</p>
            </div>
          </div>

          <button
            onClick={onConnect}
            className="flex items-center gap-2 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white px-6 py-3 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            {isConnected && walletAddress ? (
              <>
                <Wallet className="w-5 h-5" />
                <span className="font-mono">{formatAddress(walletAddress)}</span>
              </>
            ) : (
              <>
                <Wifi className="w-5 h-5" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
