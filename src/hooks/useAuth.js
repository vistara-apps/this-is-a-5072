import { useState, useCallback, useEffect } from 'react'
import storageService from '../services/storageService'
import stripeService from '../services/stripeService'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = storageService.getUser()
        if (userData) {
          // Check subscription status
          const subscriptionStatus = await stripeService.getSubscriptionStatus(userData.userId)
          const updatedUser = {
            ...userData,
            ...subscriptionStatus
          }
          
          storageService.updateUser(updatedUser)
          setUser(updatedUser)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        setError('Failed to load user data')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const signUp = useCallback(async (email, preferences = {}) => {
    setLoading(true)
    setError(null)

    try {
      const userData = {
        email,
        subscriptionStatus: 'free',
        preferences: {
          language: 'english',
          defaultState: 'CA',
          notifications: true,
          autoLocation: true,
          ...preferences
        }
      }

      const newUser = storageService.saveUser(userData)
      setUser(newUser)
      
      return newUser
    } catch (error) {
      console.error('Sign up error:', error)
      setError('Failed to create account')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const signIn = useCallback(async (email) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would authenticate with a backend
      // For demo purposes, we'll just load or create a user
      let userData = storageService.getUser()
      
      if (!userData || userData.email !== email) {
        userData = await signUp(email)
      }

      // Check subscription status
      const subscriptionStatus = await stripeService.getSubscriptionStatus(userData.userId)
      const updatedUser = {
        ...userData,
        ...subscriptionStatus,
        email
      }
      
      storageService.updateUser(updatedUser)
      setUser(updatedUser)
      
      return updatedUser
    } catch (error) {
      console.error('Sign in error:', error)
      setError('Failed to sign in')
      throw error
    } finally {
      setLoading(false)
    }
  }, [signUp])

  const signOut = useCallback(() => {
    setUser(null)
    setError(null)
    // Note: We don't clear all data, just the user session
    // User data and recordings remain for next sign in
  }, [])

  const updateProfile = useCallback(async (updates) => {
    if (!user) {
      throw new Error('No user signed in')
    }

    setLoading(true)
    setError(null)

    try {
      const updatedUser = storageService.updateUser(updates)
      setUser(updatedUser)
      return updatedUser
    } catch (error) {
      console.error('Profile update error:', error)
      setError('Failed to update profile')
      throw error
    } finally {
      setLoading(false)
    }
  }, [user])

  const updatePreferences = useCallback(async (preferences) => {
    if (!user) {
      throw new Error('No user signed in')
    }

    try {
      const updatedUser = storageService.updateUser({
        preferences: {
          ...user.preferences,
          ...preferences
        }
      })
      
      setUser(updatedUser)
      return updatedUser
    } catch (error) {
      console.error('Preferences update error:', error)
      setError('Failed to update preferences')
      throw error
    }
  }, [user])

  const upgradeToPremium = useCallback(async () => {
    if (!user) {
      throw new Error('No user signed in')
    }

    setLoading(true)
    setError(null)

    try {
      const subscription = await stripeService.createSubscription(user.userId)
      
      const updatedUser = storageService.updateUser({
        subscriptionStatus: 'premium',
        subscriptionId: subscription.id,
        subscriptionExpiry: subscription.current_period_end
      })
      
      setUser(updatedUser)
      return subscription
    } catch (error) {
      console.error('Upgrade error:', error)
      setError('Failed to upgrade to premium')
      throw error
    } finally {
      setLoading(false)
    }
  }, [user])

  const cancelSubscription = useCallback(async () => {
    if (!user || !user.subscriptionId) {
      throw new Error('No active subscription')
    }

    setLoading(true)
    setError(null)

    try {
      await stripeService.cancelSubscription(user.subscriptionId)
      
      const updatedUser = storageService.updateUser({
        subscriptionStatus: 'free',
        subscriptionId: null,
        subscriptionExpiry: null
      })
      
      setUser(updatedUser)
      return true
    } catch (error) {
      console.error('Cancel subscription error:', error)
      setError('Failed to cancel subscription')
      throw error
    } finally {
      setLoading(false)
    }
  }, [user])

  const purchaseLifetime = useCallback(async () => {
    if (!user) {
      throw new Error('No user signed in')
    }

    setLoading(true)
    setError(null)

    try {
      const payment = await stripeService.processOneTimePayment(user.userId)
      
      const updatedUser = storageService.updateUser({
        subscriptionStatus: 'lifetime',
        subscriptionId: null,
        subscriptionExpiry: null
      })
      
      setUser(updatedUser)
      return payment
    } catch (error) {
      console.error('Lifetime purchase error:', error)
      setError('Failed to purchase lifetime access')
      throw error
    } finally {
      setLoading(false)
    }
  }, [user])

  const refreshSubscriptionStatus = useCallback(async () => {
    if (!user) return

    try {
      const subscriptionStatus = await stripeService.getSubscriptionStatus(user.userId)
      const updatedUser = storageService.updateUser(subscriptionStatus)
      setUser(updatedUser)
      return updatedUser
    } catch (error) {
      console.error('Refresh subscription error:', error)
    }
  }, [user])

  // Check if user has premium features
  const hasPremiumAccess = useCallback(() => {
    return user && (user.subscriptionStatus === 'premium' || user.subscriptionStatus === 'lifetime')
  }, [user])

  // Check if subscription is expired
  const isSubscriptionExpired = useCallback(() => {
    if (!user || user.subscriptionStatus !== 'premium') return false
    if (!user.subscriptionExpiry) return false
    
    return new Date(user.subscriptionExpiry) < new Date()
  }, [user])

  // Get days until subscription expires
  const getDaysUntilExpiry = useCallback(() => {
    if (!user || user.subscriptionStatus !== 'premium' || !user.subscriptionExpiry) {
      return null
    }
    
    const expiryDate = new Date(user.subscriptionExpiry)
    const today = new Date()
    const diffTime = expiryDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  }, [user])

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updatePreferences,
    upgradeToPremium,
    cancelSubscription,
    purchaseLifetime,
    refreshSubscriptionStatus,
    hasPremiumAccess,
    isSubscriptionExpired,
    getDaysUntilExpiry
  }
}
