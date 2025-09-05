import { useState, useCallback, useEffect } from 'react'
import geolocationService from '../services/geolocationService'
import storageService from '../services/storageService'

export const useLocation = () => {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stateInfo, setStateInfo] = useState(null)

  // Load cached location on mount
  useEffect(() => {
    const loadCachedLocation = () => {
      const cachedLocation = storageService.getFromCache('user_location')
      if (cachedLocation) {
        setLocation(cachedLocation)
        loadStateInfo(cachedLocation.state)
      }
    }

    loadCachedLocation()
  }, [])

  const requestLocation = useCallback(async (forceRefresh = false) => {
    setLoading(true)
    setError(null)

    try {
      // Check cache first unless force refresh
      if (!forceRefresh) {
        const cachedLocation = storageService.getFromCache('user_location')
        if (cachedLocation) {
          setLocation(cachedLocation)
          await loadStateInfo(cachedLocation.state)
          setLoading(false)
          return cachedLocation
        }
      }

      // Get current position using geolocation service
      const locationData = await geolocationService.getCurrentPosition()
      
      // Cache the location for 1 hour
      storageService.saveToCache('user_location', locationData, 60)
      
      setLocation(locationData)
      await loadStateInfo(locationData.state)
      
      return locationData
    } catch (err) {
      console.error('Location error:', err)
      setError(err.message)
      
      // Try IP-based location as fallback
      try {
        const fallbackLocation = await geolocationService.getLocationByIP()
        storageService.saveToCache('user_location', fallbackLocation, 60)
        setLocation(fallbackLocation)
        await loadStateInfo(fallbackLocation.state)
        return fallbackLocation
      } catch (fallbackError) {
        console.error('Fallback location error:', fallbackError)
        
        // Final fallback to default location
        const defaultLocation = {
          latitude: 34.0522,
          longitude: -118.2437,
          city: 'Los Angeles',
          state: 'CA',
          stateName: 'California',
          country: 'United States',
          countryCode: 'US',
          method: 'default'
        }
        
        setLocation(defaultLocation)
        await loadStateInfo(defaultLocation.state)
        return defaultLocation
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const loadStateInfo = useCallback(async (stateCode) => {
    try {
      const info = await geolocationService.getStateInfo(stateCode)
      setStateInfo(info)
      
      // Cache state info for 24 hours
      storageService.saveToCache(`state_info_${stateCode}`, info, 24 * 60)
    } catch (error) {
      console.error('Error loading state info:', error)
    }
  }, [])

  const setManualLocation = useCallback(async (stateCode, stateName) => {
    setLoading(true)
    
    try {
      const manualLocation = {
        city: 'Unknown',
        state: stateCode,
        stateName: stateName,
        country: 'United States',
        countryCode: 'US',
        method: 'manual'
      }
      
      // Cache manual location
      storageService.saveToCache('user_location', manualLocation, 60)
      
      setLocation(manualLocation)
      await loadStateInfo(stateCode)
      
      // Update user preferences
      const user = storageService.getUser()
      storageService.updateUser({
        preferences: {
          ...user.preferences,
          defaultState: stateCode
        }
      })
      
      return manualLocation
    } catch (error) {
      console.error('Error setting manual location:', error)
      setError('Failed to set location')
    } finally {
      setLoading(false)
    }
  }, [])

  const clearLocation = useCallback(() => {
    setLocation(null)
    setStateInfo(null)
    setError(null)
    storageService.removeFromCache('user_location')
  }, [])

  const refreshLocation = useCallback(() => {
    return requestLocation(true)
  }, [requestLocation])

  // Get formatted location string
  const getLocationString = useCallback(() => {
    if (!location) return 'Unknown Location'
    
    if (location.city && location.state) {
      return `${location.city}, ${location.state}`
    }
    
    if (location.state) {
      return location.stateName || location.state
    }
    
    return 'Unknown Location'
  }, [location])

  // Check if location services are available
  const isGeolocationAvailable = useCallback(() => {
    return 'geolocation' in navigator
  }, [])

  // Get location accuracy status
  const getAccuracyStatus = useCallback(() => {
    if (!location || !location.accuracy) return 'unknown'
    
    if (location.accuracy <= 100) return 'high'
    if (location.accuracy <= 1000) return 'medium'
    return 'low'
  }, [location])

  return {
    location,
    stateInfo,
    loading,
    error,
    requestLocation,
    setManualLocation,
    clearLocation,
    refreshLocation,
    loadStateInfo,
    getLocationString,
    isGeolocationAvailable,
    getAccuracyStatus
  }
}
