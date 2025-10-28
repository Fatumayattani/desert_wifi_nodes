export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="waves" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M0 100 Q 50 80, 100 100 T 200 100" fill="none" stroke="white" strokeWidth="2" opacity="0.3"/>
              <path d="M0 120 Q 50 100, 100 120 T 200 120" fill="none" stroke="white" strokeWidth="2" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves)"/>
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sunny-400 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium mb-6 border border-white/30">
              <span className="inline-block w-2 h-2 bg-sunny-400 rounded-full mr-2 animate-pulse"></span>
              Community Powered
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Deslink
            </h1>

            <p className="text-lg text-teal-100 mb-8 max-w-xl">
              Affordable, reliable internet for underserved communities through decentralized mesh technology with affordable Scroll payments
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-teal-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Get Connected
              </button>
              <button className="bg-coral-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative h-96 lg:h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="180" r="40" fill="#fb7185" opacity="0.9"/>
                <ellipse cx="100" cy="230" rx="25" ry="40" fill="#fb7185" opacity="0.9"/>
                <circle cx="95" cy="170" r="5" fill="#1f2937"/>
                <circle cx="105" cy="170" r="5" fill="#1f2937"/>
                <path d="M 95 185 Q 100 190 105 185" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <rect x="85" y="240" width="10" height="25" fill="#fde047" rx="2"/>
                <rect x="105" y="240" width="10" height="25" fill="#fde047" rx="2"/>
                <rect x="80" y="265" width="40" height="8" fill="#1f2937" rx="4"/>

                <rect x="75" y="210" width="30" height="20" fill="#ffffff" rx="3"/>
                <rect x="77" y="212" width="26" height="16" fill="#14b8a6" rx="2"/>

                <circle cx="250" cy="200" r="35" fill="#fde047" opacity="0.9"/>
                <ellipse cx="250" cy="245" rx="22" ry="35" fill="#fde047" opacity="0.9"/>
                <circle cx="245" cy="192" r="4" fill="#1f2937"/>
                <circle cx="255" cy="192" r="4" fill="#1f2937"/>
                <path d="M 245 205 Q 250 208 255 205" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <rect x="237" y="255" width="8" height="20" fill="#0d9488" rx="2"/>
                <rect x="255" y="255" width="8" height="20" fill="#0d9488" rx="2"/>
                <rect x="234" y="275" width="32" height="6" fill="#1f2937" rx="3"/>

                <rect x="230" y="230" width="25" height="18" fill="#ffffff" rx="2"/>
                <rect x="232" y="232" width="21" height="14" fill="#fb7185" rx="2"/>

                <circle cx="300" cy="120" r="30" fill="#14b8a6"/>
                <path d="M 280 115 L 295 125 L 305 110" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

                <circle cx="150" cy="80" r="25" fill="#fb7185"/>
                <text x="150" y="90" fontSize="24" fill="#ffffff" textAnchor="middle" fontWeight="bold">$</text>

                <rect x="180" y="320" width="120" height="15" fill="#fde047" rx="4"/>
                <path d="M 180 335 L 195 350 L 285 350 L 300 335 Z" fill="#ca8a04"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/30 hidden lg:block">
        <div className="flex items-center gap-3">
          <div className="bg-sunny-400 rounded-full p-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="text-white">
            <div className="text-sm font-medium">NEAT!</div>
            <div className="text-xs text-teal-100">New Sale</div>
          </div>
        </div>
      </div>
    </section>
  );
}
