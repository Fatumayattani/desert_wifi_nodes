import { Wifi, CreditCard, Zap } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Wifi,
      title: 'Connect to a Node',
      description: 'Find and connect to a nearby Desert WiFi Node in your community',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      illustration: (
        <svg viewBox="0 0 120 120" className="w-full h-32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="45" r="25" fill="#fb7185"/>
          <ellipse cx="60" cy="75" rx="18" ry="28" fill="#fb7185"/>
          <circle cx="56" cy="40" r="3" fill="#1f2937"/>
          <circle cx="64" cy="40" r="3" fill="#1f2937"/>
          <path d="M 56 48 Q 60 51 64 48" stroke="#1f2937" strokeWidth="2" fill="none"/>
          <rect x="50" y="83" width="7" height="18" fill="#0d9488" rx="2"/>
          <rect x="63" y="83" width="7" height="18" fill="#0d9488" rx="2"/>
          <rect x="48" y="101" width="24" height="5" fill="#1f2937" rx="2"/>
          <path d="M 40 30 Q 60 20 80 30" stroke="#14b8a6" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <circle cx="40" cy="30" r="3" fill="#14b8a6"/>
          <circle cx="80" cy="30" r="3" fill="#14b8a6"/>
          <circle cx="60" cy="22" r="3" fill="#14b8a6"/>
        </svg>
      ),
    },
    {
      icon: CreditCard,
      title: 'Pay Small Fee via Scroll',
      description: 'Securely pay a minimal fee using crypto on the Scroll network',
      color: 'text-coral-600',
      bgColor: 'bg-coral-100',
      illustration: (
        <svg viewBox="0 0 120 120" className="w-full h-32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="40" r="22" fill="#fde047"/>
          <ellipse cx="60" cy="68" rx="16" ry="25" fill="#fde047"/>
          <circle cx="56" cy="36" r="3" fill="#1f2937"/>
          <circle cx="64" cy="36" r="3" fill="#1f2937"/>
          <path d="M 56 44 Q 60 46 64 44" stroke="#1f2937" strokeWidth="2" fill="none"/>
          <rect x="52" y="75" width="6" height="16" fill="#fb7185" rx="2"/>
          <rect x="62" y="75" width="6" height="16" fill="#fb7185" rx="2"/>
          <rect x="50" y="91" width="20" height="4" fill="#1f2937" rx="2"/>
          <rect x="45" y="52" width="22" height="14" fill="#ffffff" rx="2" stroke="#14b8a6" strokeWidth="2"/>
          <circle cx="62" cy="59" r="2" fill="#14b8a6"/>
          <text x="51" y="62" fontSize="8" fill="#14b8a6" fontWeight="bold">$</text>
        </svg>
      ),
    },
    {
      icon: Zap,
      title: 'Get Affordable WiFi',
      description: 'Enjoy reliable, fast internet access powered by solar energy',
      color: 'text-sunny-600',
      bgColor: 'bg-sunny-100',
      illustration: (
        <svg viewBox="0 0 120 120" className="w-full h-32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="42" r="23" fill="#14b8a6"/>
          <ellipse cx="60" cy="72" rx="17" ry="26" fill="#14b8a6"/>
          <circle cx="56" cy="38" r="3" fill="#1f2937"/>
          <circle cx="64" cy="38" r="3" fill="#1f2937"/>
          <path d="M 52 48 Q 60 54 68 48" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <rect x="52" y="80" width="6" height="17" fill="#fde047" rx="2"/>
          <rect x="62" y="80" width="6" height="17" fill="#fde047" rx="2"/>
          <rect x="50" y="97" width="20" height="4" fill="#1f2937" rx="2"/>
          <rect x="50" y="60" width="20" height="14" fill="#ffffff" rx="2"/>
          <rect x="52" y="62" width="16" height="10" fill="#14b8a6" rx="1"/>
          <circle cx="85" cy="25" r="12" fill="#fde047"/>
          <path d="M 85 18 L 85 32 M 78 25 L 92 25 M 80 19 L 90 31 M 90 19 L 80 31" stroke="#ca8a04" strokeWidth="2"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-coral-100 text-coral-600 px-5 py-2 rounded-full text-sm font-bold mb-4">
            SIMPLE PROCESS
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to connect to affordable, sustainable internet
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/3 left-0 right-0 h-2 bg-gradient-to-r from-teal-300 via-coral-300 to-sunny-300 rounded-full opacity-40 transform -translate-y-1/2" style={{marginLeft: '15%', marginRight: '15%'}}></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-gray-100 hover:border-teal-200 h-full transform hover:-translate-y-2">
                  <div className="flex justify-center mb-6">
                    {step.illustration}
                  </div>

                  <div className={`absolute -top-5 -left-5 w-14 h-14 rounded-full bg-gradient-to-br ${index === 0 ? 'from-teal-400 to-teal-600' : index === 1 ? 'from-coral-400 to-coral-600' : 'from-sunny-400 to-sunny-600'} flex items-center justify-center text-white font-bold text-xl shadow-xl transform group-hover:scale-110 transition-transform`}>
                    {index + 1}
                  </div>

                  <div className={`${step.bgColor} ${step.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                    <step.icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {step.description}
                  </p>

                  <div className="mt-6 bg-gradient-to-r from-teal-50 to-coral-50 rounded-2xl p-4 text-center">
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                      <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      Quick & Easy
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-3xl shadow-lg p-6 border-4 border-sunny-200">
            <div className="flex items-center gap-4">
              <div className="bg-sunny-100 rounded-full p-3">
                <svg className="w-8 h-8 text-sunny-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900">Ready in Minutes!</div>
                <div className="text-gray-600">Start enjoying affordable WiFi today</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
