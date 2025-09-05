import axios from 'axios'

// Stripe service for handling payments and subscriptions
class StripeService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'
    this.publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  }

  // Initialize Stripe (would use actual Stripe.js in production)
  async initializeStripe() {
    // In production, load Stripe.js
    // const stripe = await loadStripe(this.publishableKey)
    // return stripe
    
    // Mock for demo
    return {
      createPaymentMethod: this.mockCreatePaymentMethod,
      confirmPayment: this.mockConfirmPayment
    }
  }

  // Create subscription for premium features
  async createSubscription(userId, priceId = 'price_premium_monthly') {
    try {
      // Mock API call - in production, this would call your backend
      const response = await this.mockApiCall('/subscriptions', {
        method: 'POST',
        data: {
          userId,
          priceId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`
        }
      })

      return response.data
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw new Error('Failed to create subscription')
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const response = await this.mockApiCall(`/subscriptions/${subscriptionId}`, {
        method: 'DELETE'
      })

      return response.data
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw new Error('Failed to cancel subscription')
    }
  }

  // Get subscription status
  async getSubscriptionStatus(userId) {
    try {
      const response = await this.mockApiCall(`/subscriptions/user/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error getting subscription status:', error)
      return { status: 'free', expiry: null }
    }
  }

  // Process one-time payment for lifetime access
  async processOneTimePayment(userId, amount = 1999) { // $19.99
    try {
      const response = await this.mockApiCall('/payments/one-time', {
        method: 'POST',
        data: {
          userId,
          amount,
          currency: 'usd',
          description: 'KnowYourRights Cards - Lifetime Access'
        }
      })

      return response.data
    } catch (error) {
      console.error('Error processing payment:', error)
      throw new Error('Failed to process payment')
    }
  }

  // Mock API call for demo purposes
  async mockApiCall(endpoint, options = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock responses based on endpoint
    if (endpoint.includes('/subscriptions') && options.method === 'POST') {
      return {
        data: {
          id: 'sub_' + Math.random().toString(36).substr(2, 9),
          status: 'active',
          current_period_end: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
          clientSecret: 'pi_mock_client_secret'
        }
      }
    }

    if (endpoint.includes('/subscriptions/user/')) {
      return {
        data: {
          status: 'free',
          expiry: null,
          subscriptionId: null
        }
      }
    }

    if (endpoint.includes('/payments/one-time')) {
      return {
        data: {
          id: 'pi_' + Math.random().toString(36).substr(2, 9),
          status: 'succeeded',
          clientSecret: 'pi_mock_client_secret'
        }
      }
    }

    return { data: {} }
  }

  // Mock payment method creation
  mockCreatePaymentMethod = async (paymentData) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      paymentMethod: {
        id: 'pm_' + Math.random().toString(36).substr(2, 9)
      }
    }
  }

  // Mock payment confirmation
  mockConfirmPayment = async (clientSecret) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      paymentIntent: {
        status: 'succeeded'
      }
    }
  }
}

export default new StripeService()
