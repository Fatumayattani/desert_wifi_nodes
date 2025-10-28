import { useState, useRef, useEffect } from 'react';
import { Wallet, Copy, ExternalLink, LogOut, Check } from 'lucide-react';

interface WalletAddressDisplayProps {
  address: string;
  onDisconnect: () => void;
}

export default function WalletAddressDisplay({ address, onDisconnect }: WalletAddressDisplayProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleViewExplorer = () => {
    window.open(`https://sepolia.scrollscan.com/address/${address}`, '_blank');
  };

  const handleDisconnect = () => {
    setIsDropdownOpen(false);
    onDisconnect();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 bg-teal-100 hover:bg-teal-200 text-teal-700 px-5 py-2.5 rounded-full font-bold transition-all hover:scale-105 border-2 border-teal-200 shadow-md"
      >
        <Wallet className="w-5 h-5" />
        <span className="font-mono text-sm">{formatAddress(address)}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-gradient-to-r from-teal-50 to-coral-50 border-b-2 border-gray-100">
            <div className="text-xs text-gray-600 font-semibold mb-1">Connected Wallet</div>
            <div className="font-mono text-sm text-gray-900 font-bold break-all">{address}</div>
          </div>

          <div className="py-2">
            <button
              onClick={handleCopyAddress}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-teal-50 transition-colors text-left"
            >
              {isCopied ? (
                <Check className="w-5 h-5 text-teal-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
              <span className="text-sm font-semibold text-gray-700">
                {isCopied ? 'Copied!' : 'Copy Address'}
              </span>
            </button>

            <button
              onClick={handleViewExplorer}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-teal-50 transition-colors text-left"
            >
              <ExternalLink className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">View on Explorer</span>
            </button>

            <div className="border-t-2 border-gray-100 my-2" />

            <button
              onClick={handleDisconnect}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-coral-50 transition-colors text-left"
            >
              <LogOut className="w-5 h-5 text-coral-600" />
              <span className="text-sm font-bold text-coral-600">Disconnect Wallet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
