import { useState, useCallback } from 'react'

export const useLocation = () => {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const requestLocation = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // First try geolocation API
      if ('geolocation' in navigator) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true
          })
        })

        // In a real app, you'd reverse geocode these coordinates
        // For demo purposes, we'll simulate state detection
        const mockStates = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI']
        const randomState = mockStates[Math.floor(Math.random() * mockStates.length)]
        
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          state: randomState,
          city: 'Demo City'
        })
      } else {
        throw new Error('Geolocation not supported')
      }
    } catch (err) {
      setError(err.message)
      // Fallback to IP-based location (would integrate with a real service)
      setLocation({
        state: 'CA',
        city: 'Unknown',
        method: 'ip'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    location,
    loading,
    error,
    requestLocation
  }
}