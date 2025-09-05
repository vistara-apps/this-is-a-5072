import React, { useState } from 'react'
import { Crown, MapPin, Bell, Shield, HelpCircle, LogOut, CreditCard } from 'lucide-react'

const Settings = ({ user, setUser, selectedState, setSelectedState }) => {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

  const handleUpgrade = () => {
    setShowSubscriptionModal(true)
  }

  const handleSubscriptionUpdate = (newStatus) => {
    setUser(prev => ({
      ...prev,
      subscriptionStatus: newStatus,
      subscriptionExpiry: newStatus === 'premium' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null
    }))
    setShowSubscriptionModal(false)
  }

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          icon: Crown,
          label: 'Subscription',
          value: user.subscriptionStatus === 'premium' ? 'Premium' : 'Free',
          action: () => handleUpgrade(),
          showBadge: user.subscriptionStatus === 'free'
        },
        {
          icon: CreditCard,
          label: 'Billing',
          value: 'Manage payment',
          action: () => console.log('Open billing')
        }
      ]
    },
    {
      title: 'Location & Legal',
      items: [
        {
          icon: MapPin,
          label: 'Default State',
          value: selectedState,
          action: () => console.log('Change state')
        },
        {
          icon: Shield,
          label: 'Privacy Settings',
          value: 'Manage data',
          action: () => console.log('Privacy settings')
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          value: 'Enabled',
          action: () => console.log('Notification settings')
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & FAQ',
          value: 'Get help',
          action: () => console.log('Help center')
        }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xl">U</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-textPrimary">User Account</h2>
            <p className="text-textSecondary">
              {user.subscriptionStatus === 'premium' ? 'Premium Member' : 'Free Account'}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      {user.subscriptionStatus === 'premium' && (
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <Crown className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Premium Active</h3>
              <p className="text-sm opacity-90">
                Expires: {new Date(user.subscriptionExpiry).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Sections */}
      {settingSections.map((section) => (
        <div key={section.title} className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-textPrimary">{section.title}</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {section.items.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-textSecondary" />
                  <span className="text-textPrimary font-medium">{item.label}</span>
                  {item.showBadge && (
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                      Upgrade
                    </span>
                  )}
                </div>
                <span className="text-textSecondary text-sm">{item.value}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Upgrade to Premium</h3>
            
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 text-white mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Crown className="w-6 h-6" />
                <span className="font-semibold text-lg">Premium Plan</span>
              </div>
              <p className="text-2xl font-bold mb-1">$4.99<span className="text-sm font-normal">/month</span></p>
              <p className="text-sm opacity-90">Cancel anytime</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-sm">Unlimited incident recordings</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-sm">AI-powered script generation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-sm">Multi-language support</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-sm">Priority legal updates</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="flex-1 px-4 py-2 text-textSecondary hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubscriptionUpdate('premium')}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Info */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center">
        <p className="text-white/80 text-sm mb-2">KnowYourRights Cards</p>
        <p className="text-white/60 text-xs">Version 1.0.0 • Made with ❤️ for your safety</p>
      </div>
    </div>
  )
}

export default Settings