import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Lock, TrendingUp, Users, Shield, Smartphone, Mail } from 'lucide-react';

const Homepage = () => {
  const features = [
    {
      icon: TrendingUp,
      title: '2% Daily Returns',
      description: 'Compound your crypto with automatic daily 2% returns on your total balance.'
    },
    {
      icon: Users,
      title: 'Multi-Level Rewards',
      description: 'Earn commissions from your network with our generous referral program.'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your security is our priority with encrypted transactions and secure backend.'
    },
    {
      icon: Smartphone,
      title: 'Intuitive App',
      description: 'Beautifully designed mobile experience that\'s easy to navigate and use.'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Download & Register',
      description: 'Get the app from the App Store or download the APK, then create your account.'
    },
    {
      number: 2,
      title: 'Deposit Funds',
      description: 'Securely deposit cryptocurrency to start earning daily returns.'
    },
    {
      number: 3,
      title: 'Earn & Refer',
      description: 'Watch your balance grow daily and invite friends to earn commissions.'
    }
  ];

  return (
    <div className="text-gray-800">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-red-600">RedStone</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#download" className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition duration-300 hover:shadow-lg hover:shadow-red-600/30">
                Download App
              </a>
              <Link to="/login" className="text-gray-700 hover:text-red-600 transition duration-300 flex items-center">
                <Lock className="w-4 h-4 mr-1" /> Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="md:flex items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
                Grow Your Crypto.<br />Build Your Network.
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-lg">
                RedStone offers daily compounding returns and powerful referral rewards - all in one intuitive mobile app.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a href="#download" className="px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-red-600/30">
                  <Download className="mr-2 w-5 h-5" /> Android APK
                </a>
                <a href="#download" className="px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-red-600/30">
                  <Download className="mr-2 w-5 h-5" /> iOS App Store
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-full max-w-md mx-auto bg-gradient-to-br from-red-100 to-red-50 rounded-3xl p-8">
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="text-center">
                      <div className="bg-red-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">RedStone App</h3>
                      <p className="text-gray-600 text-sm mb-4">Your crypto growth companion</p>
                      <div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full inline-block">
                        Available Now
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Unlock Your Crypto Potential</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">RedStone combines powerful earning with an intuitive experience</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-600/10">
                  <div className="text-red-600 mb-4">
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Get Started in 3 Simple Steps</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Start earning today with just a few taps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download CTA */}
      <div id="download" className="bg-white py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Ready to Start Earning?</h2>
          <p className="text-xl text-gray-600 mb-8">Download the RedStone app now for Android and iOS.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-red-600/30">
              <Download className="mr-2 w-5 h-5" /> Android APK
            </button>
            <button className="px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-red-600/30">
              <Download className="mr-2 w-5 h-5" /> iOS App Store
            </button>
          </div>
          <div className="mt-8 flex flex-col items-center">
            <p className="text-gray-600 mb-2">Or scan QR code</p>
            <div className="bg-white p-4 rounded-md shadow-md">
              <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">QR Code</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-red-600">RedStone</span>
              <p className="text-gray-600 mt-1">© 2023 RedStone. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <button className="text-gray-600 hover:text-red-600 transition duration-300">Privacy Policy</button>
              <button className="text-gray-600 hover:text-red-600 transition duration-300">Terms & Conditions</button>
              <button className="text-gray-600 hover:text-red-600 transition duration-300 flex items-center">
                <Mail className="w-4 h-4 mr-1" /> Contact
              </button>
              <Link to="/login" className="text-gray-600 hover:text-red-600 transition duration-300 flex items-center">
                <Lock className="w-4 h-4 mr-1" /> Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;