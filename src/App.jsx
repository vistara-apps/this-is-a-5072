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
import { useAuth } from './hooks/useAuth'

function App() {
  const [activeTab, setActiveTab] = useState('rights')
  const [selectedState, setSelectedState] = useState('CA')

  const { location, requestLocation, setManualLocation } = useLocation()
  const { 
    isRecording, 
    recordings, 
    recordingTime,
    uploadProgress,
    isUploading,
    startRecording, 
    stopRecording, 
    deleteRecording,
    updateRecordingNotes,
    flagRecording,
    uploadRecordingToIPFS
  } = useRecording()
  
  const { 
    user, 
    loading: authLoading, 
    updatePreferences,
    upgradeToPremium,
    cancelSubscription,
    purchaseLifetime,
    hasPremiumAccess
  } = useAuth()

  useEffect(() => {
    // Auto-detect location on app load if user preferences allow
    if (user?.preferences?.autoLocation !== false) {
      requestLocation()
    }
  }, [user, requestLocation])

  useEffect(() => {
    // Update selected state based on detected location or user preference
    if (location?.state) {
      setSelectedState(location.state)
    } else if (user?.preferences?.defaultState) {
      setSelectedState(user.preferences.defaultState)
    }
  }, [location, user])

  const handleStateChange = async (stateCode) => {
    setSelectedState(stateCode)
    
    // Update user preferences if user is available
    if (user) {
      try {
        await updatePreferences({ defaultState: stateCode })
      } catch (error) {
        console.error('Failed to update state preference:', error)
      }
    }
    
    // Set manual location
    const states = [
      { code: 'CA', name: 'California' },
      { code: 'NY', name: 'New York' },
      { code: 'TX', name: 'Texas' },
      { code: 'FL', name: 'Florida' },
      // Add more states as needed
    ]
    
    const state = states.find(s => s.code === stateCode)
    if (state) {
      setManualLocation(stateCode, state.name)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'rights':
        return (
          <RightsCards 
            selectedState={selectedState} 
            user={user} 
            location={location}
          />
        )
      case 'record':
        return (
          <RecordingInterface
            isRecording={isRecording}
            recordingTime={recordingTime}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            selectedState={selectedState}
            location={location}
            user={user}
          />
        )
      case 'records':
        return (
          <MyRecords
            recordings={recordings}
            onDeleteRecording={deleteRecording}
            onUpdateNotes={updateRecordingNotes}
            onFlagRecording={flagRecording}
            onUploadToIPFS={uploadRecordingToIPFS}
            user={user}
            hasPremiumAccess={hasPremiumAccess()}
          />
        )
      case 'settings':
        return (
          <Settings
            user={user}
            selectedState={selectedState}
            onStateChange={handleStateChange}
            onUpdatePreferences={updatePreferences}
            onUpgradeToPremium={upgradeToPremium}
            onCancelSubscription={cancelSubscription}
            onPurchaseLifetime={purchaseLifetime}
            location={location}
            onRefreshLocation={requestLocation}
          />
        )
      default:
        return (
          <RightsCards 
            selectedState={selectedState} 
            user={user} 
            location={location}
          />
        )
    }
  }

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading KnowYourRights Cards...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="gradient-bg min-h-screen">
      <div className="max-w-7xl w-full mx-auto px-5">
        <Header 
          user={user} 
          selectedState={selectedState} 
          location={location}
        />
        <StateSelector
          selectedState={selectedState}
          onStateChange={handleStateChange}
          location={location}
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
