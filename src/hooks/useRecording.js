import { useState, useRef, useCallback, useEffect } from 'react'
import storageService from '../services/storageService'
import pinataService from '../services/pinataService'
import geolocationService from '../services/geolocationService'

export const useRecording = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState([])
  const [recordingTime, setRecordingTime] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)

  // Load recordings from storage on mount
  useEffect(() => {
    const loadRecordings = () => {
      const storedRecordings = storageService.getRecordings()
      setRecordings(storedRecordings)
    }
    
    loadRecordings()
  }, [])

  const startRecording = useCallback(async (type = 'audio', notes = '') => {
    try {
      const constraints = {
        audio: true,
        video: type === 'video'
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      // Determine the best supported MIME type
      let mimeType = type === 'video' ? 'video/webm;codecs=vp9,opus' : 'audio/webm;codecs=opus'
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = type === 'video' ? 'video/webm;codecs=vp8,opus' : 'audio/webm'
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = type === 'video' ? 'video/webm' : 'audio/webm'
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder

      const chunks = []
      startTimeRef.current = new Date()

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const endTime = new Date()
        const duration = Math.floor((endTime - startTimeRef.current) / 1000)
        
        const blob = new Blob(chunks, { type: mimeType })
        
        // Get current location for metadata
        let location = null
        try {
          location = await geolocationService.getCurrentPosition()
        } catch (error) {
          console.warn('Could not get location for recording:', error)
        }

        // Create recording data
        const recordingData = {
          startTime: startTimeRef.current.toISOString(),
          endTime: endTime.toISOString(),
          duration,
          audioType: type === 'audio' ? mimeType : null,
          videoType: type === 'video' ? mimeType : null,
          notes,
          location: location ? {
            latitude: location.latitude,
            longitude: location.longitude,
            city: location.city,
            state: location.state
          } : null,
          metadata: {
            fileSize: blob.size,
            quality: 'standard',
            includeVideo: type === 'video',
            mimeType,
            blob // Store blob temporarily for potential upload
          }
        }

        // Save to local storage first
        const savedRecording = storageService.saveRecording(recordingData)
        
        if (savedRecording) {
          // Update recordings list
          const updatedRecordings = storageService.getRecordings()
          setRecordings(updatedRecordings)

          // Upload to IPFS if user has premium subscription or auto-upload enabled
          const user = storageService.getUser()
          const settings = storageService.getSettings()
          
          if (user.subscriptionStatus === 'premium' || settings.autoUpload) {
            try {
              await uploadRecordingToIPFS(savedRecording.recordId, blob, {
                name: `incident-recording-${savedRecording.recordId}`,
                location: location ? `${location.city}, ${location.state}` : 'unknown',
                duration,
                customData: {
                  userId: user.userId,
                  recordId: savedRecording.recordId
                }
              })
            } catch (error) {
              console.error('Auto-upload failed:', error)
            }
          }
        }
        
        setRecordingTime(0)
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access camera/microphone. Please check permissions.')
      throw error
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  const uploadRecordingToIPFS = useCallback(async (recordId, blob, metadata = {}) => {
    try {
      setIsUploading(true)
      setUploadProgress(0)

      // Create file from blob
      const file = new File([blob], metadata.name || `recording-${recordId}`, {
        type: blob.type
      })

      // Simulate upload progress (since Pinata doesn't provide real-time progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      // Upload to IPFS
      const result = await pinataService.uploadFile(file, metadata)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        // Update recording with IPFS hash
        const updatedRecording = storageService.updateRecording(recordId, {
          ipfsHash: result.ipfsHash,
          filePath: result.gatewayUrl,
          metadata: {
            ...metadata,
            ipfsMetadata: result.metadata,
            uploadedAt: new Date().toISOString()
          }
        })

        if (updatedRecording) {
          // Refresh recordings list
          const updatedRecordings = storageService.getRecordings()
          setRecordings(updatedRecordings)
        }

        return result
      }

      throw new Error('Upload failed')
    } catch (error) {
      console.error('Error uploading recording to IPFS:', error)
      throw error
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [])

  const deleteRecording = useCallback(async (recordingId) => {
    try {
      // Find the recording to get IPFS hash
      const recording = recordings.find(r => r.recordId === recordingId)
      
      // Delete from local storage
      const success = storageService.deleteRecording(recordingId)
      
      if (success) {
        // Update recordings list
        const updatedRecordings = storageService.getRecordings()
        setRecordings(updatedRecordings)

        // Optionally unpin from IPFS if it was uploaded
        if (recording?.ipfsHash) {
          try {
            await pinataService.unpinFile(recording.ipfsHash)
          } catch (error) {
            console.warn('Could not unpin file from IPFS:', error)
          }
        }
      }

      return success
    } catch (error) {
      console.error('Error deleting recording:', error)
      return false
    }
  }, [recordings])

  const updateRecordingNotes = useCallback((recordingId, notes) => {
    const updatedRecording = storageService.updateRecording(recordingId, { notes })
    
    if (updatedRecording) {
      const updatedRecordings = storageService.getRecordings()
      setRecordings(updatedRecordings)
    }
    
    return updatedRecording
  }, [])

  const flagRecording = useCallback((recordingId, isFlagged = true) => {
    const updatedRecording = storageService.updateRecording(recordingId, { isFlagged })
    
    if (updatedRecording) {
      const updatedRecordings = storageService.getRecordings()
      setRecordings(updatedRecordings)
    }
    
    return updatedRecording
  }, [])

  return {
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
  }
}
