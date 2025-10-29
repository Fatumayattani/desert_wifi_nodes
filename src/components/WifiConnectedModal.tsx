import { Wifi, CheckCircle, X } from 'lucide-react';

interface WifiConnectedModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeLocation?: string;
  duration?: number;
}

export default function WifiConnectedModal({ isOpen, onClose, nodeLocation, duration }: WifiConnectedModalProps) {
  if (!isOpen) return null;

  const getDurationLabel = (seconds: number) => {
    const hours = seconds / 3600;
    if (hours >= 24) return `${hours / 24} day${hours / 24 > 1 ? 's' : ''}`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${seconds / 60} minutes`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border-4 border-gray-100 relative overflow-hidden animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-coral-500"></div>

          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="success-waves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="25" cy="25" r="20" fill="white" opacity="0.3"/>
                  <circle cx="75" cy="75" r="15" fill="white" opacity="0.2"/>
                  <path d="M0 50 Q 25 40, 50 50 T 100 50" stroke="white" strokeWidth="2" fill="none" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#success-waves)"/>
            </svg>
          </div>

          <div className="relative p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-xl animate-bounce">
              <div className="relative">
                <Wifi className="w-12 h-12 text-teal-500" />
                <div className="absolute -top-2 -right-2 bg-sunny-400 rounded-full p-1">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
              WiFi Connected!
            </h2>

            <p className="text-xl text-white/95 font-medium">
              Enjoy your internet 🎉
            </p>
          </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-teal-50 to-coral-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-green-600 uppercase tracking-wide">Connection Active</span>
            </div>

            {nodeLocation && (
              <div className="text-center mb-3">
                <div className="text-sm text-gray-600 mb-1">Connected to</div>
                <div className="text-lg font-bold text-gray-900">{nodeLocation}</div>
              </div>
            )}

            {duration && (
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Duration</div>
                <div className="text-lg font-bold text-teal-600">{getDurationLabel(duration)}</div>
              </div>
            )}
          </div>

          <div className="bg-sunny-50 border-2 border-sunny-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-sunny-900 font-medium text-center">
              💡 Your connection is secure and ready to use
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-teal-500 to-coral-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Start Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
