import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import RightsCards from './components/RightsCards'
import RecordingInterface from './components/RecordingInterface'
import MyRecords from './components/MyRecords'
import Settings from './components/Settings'
import StateSelector from './components/StateSelector'
import { useLocation } from './hooks/useLocation'
import { useRecording } from './hooks/useRecording'

function App() {
  const [activeTab, setActiveTab] = useState('rights')
  const [selectedState, setSelectedState] = useState('CA')
  const [user, setUser] = useState({
    subscriptionStatus: 'free',
    subscriptionExpiry: null
  })

  const { location, requestLocation } = useLocation()
  const { 
    isRecording, 
    recordings, 
    startRecording, 
    stopRecording, 
    deleteRecording 
  } = useRecording()

  useEffect(() => {
    // Auto-detect location on app load
    requestLocation()
  }, [])

  useEffect(() => {
    // Update selected state based on detected location
    if (location?.state) {
      setSelectedState(location.state)
    }
  }, [location])

  const renderContent = () => {
    switch (activeTab) {
      case 'rights':
        return <RightsCards selectedState={selectedState} user={user} />
      case 'record':
        return (
          <RecordingInterface
            isRecording={isRecording}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            selectedState={selectedState}
          />
        )
      case 'records':
        return (
          <MyRecords
            recordings={recordings}
            onDeleteRecording={deleteRecording}
            user={user}
          />
        )
      case 'settings':
        return (
          <Settings
            user={user}
            setUser={setUser}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
          />
        )
      default:
        return <RightsCards selectedState={selectedState} user={user} />
    }
  }

  return (
    <div className="gradient-bg min-h-screen">
      <div className="max-w-7xl w-full mx-auto px-5">
        <Header user={user} selectedState={selectedState} />
        <StateSelector
          selectedState={selectedState}
          onStateChange={setSelectedState}
        />
        <main className="pb-20">
          {renderContent()}
        </main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}

export default App