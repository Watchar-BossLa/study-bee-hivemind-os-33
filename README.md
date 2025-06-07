
# 🐝 Study Bee - AI-Powered Learning Platform

> **Mission** — Deliver the world's most adaptive, autonomous, and secure learning OS. Study Bee blends a Python‑first micro‑service architecture, Rust performance kernels, a QuorumForge agent fabric, and cost‑optimised multi‑LLM routing to serve 400+ subjects across school, vocational, professional, and university levels.

## ✨ Latest Features

### 🔬 QuorumForge Analytics Dashboard (NEW!)
Real-time analytics dashboard providing comprehensive insights into the AI tutoring system:

- **Agent Performance Monitoring**: Track response times, accuracy scores, and task completion rates
- **Consensus Pattern Analysis**: Visualize how AI agents reach consensus on learning recommendations
- **Learning Path Effectiveness**: Monitor completion rates and engagement levels across different subjects
- **System Health Monitoring**: Real-time CPU, memory, and error rate tracking
- **Interactive Visualizations**: Charts and graphs powered by Recharts for data exploration

Access the dashboard at `/quorum-analytics` (requires authentication).

## 🚀 Features

### Core Learning Platform
- **AI Tutor** - Personalized tutoring powered by QuorumForge OS agent system
- **Spaced Repetition** - RL-enhanced SM-2+ algorithm for optimal retention
- **Live Sessions** - Collaborative study sessions with real-time features
- **Arena** - Competitive quiz battles with leaderboards
- **OCR Flashcards** - Camera-based flashcard creation from physical materials
- **Analytics** - Comprehensive learning progress tracking

### Advanced AI System
- **QuorumForge OS** - Multi-agent deliberation system for enhanced tutoring
- **Smart LLM Router** - Cost-optimized routing across multiple LLM providers
- **Graph-RAG** - Knowledge graph-enhanced retrieval augmented generation
- **Adaptive Learning** - Real-time difficulty adjustment based on performance

### Technical Excellence
- **Production-Ready** - Comprehensive testing, monitoring, and error handling
- **Accessibility** - WCAG 2.1 AA compliance with full keyboard navigation
- **Performance** - Optimized bundle sizes and Core Web Vitals monitoring
- **Security** - Content Security Policy, XSS protection, and secure authentication
- **Internationalization** - Multi-language support with RTL text direction

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **AI/ML**: OpenAI GPT-4, Local LLMs via vLLM, Hugging Face Transformers
- **State Management**: React Query, Zustand
- **Testing**: Jest, React Testing Library, Playwright
- **Monitoring**: Sentry, Web Vitals, Custom Analytics
- **Deployment**: Vercel, Supabase Edge Functions

## 📊 Analytics & Monitoring

### QuorumForge Analytics
- Real-time agent performance metrics
- Consensus pattern visualization
- Learning effectiveness tracking
- System health monitoring

### Learning Analytics
- Progress tracking across subjects
- Spaced repetition effectiveness
- Study habit analysis
- Performance trends

## 🧪 Testing & Quality

- **Unit Tests**: Jest with >95% coverage target
- **Integration Tests**: React Testing Library
- **E2E Tests**: Playwright for critical user journeys
- **Visual Testing**: Storybook integration
- **Performance Testing**: Lighthouse CI
- **Security Testing**: OWASP compliance

## 🔒 Security & Privacy

- **Authentication**: Supabase Auth with Row Level Security
- **Data Protection**: GDPR, FERPA, COPPA compliance
- **Content Security**: CSP headers and XSS protection
- **Secure Communication**: HTTPS enforcement
- **Privacy**: Minimal data collection with user consent

## 🌐 Accessibility

- **WCAG 2.1 AA** compliance
- **Keyboard Navigation** - Full app navigable without mouse
- **Screen Reader** support with semantic HTML and ARIA
- **Color Contrast** - Meets accessibility standards
- **Focus Management** - Clear focus indicators and logical tab order

## 📱 Cross-Platform Support

- **Web**: Progressive Web App with offline capabilities
- **Mobile**: Responsive design optimized for touch interfaces
- **Desktop**: Full-featured experience across all screen sizes
- **Tablet**: Optimized layouts for tablet interactions

## 🔧 Development

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Supabase account for backend services
- Environment variables (see `.env.example`)

### Quick Start
```bash
# Clone and install
git clone [repository-url]
cd study-bee
npm install

# Set up environment
cp .env.example .env.local
# Add your Supabase credentials

# Start development server
npm run dev
```

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── services/           # API and business logic
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── config/             # Configuration files
```

## 📈 Performance Metrics

- **Lighthouse Score**: >90 across all categories
- **Bundle Size**: <250kB per chunk (gzipped)
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Test Coverage**: >95% lines and branches
- **Uptime**: 99.9% availability target

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Ensure all quality gates pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 and advanced language models
- **Supabase** for backend infrastructure
- **Vercel** for deployment platform
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling

---

**Study Bee** - Empowering learners with AI-driven education technology.
