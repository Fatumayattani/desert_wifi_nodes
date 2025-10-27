import { Users, Wifi, DollarSign, ArrowLeft, Activity, TrendingUp } from 'lucide-react';
import Footer from './Footer';

interface DashboardProps {
  onDisconnect: () => void;
  isConnected: boolean;
}

export default function Dashboard({ onDisconnect, isConnected }: DashboardProps) {
  const mockPaymentHistory = [
    { id: 1, date: '2025-10-25', amount: '0.0015 ETH', status: 'Completed', node: 'Node-AZ-001' },
    { id: 2, date: '2025-10-20', amount: '0.0012 ETH', status: 'Completed', node: 'Node-AZ-003' },
    { id: 3, date: '2025-10-15', amount: '0.0018 ETH', status: 'Completed', node: 'Node-AZ-001' },
    { id: 4, date: '2025-10-10', amount: '0.0015 ETH', status: 'Completed', node: 'Node-AZ-002' },
    { id: 5, date: '2025-10-05', amount: '0.0020 ETH', status: 'Completed', node: 'Node-AZ-001' },
  ];

  const stats = [
    {
      icon: Wifi,
      label: 'Active Nodes',
      value: '547',
      change: '+23 this week',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      icon: Users,
      label: 'Connected Users',
      value: '12,438',
      change: '+1,204 this week',
      color: 'text-coral-600',
      bgColor: 'bg-coral-50',
    },
    {
      icon: DollarSign,
      label: 'Total Volume',
      value: '18.4 ETH',
      change: '+2.3 ETH this week',
      color: 'text-sunny-600',
      bgColor: 'bg-sunny-50',
    },
    {
      icon: Activity,
      label: 'Network Uptime',
      value: '99.8%',
      change: 'Last 30 days',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="bg-white/90 backdrop-blur-lg border-b-4 border-teal-200 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={onDisconnect}
              className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold">Back to Home</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-bold border-2 border-teal-200">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                Connected
              </div>
              <button
                onClick={onDisconnect}
                className="bg-coral-100 hover:bg-coral-200 text-coral-700 px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 border-2 border-coral-200"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="inline-block bg-teal-100 text-teal-600 px-5 py-2 rounded-full text-sm font-bold mb-4">
            YOUR DASHBOARD
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">Network Dashboard</h1>
          <p className="text-gray-600 text-lg">Real-time metrics and payment history</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-xl border-4 border-gray-100 hover:border-teal-200 hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              <div className={`${stat.bgColor} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 font-bold mb-2">{stat.label}</div>
              <div className="flex items-center gap-1 text-xs text-teal-600 font-semibold bg-teal-50 px-2 py-1 rounded-full inline-flex">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl border-4 border-gray-100 overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-teal-50 to-coral-50 border-b-4 border-gray-100">
            <h2 className="text-3xl font-extrabold text-gray-900">Payment History</h2>
            <p className="text-gray-600 mt-2 font-medium">Your recent transactions on the network</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-teal-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">
                    Node
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockPaymentHistory.map((payment) => (
                  <tr key={payment.id} className="hover:bg-teal-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">
                      {payment.node}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-teal-100 text-teal-700 border-2 border-teal-200">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 bg-gradient-to-r from-teal-500 to-coral-500 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 opacity-20">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="30" r="20" fill="white"/>
              <ellipse cx="50" cy="65" rx="15" ry="25" fill="white"/>
            </svg>
          </div>

          <div className="flex items-center justify-between flex-col sm:flex-row gap-6 relative">
            <div className="text-center sm:text-left">
              <h3 className="text-3xl font-extrabold mb-3">Need More Data?</h3>
              <p className="text-white/90 text-lg">Top up your account to continue enjoying affordable WiFi access</p>
            </div>
            <button className="bg-white text-teal-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 whitespace-nowrap">
              Add Funds
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
