import React, { useState, useEffect } from 'react'
import { Shield, MessageCircle, AlertTriangle, Share2, Volume2, Copy } from 'lucide-react'
import { generateRightsContent } from '../services/openaiService'

const RightsCards = ({ selectedState, user }) => {
  const [activeSection, setActiveSection] = useState('rights')
  const [content, setContent] = useState({
    rights: '',
    scripts: '',
    mistakes: '',
    loading: false
  })
  const [language, setLanguage] = useState('english')

  useEffect(() => {
    loadContent()
  }, [selectedState, language])

  const loadContent = async () => {
    setContent(prev => ({ ...prev, loading: true }))
    
    try {
      const newContent = await generateRightsContent(selectedState, language)
      setContent({
        ...newContent,
        loading: false
      })
    } catch (error) {
      console.error('Error loading content:', error)
      setContent(prev => ({ ...prev, loading: false }))
    }
  }

  const sections = [
    { id: 'rights', icon: Shield, label: 'Your Rights', color: 'bg-blue-500' },
    { id: 'scripts', icon: MessageCircle, label: 'Scripts', color: 'bg-green-500' },
    { id: 'mistakes', icon: AlertTriangle, label: 'Avoid These', color: 'bg-orange-500' },
  ]

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Could add toast notification here
  }

  const shareCard = () => {
    const shareData = {
      title: `Legal Rights - ${selectedState}`,
      text: content[activeSection] || 'Know your rights during law enforcement interactions.',
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      copyToClipboard(shareData.text)
    }
  }

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'spanish' ? 'es-ES' : 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-6">
      {/* Language Toggle */}
      <div className="flex justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-1 flex">
          <button
            onClick={() => setLanguage('english')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              language === 'english'
                ? 'bg-white text-textPrimary'
                : 'text-white hover:bg-white/20'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('spanish')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              language === 'spanish'
                ? 'bg-white text-textPrimary'
                : 'text-white hover:bg-white/20'
            }`}
          >
            Español
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="grid grid-cols-3 gap-3">
        {sections.map(({ id, icon: Icon, label, color }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`p-4 rounded-lg transition-all duration-200 ${
              activeSection === id
                ? 'bg-white text-textPrimary shadow-card'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-textPrimary">
              {sections.find(s => s.id === activeSection)?.label} - {selectedState}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => speakText(content[activeSection])}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title="Listen"
              >
                <Volume2 className="w-4 h-4 text-textPrimary" />
              </button>
              <button
                onClick={() => copyToClipboard(content[activeSection])}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title="Copy"
              >
                <Copy className="w-4 h-4 text-textPrimary" />
              </button>
              <button
                onClick={shareCard}
                className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {content.loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          ) : (
            <div className="prose max-w-none">
              <p className="text-textPrimary leading-7 whitespace-pre-line">
                {content[activeSection] || 'Content not available. Please check your connection and try again.'}
              </p>
            </div>
          )}

          {user.subscriptionStatus === 'free' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Free Version:</strong> Upgrade to Premium for unlimited AI-generated scripts, multi-language support, and priority updates.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-white/10 backdrop-blur-lg text-white p-4 rounded-lg hover:bg-white/20 transition-all duration-200">
          <MessageCircle className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm font-medium">Quick Scripts</span>
        </button>
        <button className="bg-white/10 backdrop-blur-lg text-white p-4 rounded-lg hover:bg-white/20 transition-all duration-200">
          <Shield className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm font-medium">Emergency Contacts</span>
        </button>
      </div>
    </div>
  )
}

export default RightsCards