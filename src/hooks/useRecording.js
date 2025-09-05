import { useState, useCallback, useRef } from 'react'

export const useRecording = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState([])
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const startTimeRef = useRef(null)

  const startRecording = useCallback(async (type, notes) => {
    try {
      const constraints = {
        audio: true,
        video: type === 'video'
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks = []
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { 
          type: type === 'video' ? 'video/webm' : 'audio/webm' 
        })
        
        const endTime = new Date().toISOString()
        const duration = Math.floor((new Date() - new Date(startTimeRef.current)) / 1000)
        
        const recording = {
          recordId: crypto.randomUUID(),
          startTime: startTimeRef.current,
          endTime,
          duration,
          audioType: type,
          notes,
          blob,
          isFlagged: false,
          location: 'Current Location' // Would get from location hook
        }

        setRecordings(prev => [recording, ...prev])
        
        // Clean up
        stream.getTracks().forEach(track => track.stop())
      }

      startTimeRef.current = new Date().toISOString()
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access camera/microphone. Please check permissions.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const deleteRecording = useCallback((recordId) => {
    setRecordings(prev => prev.filter(r => r.recordId !== recordId))
  }, [])

  return {
    isRecording,
    recordings,
    startRecording,
    stopRecording,
    deleteRecording
  }
}