import React, { useState } from 'react'
import { ChevronDown, MapPin } from 'lucide-react'

const StateSelector = ({ selectedState, onStateChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-4 py-3 flex items-center justify-between text-white hover:bg-white/20 transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5" />
          <span className="font-medium">Current State: {selectedState}</span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-modal max-h-60 overflow-y-auto z-50">
          <div className="grid grid-cols-5 gap-1 p-4">
            {states.map((state) => (
              <button
                key={state}
                onClick={() => {
                  onStateChange(state)
                  setIsOpen(false)
                }}
                className={`p-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedState === state
                    ? 'bg-primary text-white'
                    : 'text-textPrimary hover:bg-gray-100'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StateSelector