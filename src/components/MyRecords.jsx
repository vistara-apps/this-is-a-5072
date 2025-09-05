import React, { useState } from 'react'
import { Play, Download, Trash2, Calendar, MapPin, FileText, Clock } from 'lucide-react'

const MyRecords = ({ recordings, onDeleteRecording, user }) => {
  const [selectedRecording, setSelectedRecording] = useState(null)

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (duration) => {
    const mins = Math.floor(duration / 60)
    const secs = duration % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (recordings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
          <FileText className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Recordings Yet</h3>
          <p className="text-white/80 mb-6">
            Your incident recordings will appear here. Use the Record tab to start your first recording.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold text-white mb-2">My Recordings</h2>
        <p className="text-white/80 text-sm">
          {recordings.length} recording{recordings.length !== 1 ? 's' : ''} stored securely
        </p>
      </div>

      {user.subscriptionStatus === 'free' && recordings.length >= 3 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Storage Limit:</strong> Free accounts can store up to 3 recordings. 
            Upgrade to Premium for unlimited storage.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {recordings.map((recording) => (
          <div key={recording.recordId} className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      recording.audioType === 'video' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {recording.audioType === 'video' ? 'Video' : 'Audio'}
                    </span>
                    {recording.isFlagged && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        Flagged
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-textSecondary">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(recording.startTime)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(recording.duration || 0)}</span>
                    </div>
                    
                    {recording.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{recording.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {recording.notes && (
                    <p className="mt-2 text-sm text-textPrimary">{recording.notes}</p>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedRecording(recording)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Play"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  
                  <button
                    className="p-2 text-textSecondary hover:bg-gray-100 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => onDeleteRecording(recording.recordId)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recording Player Modal */}
      {selectedRecording && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Recording Playback</h3>
            
            <div className="bg-gray-100 rounded-lg p-8 text-center mb-4">
              <Play className="w-16 h-16 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Media player would be implemented here
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedRecording(null)}
                className="px-4 py-2 text-textSecondary hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyRecords