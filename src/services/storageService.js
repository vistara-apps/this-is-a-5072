// Local storage service for managing user data and app state
class StorageService {
  constructor() {
    this.prefix = 'knowyourrights_'
  }

  // User data management
  saveUser(userData) {
    try {
      const user = {
        userId: userData.userId || this.generateUserId(),
        email: userData.email || null,
        subscriptionStatus: userData.subscriptionStatus || 'free',
        subscriptionExpiry: userData.subscriptionExpiry || null,
        subscriptionId: userData.subscriptionId || null,
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          language: userData.preferences?.language || 'english',
          defaultState: userData.preferences?.defaultState || 'CA',
          notifications: userData.preferences?.notifications !== false,
          autoLocation: userData.preferences?.autoLocation !== false,
          ...userData.preferences
        }
      }

      localStorage.setItem(`${this.prefix}user`, JSON.stringify(user))
      return user
    } catch (error) {
      console.error('Error saving user data:', error)
      return null
    }
  }

  getUser() {
    try {
      const userData = localStorage.getItem(`${this.prefix}user`)
      if (userData) {
        return JSON.parse(userData)
      }

      // Create default user if none exists
      return this.saveUser({})
    } catch (error) {
      console.error('Error getting user data:', error)
      return this.saveUser({})
    }
  }

  updateUser(updates) {
    try {
      const currentUser = this.getUser()
      const updatedUser = {
        ...currentUser,
        ...updates,
        updatedAt: new Date().toISOString()
      }

      return this.saveUser(updatedUser)
    } catch (error) {
      console.error('Error updating user data:', error)
      return null
    }
  }

  // Incident recordings management
  saveRecording(recordingData) {
    try {
      const recording = {
        recordId: recordingData.recordId || this.generateRecordId(),
        userId: recordingData.userId || this.getUser().userId,
        startTime: recordingData.startTime || new Date().toISOString(),
        endTime: recordingData.endTime || new Date().toISOString(),
        duration: recordingData.duration || 0,
        filePath: recordingData.filePath || null,
        ipfsHash: recordingData.ipfsHash || null,
        audioType: recordingData.audioType || null,
        videoType: recordingData.videoType || null,
        notes: recordingData.notes || '',
        isFlagged: recordingData.isFlagged || false,
        location: recordingData.location || null,
        metadata: {
          fileSize: recordingData.metadata?.fileSize || 0,
          quality: recordingData.metadata?.quality || 'standard',
          deviceInfo: recordingData.metadata?.deviceInfo || this.getDeviceInfo(),
          ...recordingData.metadata
        },
        createdAt: new Date().toISOString()
      }

      const recordings = this.getRecordings()
      recordings.push(recording)
      localStorage.setItem(`${this.prefix}recordings`, JSON.stringify(recordings))

      return recording
    } catch (error) {
      console.error('Error saving recording:', error)
      return null
    }
  }

  getRecordings(userId = null) {
    try {
      const recordingsData = localStorage.getItem(`${this.prefix}recordings`)
      let recordings = recordingsData ? JSON.parse(recordingsData) : []

      // Filter by user ID if provided
      if (userId) {
        recordings = recordings.filter(recording => recording.userId === userId)
      }

      // Sort by creation date (newest first)
      return recordings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch (error) {
      console.error('Error getting recordings:', error)
      return []
    }
  }

  updateRecording(recordId, updates) {
    try {
      const recordings = this.getRecordings()
      const recordingIndex = recordings.findIndex(r => r.recordId === recordId)

      if (recordingIndex === -1) {
        throw new Error('Recording not found')
      }

      recordings[recordingIndex] = {
        ...recordings[recordingIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }

      localStorage.setItem(`${this.prefix}recordings`, JSON.stringify(recordings))
      return recordings[recordingIndex]
    } catch (error) {
      console.error('Error updating recording:', error)
      return null
    }
  }

  deleteRecording(recordId) {
    try {
      const recordings = this.getRecordings()
      const filteredRecordings = recordings.filter(r => r.recordId !== recordId)
      
      localStorage.setItem(`${this.prefix}recordings`, JSON.stringify(filteredRecordings))
      return true
    } catch (error) {
      console.error('Error deleting recording:', error)
      return false
    }
  }

  // App settings and preferences
  saveSettings(settings) {
    try {
      const currentSettings = this.getSettings()
      const updatedSettings = {
        ...currentSettings,
        ...settings,
        updatedAt: new Date().toISOString()
      }

      localStorage.setItem(`${this.prefix}settings`, JSON.stringify(updatedSettings))
      return updatedSettings
    } catch (error) {
      console.error('Error saving settings:', error)
      return null
    }
  }

  getSettings() {
    try {
      const settingsData = localStorage.getItem(`${this.prefix}settings`)
      if (settingsData) {
        return JSON.parse(settingsData)
      }

      // Return default settings
      const defaultSettings = {
        theme: 'light',
        language: 'english',
        defaultState: 'CA',
        autoLocation: true,
        notifications: true,
        recordingQuality: 'high',
        autoUpload: false,
        createdAt: new Date().toISOString()
      }

      this.saveSettings(defaultSettings)
      return defaultSettings
    } catch (error) {
      console.error('Error getting settings:', error)
      return {}
    }
  }

  // Cache management for API responses
  saveToCache(key, data, expiryMinutes = 60) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + (expiryMinutes * 60 * 1000)
      }

      localStorage.setItem(`${this.prefix}cache_${key}`, JSON.stringify(cacheData))
      return true
    } catch (error) {
      console.error('Error saving to cache:', error)
      return false
    }
  }

  getFromCache(key) {
    try {
      const cacheData = localStorage.getItem(`${this.prefix}cache_${key}`)
      if (!cacheData) return null

      const parsed = JSON.parse(cacheData)
      
      // Check if cache has expired
      if (Date.now() > parsed.expiry) {
        this.removeFromCache(key)
        return null
      }

      return parsed.data
    } catch (error) {
      console.error('Error getting from cache:', error)
      return null
    }
  }

  removeFromCache(key) {
    try {
      localStorage.removeItem(`${this.prefix}cache_${key}`)
      return true
    } catch (error) {
      console.error('Error removing from cache:', error)
      return false
    }
  }

  // Clear all app data
  clearAllData() {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error('Error clearing all data:', error)
      return false
    }
  }

  // Utility functions
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  generateRecordId() {
    return 'rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timestamp: new Date().toISOString()
    }
  }

  // Export/Import functionality for data portability
  exportData() {
    try {
      const data = {
        user: this.getUser(),
        recordings: this.getRecordings(),
        settings: this.getSettings(),
        exportedAt: new Date().toISOString(),
        version: '1.0'
      }

      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('Error exporting data:', error)
      return null
    }
  }

  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData)
      
      if (data.user) {
        this.saveUser(data.user)
      }

      if (data.recordings && Array.isArray(data.recordings)) {
        localStorage.setItem(`${this.prefix}recordings`, JSON.stringify(data.recordings))
      }

      if (data.settings) {
        this.saveSettings(data.settings)
      }

      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  // Get storage usage statistics
  getStorageStats() {
    try {
      let totalSize = 0
      let itemCount = 0
      const breakdown = {}

      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          const value = localStorage.getItem(key)
          const size = new Blob([value]).size
          totalSize += size
          itemCount++

          const category = key.replace(this.prefix, '').split('_')[0]
          breakdown[category] = (breakdown[category] || 0) + size
        }
      })

      return {
        totalSize,
        itemCount,
        breakdown,
        formattedSize: this.formatBytes(totalSize)
      }
    } catch (error) {
      console.error('Error getting storage stats:', error)
      return { totalSize: 0, itemCount: 0, breakdown: {}, formattedSize: '0 B' }
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

export default new StorageService()
