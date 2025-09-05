import axios from 'axios'

// Pinata service for IPFS storage of incident recordings
class PinataService {
  constructor() {
    this.apiKey = process.env.REACT_APP_PINATA_API_KEY
    this.secretKey = process.env.REACT_APP_PINATA_SECRET_KEY
    this.baseURL = 'https://api.pinata.cloud'
  }

  // Upload file to IPFS via Pinata
  async uploadFile(file, metadata = {}) {
    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append('file', file)

      // Add metadata
      const pinataMetadata = {
        name: metadata.name || `incident-recording-${Date.now()}`,
        keyvalues: {
          timestamp: new Date().toISOString(),
          location: metadata.location || 'unknown',
          duration: metadata.duration || 0,
          type: file.type,
          ...metadata.customData
        }
      }
      formData.append('pinataMetadata', JSON.stringify(pinataMetadata))

      // Pinata options
      const pinataOptions = {
        cidVersion: 1,
        customPinPolicy: {
          regions: [
            { id: 'FRA1', desiredReplicationCount: 2 },
            { id: 'NYC1', desiredReplicationCount: 2 }
          ]
        }
      }
      formData.append('pinataOptions', JSON.stringify(pinataOptions))

      // In production, make actual API call
      if (this.apiKey && this.secretKey) {
        const response = await axios.post(
          `${this.baseURL}/pinning/pinFileToIPFS`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'pinata_api_key': this.apiKey,
              'pinata_secret_api_key': this.secretKey
            }
          }
        )

        return {
          success: true,
          ipfsHash: response.data.IpfsHash,
          pinSize: response.data.PinSize,
          timestamp: response.data.Timestamp,
          gatewayUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
        }
      }

      // Mock response for demo
      return this.mockUpload(file, metadata)
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      throw new Error('Failed to upload file to IPFS')
    }
  }

  // Upload JSON data to IPFS
  async uploadJSON(data, metadata = {}) {
    try {
      const jsonData = {
        ...data,
        uploadedAt: new Date().toISOString()
      }

      // In production, make actual API call
      if (this.apiKey && this.secretKey) {
        const response = await axios.post(
          `${this.baseURL}/pinning/pinJSONToIPFS`,
          jsonData,
          {
            headers: {
              'Content-Type': 'application/json',
              'pinata_api_key': this.apiKey,
              'pinata_secret_api_key': this.secretKey
            }
          }
        )

        return {
          success: true,
          ipfsHash: response.data.IpfsHash,
          pinSize: response.data.PinSize,
          timestamp: response.data.Timestamp,
          gatewayUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
        }
      }

      // Mock response for demo
      return this.mockUploadJSON(data, metadata)
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error)
      throw new Error('Failed to upload JSON to IPFS')
    }
  }

  // Get file from IPFS
  async getFile(ipfsHash) {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)
      return response.data
    } catch (error) {
      console.error('Error retrieving file from IPFS:', error)
      throw new Error('Failed to retrieve file from IPFS')
    }
  }

  // List pinned files
  async listFiles(userId = null) {
    try {
      // In production, make actual API call with filters
      if (this.apiKey && this.secretKey) {
        const response = await axios.get(
          `${this.baseURL}/data/pinList`,
          {
            headers: {
              'pinata_api_key': this.apiKey,
              'pinata_secret_api_key': this.secretKey
            },
            params: {
              status: 'pinned',
              pageLimit: 100,
              ...(userId && { 
                metadata: JSON.stringify({
                  keyvalues: { userId: { value: userId, op: 'eq' } }
                })
              })
            }
          }
        )

        return response.data.rows.map(item => ({
          ipfsHash: item.ipfs_pin_hash,
          name: item.metadata?.name || 'Unknown',
          size: item.size,
          timestamp: item.date_pinned,
          metadata: item.metadata?.keyvalues || {}
        }))
      }

      // Mock response for demo
      return this.mockListFiles(userId)
    } catch (error) {
      console.error('Error listing files:', error)
      return []
    }
  }

  // Unpin file from IPFS
  async unpinFile(ipfsHash) {
    try {
      // In production, make actual API call
      if (this.apiKey && this.secretKey) {
        await axios.delete(
          `${this.baseURL}/pinning/unpin/${ipfsHash}`,
          {
            headers: {
              'pinata_api_key': this.apiKey,
              'pinata_secret_api_key': this.secretKey
            }
          }
        )

        return { success: true }
      }

      // Mock response for demo
      return { success: true }
    } catch (error) {
      console.error('Error unpinning file:', error)
      throw new Error('Failed to unpin file from IPFS')
    }
  }

  // Mock upload for demo purposes
  async mockUpload(file, metadata) {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockHash = 'Qm' + Math.random().toString(36).substr(2, 44)
    
    return {
      success: true,
      ipfsHash: mockHash,
      pinSize: file.size,
      timestamp: new Date().toISOString(),
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${mockHash}`,
      metadata: {
        name: metadata.name || file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      }
    }
  }

  // Mock JSON upload for demo purposes
  async mockUploadJSON(data, metadata) {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const mockHash = 'Qm' + Math.random().toString(36).substr(2, 44)
    
    return {
      success: true,
      ipfsHash: mockHash,
      pinSize: JSON.stringify(data).length,
      timestamp: new Date().toISOString(),
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${mockHash}`
    }
  }

  // Mock file listing for demo purposes
  mockListFiles(userId) {
    const mockFiles = [
      {
        ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
        name: 'incident-recording-2024-01-15.webm',
        size: 2048576,
        timestamp: '2024-01-15T10:30:00Z',
        metadata: {
          location: 'Los Angeles, CA',
          duration: 120,
          type: 'video/webm'
        }
      },
      {
        ipfsHash: 'QmSrPmbaUKA3ZodhzPWZnpFgcPMFWF4QsxXbkWfEptTBJd',
        name: 'incident-recording-2024-01-10.webm',
        size: 1024768,
        timestamp: '2024-01-10T15:45:00Z',
        metadata: {
          location: 'San Francisco, CA',
          duration: 85,
          type: 'audio/webm'
        }
      }
    ]

    return mockFiles
  }
}

export default new PinataService()
