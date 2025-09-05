import React from 'react'
import { Shield, MapPin } from 'lucide-react'

const Header = ({ user, selectedState }) => {
  return (
    <header className="pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-xl">KnowYourRights</h1>
            <p className="text-white/80 text-sm">Legal guidance in your pocket</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg">
          <MapPin className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">{selectedState}</span>
          {user.subscriptionStatus === 'premium' && (
            <div className="w-2 h-2 bg-accent rounded-full"></div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header