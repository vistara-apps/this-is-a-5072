import React from 'react'
import { Home, Mic, FileText, Settings } from 'lucide-react'

const Navigation = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'rights', icon: Home, label: 'Rights' },
    { id: 'record', icon: Mic, label: 'Record' },
    { id: 'records', icon: FileText, label: 'Records' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-around py-2">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                activeTab === id
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation