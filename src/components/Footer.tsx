import { Github, Twitter, MessageCircle, Heart, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 mt-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-coral-500 to-sunny-500"></div>

      <div className="absolute top-10 right-10 w-32 h-32 opacity-5">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="30" r="20" fill="white"/>
          <ellipse cx="50" cy="65" rx="15" ry="25" fill="white"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h3 className="text-white font-extrabold text-xl">Desert WiFi Nodes</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Building affordable, sustainable internet access for underserved communities through decentralized solar-powered networks.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-teal-400 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-coral-500 rounded-full"></span>
                About Us
              </a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-coral-500 rounded-full"></span>
                How It Works
              </a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-coral-500 rounded-full"></span>
                Become a Node Operator
              </a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-coral-500 rounded-full"></span>
                Documentation
              </a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 text-lg">Connect With Us</h4>
            <div className="flex gap-3 mb-6">
              <a href="#" className="bg-gray-800 hover:bg-teal-600 w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-teal-600 w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-teal-600 w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-coral-500 px-4 py-2.5 rounded-full text-sm shadow-lg">
              <Code className="w-4 h-4 text-white" />
              <span className="text-white font-bold">Open Source</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-gray-400 font-medium">© 2025 Desert WiFi Nodes. Empowering communities worldwide.</p>
          <p className="flex items-center gap-2 text-gray-400 font-medium">
            Made with <Heart className="w-4 h-4 text-coral-500 fill-coral-500 animate-pulse" /> for the future
          </p>
        </div>
      </div>
    </footer>
  );
}
