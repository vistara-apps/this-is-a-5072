import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, Video, Camera, Clock, MapPin } from 'lucide-react'

const RecordingInterface = ({ isRecording, onStartRecording, onStopRecording, selectedState }) => {
  const [recordingType, setRecordingType] = useState('audio')
  const [recordingTime, setRecordingTime] = useState(0)
  const [notes, setNotes] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
      setRecordingTime(0)
    }

    return () => clearInterval(timerRef.current)
  }, [isRecording])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartRecording = () => {
    onStartRecording(recordingType, notes)
  }

  const handleStopRecording = () => {
    onStopRecording()
    setNotes('')
  }

  return (
    <div className="space-y-6">
      {/* Recording Status */}
      {isRecording && (
        <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-destructive rounded-full recording-pulse"></div>
              <span className="text-white font-medium">Recording in progress</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-lg">{formatTime(recordingTime)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recording Type Selection */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">Record Incident</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setRecordingType('audio')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              recordingType === 'audio'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 text-textSecondary hover:border-gray-300'
            }`}
          >
            <Mic className="w-8 h-8 mx-auto mb-2" />
            <span className="block text-sm font-medium">Audio Only</span>
          </button>
          
          <button
            onClick={() => setRecordingType('video')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              recordingType === 'video'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 text-textSecondary hover:border-gray-300'
            }`}
          >
            <Video className="w-8 h-8 mx-auto mb-2" />
            <span className="block text-sm font-medium">Audio + Video</span>
          </button>
        </div>

        {/* Location Info */}
        <div className="flex items-center space-x-2 text-textSecondary mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Location will be automatically recorded ({selectedState})</span>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-textPrimary mb-2">
            Optional Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any relevant details about the situation..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={3}
            disabled={isRecording}
          />
        </div>

        {/* Recording Button */}
        <div className="text-center">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="bg-destructive hover:bg-destructive/90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                {recordingType === 'audio' ? (
                  <Mic className="w-6 h-6" />
                ) : (
                  <Camera className="w-6 h-6" />
                )}
                <span>Start Recording</span>
              </div>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <Square className="w-6 h-6" />
                <span>Stop & Save</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">Important Notice</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Check local laws regarding recording in your state</li>
          <li>• Inform others if legally required in your jurisdiction</li>
          <li>• Keep your device secure and accessible</li>
          <li>• Recordings are stored securely and encrypted</li>
        </ul>
      </div>

      {/* Quick Tips */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
        <h3 className="font-medium text-white mb-3">Recording Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/90">
          <div>
            <strong>Before Recording:</strong>
            <ul className="mt-1 space-y-1">
              <li>• State the date and time clearly</li>
              <li>• Mention your location</li>
              <li>• Keep phone charged</li>
            </ul>
          </div>
          <div>
            <strong>During Recording:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Remain calm and respectful</li>
              <li>• Hold device steady</li>
              <li>• Narrate what's happening</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecordingInterface