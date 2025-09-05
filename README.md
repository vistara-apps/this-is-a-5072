# KnowYourRights Cards

**Instant legal guidance in your pocket, when you need it most.**

A mobile-first web application providing users with instant, location-specific legal rights and guidance during interactions with law enforcement, along with a feature to quickly record incidents.

## 🚀 Features

### Core Features

- **Real-time Rights & Scripts**: Presents concise, mobile-optimized, easy-to-understand legal rights and conversation scripts tailored to the user's current location (or a selected state). Includes English and Spanish language options.

- **Rapid Incident Recording**: A prominent, easily accessible button to quickly start audio and/or video recording of an interaction. Recordings are timestamped, geo-tagged, and securely stored with an option to flag or share.

- **State-Specific Legal Information**: User-selectable or auto-detected (via geolocation) concise summaries of key laws and legal procedures relevant to law enforcement interactions within a specific state.

- **Best Practice & Avoidance Training**: Short, digestible content modules or tips on common mistakes, de-escalation techniques, and best practices for interacting with law enforcement.

- **Shareable Card Generation**: Automatically generates a shareable 'card' (visual summary) of key rights and contact information based on the user's location, which can be easily sent to a trusted contact or shared on social media.

### Premium Features

- Unlimited incident recording storage
- AI-powered script generation
- Multi-language support
- Priority legal updates
- IPFS decentralized storage
- Advanced analytics

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Local Storage
- **APIs**: 
  - OpenAI for AI-generated content
  - Stripe for payments
  - Pinata for IPFS storage
  - IP-API for geolocation
- **Storage**: Browser LocalStorage + IPFS
- **Deployment**: Docker ready

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser with MediaRecorder API support

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-5072.git
   cd this-is-a-5072
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# OpenAI API (for AI-generated content)
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# Stripe (for payments)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here

# Pinata (for IPFS storage)
REACT_APP_PINATA_API_KEY=your_pinata_api_key_here
REACT_APP_PINATA_SECRET_KEY=your_pinata_secret_key_here
```

### API Keys Setup

1. **OpenAI API**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Stripe**: Get your publishable key from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. **Pinata**: Get your API keys from [Pinata Dashboard](https://app.pinata.cloud/keys)

## 📱 Usage

### Basic Usage

1. **Location Detection**: Allow location access for state-specific legal information
2. **Browse Rights**: Navigate through different sections (Rights, Scripts, Mistakes to Avoid)
3. **Record Incidents**: Use the prominent record button for audio/video capture
4. **Manage Recordings**: View, annotate, and manage your incident recordings
5. **Customize Settings**: Adjust language, state, and preferences

### Premium Features

- Upgrade to Premium ($4.99/month) for unlimited recordings and AI features
- Purchase Lifetime access ($19.99) for permanent premium features

## 🏗 Architecture

### Data Models

```javascript
// User Entity
{
  userId: "UUID",
  email: "string",
  subscriptionStatus: "free|premium|lifetime",
  subscriptionExpiry: "timestamp",
  preferences: {
    language: "english|spanish",
    defaultState: "state_code",
    autoLocation: boolean
  }
}

// Incident Recording Entity
{
  recordId: "UUID",
  userId: "FK",
  startTime: "timestamp",
  endTime: "timestamp",
  duration: number,
  filePath: "string",
  ipfsHash: "string",
  location: "GeoJSON",
  notes: "text",
  isFlagged: boolean
}
```

### Services

- **StorageService**: Local storage management
- **StripeService**: Payment processing
- **PinataService**: IPFS file storage
- **GeolocationService**: Location detection and state info
- **OpenAIService**: AI content generation

## 🔒 Privacy & Security

- **Local-First**: All data stored locally by default
- **Optional Cloud Backup**: Premium users can backup to IPFS
- **No Tracking**: No analytics or tracking without explicit consent
- **Secure Recording**: Recordings encrypted and geo-tagged
- **GDPR Compliant**: Full data export/import capabilities

## 🚢 Deployment

### Docker Deployment

```bash
# Build the image
docker build -t knowyourrights-cards .

# Run the container
docker run -p 3000:80 knowyourrights-cards
```

### Production Build

```bash
npm run build
```

The `dist` folder contains the production-ready files.

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📚 API Documentation

### OpenAI Integration

The app uses OpenAI for generating state-specific legal content:

```javascript
// Generate rights content
const content = await generateRightsContent(stateCode, language)
```

### Stripe Integration

Payment processing for premium features:

```javascript
// Create subscription
const subscription = await stripeService.createSubscription(userId)

// Process one-time payment
const payment = await stripeService.processOneTimePayment(userId, amount)
```

### Pinata IPFS Integration

Decentralized storage for incident recordings:

```javascript
// Upload file to IPFS
const result = await pinataService.uploadFile(file, metadata)

// Retrieve file from IPFS
const file = await pinataService.getFile(ipfsHash)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Feature Requests**: Submit via GitHub Issues with the "enhancement" label

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Core legal rights information
- ✅ Basic incident recording
- ✅ State-specific content
- ✅ Premium subscription model

### Phase 2 (Planned)
- [ ] Real-time AI legal advice
- [ ] Integration with legal aid organizations
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] Multi-language expansion
- [ ] International legal systems
- [ ] Community-driven content
- [ ] Legal professional network

## 🙏 Acknowledgments

- Legal content reviewed by civil rights attorneys
- UI/UX inspired by emergency response apps
- Built with modern web technologies for maximum accessibility
- Community feedback from civil rights organizations

---

**⚠️ Legal Disclaimer**: This app provides general legal information and should not be considered as legal advice. Always consult with a qualified attorney for specific legal situations.

**🚨 Emergency**: In case of immediate danger, call 911 or your local emergency services.
