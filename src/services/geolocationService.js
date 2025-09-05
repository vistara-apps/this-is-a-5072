import axios from 'axios'

// Geolocation service for determining user location and state-specific information
class GeolocationService {
  constructor() {
    this.ipApiUrl = 'http://ip-api.com/json'
    this.openMeteoUrl = 'https://geocoding-api.open-meteo.com/v1/search'
  }

  // Get user location using browser geolocation API
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const locationData = await this.reverseGeocode(latitude, longitude)
            resolve({
              latitude,
              longitude,
              accuracy: position.coords.accuracy,
              ...locationData
            })
          } catch (error) {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              city: 'Unknown',
              state: 'CA', // Default to CA
              country: 'US'
            })
          }
        },
        (error) => {
          console.error('Geolocation error:', error)
          // Fallback to IP-based location
          this.getLocationByIP().then(resolve).catch(reject)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  // Get location based on IP address
  async getLocationByIP() {
    try {
      const response = await axios.get(`${this.ipApiUrl}?fields=status,country,countryCode,region,regionName,city,lat,lon,timezone`)
      
      if (response.data.status === 'success') {
        return {
          latitude: response.data.lat,
          longitude: response.data.lon,
          city: response.data.city,
          state: this.getStateCode(response.data.region),
          stateName: response.data.regionName,
          country: response.data.country,
          countryCode: response.data.countryCode,
          timezone: response.data.timezone,
          method: 'ip'
        }
      }

      throw new Error('IP geolocation failed')
    } catch (error) {
      console.error('IP geolocation error:', error)
      // Return default location (California)
      return {
        latitude: 34.0522,
        longitude: -118.2437,
        city: 'Los Angeles',
        state: 'CA',
        stateName: 'California',
        country: 'United States',
        countryCode: 'US',
        method: 'default'
      }
    }
  }

  // Reverse geocode coordinates to get address information
  async reverseGeocode(latitude, longitude) {
    try {
      // Using Open-Meteo geocoding API (free alternative)
      const response = await axios.get(`${this.openMeteoUrl}`, {
        params: {
          latitude,
          longitude,
          count: 1,
          language: 'en',
          format: 'json'
        }
      })

      if (response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0]
        return {
          city: result.name,
          state: this.getStateFromAdmin(result.admin1),
          stateName: result.admin1,
          country: result.country,
          countryCode: result.country_code?.toUpperCase(),
          method: 'geocoding'
        }
      }

      // Fallback to IP-based location if geocoding fails
      return await this.getLocationByIP()
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      // Fallback to IP-based location
      return await this.getLocationByIP()
    }
  }

  // Get state-specific legal information
  async getStateInfo(stateCode) {
    try {
      // In production, this would fetch from a comprehensive legal database
      const stateInfo = this.getStateLegalInfo(stateCode)
      return stateInfo
    } catch (error) {
      console.error('Error getting state info:', error)
      return this.getStateLegalInfo('CA') // Default to California
    }
  }

  // Convert state name to state code
  getStateCode(stateName) {
    const stateMap = {
      'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
      'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
      'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
      'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
      'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
      'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
      'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
      'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
      'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
      'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
      'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
      'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
      'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC'
    }

    return stateMap[stateName] || stateName
  }

  // Get state code from admin area
  getStateFromAdmin(adminArea) {
    // This is a simplified mapping - in production, you'd have a more comprehensive database
    if (adminArea && adminArea.length === 2) {
      return adminArea.toUpperCase()
    }
    return this.getStateCode(adminArea) || 'CA'
  }

  // Get state-specific legal information
  getStateLegalInfo(stateCode) {
    // This would be a comprehensive database in production
    const stateData = {
      'CA': {
        name: 'California',
        recordingLaws: 'One-party consent state - you can record conversations you are part of',
        stopAndIdentify: 'No stop and identify law - you are not required to provide ID unless arrested',
        searchLaws: 'Police need probable cause or warrant to search vehicle',
        specialNotes: 'Strong privacy protections, right to record police in public',
        emergencyNumbers: {
          police: '911',
          civilRights: '(213) 894-2434',
          legalAid: '(213) 640-3200'
        }
      },
      'NY': {
        name: 'New York',
        recordingLaws: 'One-party consent state - you can record conversations you are part of',
        stopAndIdentify: 'No stop and identify law - you are not required to provide ID unless arrested',
        searchLaws: 'Police need probable cause or warrant to search vehicle',
        specialNotes: 'Right to record police in public spaces',
        emergencyNumbers: {
          police: '911',
          civilRights: '(212) 549-2500',
          legalAid: '(212) 577-3300'
        }
      },
      'TX': {
        name: 'Texas',
        recordingLaws: 'One-party consent state - you can record conversations you are part of',
        stopAndIdentify: 'Stop and identify state - must provide name if lawfully arrested',
        searchLaws: 'Police need probable cause or warrant to search vehicle',
        specialNotes: 'Must identify yourself if lawfully detained',
        emergencyNumbers: {
          police: '911',
          civilRights: '(713) 524-5925',
          legalAid: '(713) 228-0732'
        }
      },
      'FL': {
        name: 'Florida',
        recordingLaws: 'Two-party consent state - all parties must consent to recording',
        stopAndIdentify: 'Stop and identify state - must provide name if lawfully detained',
        searchLaws: 'Police need probable cause or warrant to search vehicle',
        specialNotes: 'Stricter recording laws - be careful with audio recording',
        emergencyNumbers: {
          police: '911',
          civilRights: '(305) 358-5001',
          legalAid: '(305) 576-0080'
        }
      }
    }

    return stateData[stateCode] || stateData['CA'] // Default to California
  }

  // Get all US states for dropdown
  getAllStates() {
    return [
      { code: 'AL', name: 'Alabama' },
      { code: 'AK', name: 'Alaska' },
      { code: 'AZ', name: 'Arizona' },
      { code: 'AR', name: 'Arkansas' },
      { code: 'CA', name: 'California' },
      { code: 'CO', name: 'Colorado' },
      { code: 'CT', name: 'Connecticut' },
      { code: 'DE', name: 'Delaware' },
      { code: 'FL', name: 'Florida' },
      { code: 'GA', name: 'Georgia' },
      { code: 'HI', name: 'Hawaii' },
      { code: 'ID', name: 'Idaho' },
      { code: 'IL', name: 'Illinois' },
      { code: 'IN', name: 'Indiana' },
      { code: 'IA', name: 'Iowa' },
      { code: 'KS', name: 'Kansas' },
      { code: 'KY', name: 'Kentucky' },
      { code: 'LA', name: 'Louisiana' },
      { code: 'ME', name: 'Maine' },
      { code: 'MD', name: 'Maryland' },
      { code: 'MA', name: 'Massachusetts' },
      { code: 'MI', name: 'Michigan' },
      { code: 'MN', name: 'Minnesota' },
      { code: 'MS', name: 'Mississippi' },
      { code: 'MO', name: 'Missouri' },
      { code: 'MT', name: 'Montana' },
      { code: 'NE', name: 'Nebraska' },
      { code: 'NV', name: 'Nevada' },
      { code: 'NH', name: 'New Hampshire' },
      { code: 'NJ', name: 'New Jersey' },
      { code: 'NM', name: 'New Mexico' },
      { code: 'NY', name: 'New York' },
      { code: 'NC', name: 'North Carolina' },
      { code: 'ND', name: 'North Dakota' },
      { code: 'OH', name: 'Ohio' },
      { code: 'OK', name: 'Oklahoma' },
      { code: 'OR', name: 'Oregon' },
      { code: 'PA', name: 'Pennsylvania' },
      { code: 'RI', name: 'Rhode Island' },
      { code: 'SC', name: 'South Carolina' },
      { code: 'SD', name: 'South Dakota' },
      { code: 'TN', name: 'Tennessee' },
      { code: 'TX', name: 'Texas' },
      { code: 'UT', name: 'Utah' },
      { code: 'VT', name: 'Vermont' },
      { code: 'VA', name: 'Virginia' },
      { code: 'WA', name: 'Washington' },
      { code: 'WV', name: 'West Virginia' },
      { code: 'WI', name: 'Wisconsin' },
      { code: 'WY', name: 'Wyoming' },
      { code: 'DC', name: 'District of Columbia' }
    ]
  }
}

export default new GeolocationService()
