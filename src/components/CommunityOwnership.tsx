import { Users, Leaf, Shield, Target } from 'lucide-react';

export default function CommunityOwnership() {
  const features = [
    {
      icon: Users,
      title: 'Community Owned',
      description: 'Nodes are owned and operated by local community members, ensuring sustainability and local empowerment.',
      color: 'text-coral-600',
      bgColor: 'bg-coral-50',
      illustration: (
        <svg viewBox="0 0 100 80" className="w-20 h-16 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="25" r="12" fill="#fb7185"/>
          <ellipse cx="30" cy="45" rx="10" ry="15" fill="#fb7185"/>
          <circle cx="50" cy="25" r="12" fill="#fde047"/>
          <ellipse cx="50" cy="45" rx="10" ry="15" fill="#fde047"/>
          <circle cx="70" cy="25" r="12" fill="#14b8a6"/>
          <ellipse cx="70" cy="45" rx="10" ry="15" fill="#14b8a6"/>
          <circle cx="27" cy="22" r="2" fill="#1f2937"/>
          <circle cx="33" cy="22" r="2" fill="#1f2937"/>
          <circle cx="47" cy="22" r="2" fill="#1f2937"/>
          <circle cx="53" cy="22" r="2" fill="#1f2937"/>
          <circle cx="67" cy="22" r="2" fill="#1f2937"/>
          <circle cx="73" cy="22" r="2" fill="#1f2937"/>
        </svg>
      ),
    },
    {
      icon: Leaf,
      title: '100% Solar Powered',
      description: 'Every node runs on renewable solar energy, making our network sustainable and eco-friendly.',
      color: 'text-sunny-600',
      bgColor: 'bg-sunny-50',
      illustration: (
        <svg viewBox="0 0 100 80" className="w-20 h-16 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="25" r="15" fill="#fde047"/>
          <path d="M 50 5 L 50 15 M 50 35 L 50 45 M 30 25 L 40 25 M 60 25 L 70 25 M 35 10 L 42 17 M 58 33 L 65 40 M 65 10 L 58 17 M 42 33 L 35 40" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round"/>
          <rect x="35" y="45" width="30" height="20" fill="#14b8a6" rx="2"/>
          <rect x="38" y="48" width="11" height="7" fill="#0d9488"/>
          <rect x="51" y="48" width="11" height="7" fill="#0d9488"/>
          <rect x="38" y="57" width="11" height="7" fill="#0d9488"/>
          <rect x="51" y="57" width="11" height="7" fill="#0d9488"/>
          <rect x="48" y="65" width="4" height="10" fill="#64748b"/>
        </svg>
      ),
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Decentralized mesh network ensures your data stays private with encrypted connections.',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      illustration: (
        <svg viewBox="0 0 100 80" className="w-20 h-16 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg">
          <path d="M 50 10 L 70 20 L 70 40 Q 70 55 50 65 Q 30 55 30 40 L 30 20 Z" fill="#14b8a6" opacity="0.9"/>
          <path d="M 50 15 L 65 22 L 65 38 Q 65 50 50 58 Q 35 50 35 38 L 35 22 Z" fill="#0d9488"/>
          <path d="M 43 38 L 48 43 L 58 30" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="25" cy="55" r="3" fill="#fb7185"/>
          <circle cx="75" cy="55" r="3" fill="#fb7185"/>
          <circle cx="50" cy="70" r="3" fill="#fb7185"/>
          <path d="M 25 55 L 50 40 M 75 55 L 50 40 M 50 70 L 50 45" stroke="#fb7185" strokeWidth="2" opacity="0.6"/>
        </svg>
      ),
    },
    {
      icon: Target,
      title: 'Affordable Access',
      description: 'Pay-as-you-go model with minimal fees makes internet accessible to everyone.',
      color: 'text-coral-500',
      bgColor: 'bg-coral-50',
      illustration: (
        <svg viewBox="0 0 100 80" className="w-20 h-16 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="35" r="12" fill="#fde047"/>
          <ellipse cx="50" cy="55" rx="9" ry="13" fill="#fde047"/>
          <circle cx="47" cy="32" r="2" fill="#1f2937"/>
          <circle cx="53" cy="32" r="2" fill="#1f2937"/>
          <path d="M 47 38 Q 50 40 53 38" stroke="#1f2937" strokeWidth="2" fill="none"/>
          <rect x="41" y="62" width="5" height="12" fill="#fb7185" rx="1"/>
          <rect x="54" y="62" width="5" height="12" fill="#fb7185" rx="1"/>
          <rect x="39" y="74" width="22" height="4" fill="#1f2937" rx="2"/>
          <rect x="40" y="45" width="16" height="11" fill="#ffffff" rx="2" stroke="#14b8a6" strokeWidth="2"/>
          <circle cx="48" cy="51" r="2" fill="#14b8a6"/>
          <text x="42" y="54" fontSize="6" fill="#14b8a6" fontWeight="bold">$</text>
          <path d="M 60 20 L 65 25 L 70 15" stroke="#fb7185" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-teal-50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-teal-500 opacity-5 rounded-b-full transform -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-coral-500 opacity-5 rounded-full transform translate-x-32 translate-y-32"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-block bg-teal-100 text-teal-600 px-5 py-2 rounded-full text-sm font-bold mb-4">
            WHY CHOOSE US
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Built for Communities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sustainable, secure, and owned by the people who use it
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-gray-100 hover:border-teal-200 transform hover:-translate-y-1"
            >
              <div className="flex justify-center">
                {feature.illustration}
              </div>

              <div className={`${feature.bgColor} ${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                {feature.description}
              </p>

              <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-coral-50 px-4 py-2 rounded-full">
                  <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">Featured</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-r from-teal-500 to-coral-500 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="30" r="20" fill="white"/>
              <ellipse cx="50" cy="65" rx="15" ry="25" fill="white"/>
            </svg>
          </div>

          <div className="relative">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Join the Movement
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Help us expand affordable internet access to more communities. Become a node operator or supporter today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-white text-teal-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                Become an Operator
              </button>
              <button className="bg-sunny-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-sunny-300 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                Support Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
