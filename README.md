# WebIDE - Production Ready Web App Creator

A fullstack platform to create, develop, and deploy production-ready websites, similar to Replit. Build websites directly in your browser with live preview, code execution, and free deployment.

## 🎯 Features

- **Browser-based IDE** - Write HTML, CSS, JavaScript without installation
- **Live Preview** - Real-time code execution with instant feedback
- **Full Stack Support** - Frontend (HTML/CSS/JS) + Backend (Node.js, Python)
- **Project Management** - Create, save, organize, and manage projects
- **User Authentication** - Secure login/signup with JWT
- **Free Deployment** - Deploy websites instantly for free
- **Real-time Collaboration** - Share and collaborate on projects
- **Code Execution Sandbox** - Secure isolated execution environment
- **Database Integration** - Firebase, MongoDB, PostgreSQL support
- **Version Control** - Git integration and history tracking

## 📁 Project Structure

```
web-ide-platform/
├── apps/
│   ├── frontend/              # Next.js 14 + React UI
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── utils/
│   │   │   └── styles/
│   │   ├── package.json
│   │   └── next.config.js
│   │
│   ├── backend/               # Express.js API Server
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── middleware/
│   │   │   └── utils/
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── sandbox-runner/        # Docker-based Code Execution
│       ├── Dockerfile
│       ├── runner.js
│       └── package.json
│
├── packages/
│   ├── shared/                # Shared types & utilities
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   └── package.json
│   │
│   └── config/                # Shared configs
│       ├── eslint.config.js
│       ├── tsconfig.json
│       └── package.json
│
├── infra/
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── kubernetes/
│       └── deployment.yaml
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── DATABASE.md
│
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   └── start.sh
│
├── package.json               # Root workspace config
├── pnpm-workspace.yaml        # Monorepo configuration
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── .gitignore
├── .env.example
└── docker-compose.yml
```

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14
- **UI Library:** React 18
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Editor:** Monaco Editor (VS Code)
- **State Management:** Zustand / Redux
- **HTTP Client:** Axios / Fetch
- **Real-time:** Socket.io

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Zod / Joi
- **Code Execution:** Docker + Node VM

### Database
- **Primary:** PostgreSQL
- **Cache:** Redis
- **File Storage:** AWS S3 / Cloudinary
- **Real-time DB:** Firebase (optional)

### DevOps & Deployment
- **Containerization:** Docker
- **Orchestration:** Docker Compose, Kubernetes
- **Frontend Hosting:** Vercel, Netlify
- **Backend Hosting:** Railway, Render, Fly.io
- **CI/CD:** GitHub Actions
- **Database Hosting:** Neon, Supabase (free tier)

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/))
- **PostgreSQL** 14+ (or use Docker)
- **Git**
- **pnpm** (recommended): `npm install -g pnpm`

### Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Cyber4tff/web-ide-platform.git
cd web-ide-platform

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Setup database
pnpm run db:setup
pnpm run db:migrate

# 5. Start all services
pnpm run dev
```

### Individual Service Start

```bash
# Frontend only (http://localhost:3000)
cd apps/frontend && pnpm dev

# Backend only (http://localhost:5000)
cd apps/backend && pnpm dev

# Sandbox runner
cd apps/sandbox-runner && pnpm start

# Using Docker Compose (all services)
docker-compose up -d
```

## 🏗 Architecture

### System Design

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                │
│         Browser-based IDE with Live Preview         │
└─────────────────┬───────────────────────────────────┘
                  │ HTTP/WebSocket
┌─────────────────▼───────────────────────────────────┐
│              Backend API (Express.js)               │
│  User Auth, Project Mgmt, Code Execution, Deploy   │
└──┬──────────────┬──────────────┬────────────────────┘
   │              │              │
   ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────────┐
│PostgreSQL│  │  Redis   │  │Docker Sandbox│
│ Database │  │  Cache   │  │  Execution   │
└──────────┘  └──────────┘  └──────────────┘
```

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
POST   /api/auth/logout         - Logout user
GET    /api/auth/profile        - Get current user
POST   /api/auth/refresh        - Refresh JWT token
```

### Projects
```
GET    /api/projects            - List user projects
POST   /api/projects            - Create new project
GET    /api/projects/:id        - Get project details
PUT    /api/projects/:id        - Update project
DELETE /api/projects/:id        - Delete project
POST   /api/projects/:id/deploy - Deploy project
```

### Files
```
GET    /api/projects/:id/files     - List project files
POST   /api/projects/:id/files     - Create file
PUT    /api/projects/:id/files/:fid - Update file
DELETE /api/projects/:id/files/:fid - Delete file
```

### Code Execution
```
POST   /api/execute             - Execute code
POST   /api/preview             - Preview HTML/CSS/JS
GET    /api/deploy/status/:id   - Check deployment status
```

See [API Documentation](./docs/API.md) for detailed specs.

## 🔐 Security Features

- ✅ **Isolated Execution** - Code runs in Docker containers
- ✅ **Rate Limiting** - Prevent abuse with rate limits
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **CORS Protection** - Configured CORS headers
- ✅ **SQL Injection Prevention** - Parameterized queries (Prisma)
- ✅ **XSS Protection** - Content Security Policy headers
- ✅ **CSRF Tokens** - CSRF protection middleware
- ✅ **Input Validation** - Zod schema validation
- ✅ **Environment Variables** - Secure secrets management
- ✅ **HTTPS** - TLS/SSL in production

## 📦 Free Hosting Solutions

| Service | Type | Free Tier | Link |
|---------|------|-----------|------|
| **Vercel** | Frontend Hosting | Unlimited | https://vercel.com |
| **Netlify** | Frontend Hosting | Unlimited | https://netlify.com |
| **Railway** | Backend Hosting | $5/month | https://railway.app |
| **Render** | Backend Hosting | Free (5GB) | https://render.com |
| **Fly.io** | Backend Hosting | Free tier | https://fly.io |
| **Neon** | PostgreSQL DB | Free tier | https://neon.tech |
| **Supabase** | PostgreSQL + Auth | Free tier | https://supabase.com |
| **Cloudinary** | Image Storage | Free tier | https://cloudinary.com |
| **GitHub Pages** | Static Sites | Unlimited | https://pages.github.com |

## 📝 Environment Variables

Create `.env.local` in root:

```env
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/web_ide
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000

# Optional - Cloud Storage
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket

# Optional - Third Party APIs
GITHUB_CLIENT_ID=your_client_id
GOOGLE_CLIENT_ID=your_google_id
```

## 🚢 Deployment

### Deploy Frontend to Vercel

```bash
# Connect GitHub repo to Vercel and auto-deploy
# Or manually:
npm i -g vercel
vercel
```

### Deploy Backend to Railway

```bash
# Install Railway CLI
npm i -g railway

# Login and deploy
railway login
railway link
railway up
```

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 📈 Roadmap

- [x] Project structure setup
- [ ] Frontend UI components (Editor, Preview, Dashboard)
- [ ] Backend API endpoints
- [ ] Database schema & migrations
- [ ] User authentication system
- [ ] Code execution sandbox
- [ ] Real-time collaboration
- [ ] Deployment integration
- [ ] Git version control
- [ ] Database support (MongoDB, Firebase)
- [ ] Team workspaces
- [ ] Plugin system
- [ ] Advanced analytics

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Frontend tests
cd apps/frontend && pnpm test

# Backend tests
cd apps/backend && pnpm test

# Coverage report
pnpm test:coverage
```

## 📖 Documentation

- [Architecture Deep Dive](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🤝 Contributing

We love contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Code style guidelines
- Pull request process
- Development workflow
- Issue reporting

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) file for details.

## 💬 Support & Community

- 📧 Email: support@webide.dev
- 🐛 **Report Bugs:** [GitHub Issues](https://github.com/Cyber4tff/web-ide-platform/issues)
- 💡 **Feature Requests:** [Discussions](https://github.com/Cyber4tff/web-ide-platform/discussions)
- 💬 **Discord Community:** [Join Server](#)

## 🙏 Acknowledgments

Inspired by [Replit](https://replit.com), [Glitch](https://glitch.com), and [CodePen](https://codepen.io).

---

**Made with ❤️ by Cyber4tff**

⭐ If you find this helpful, please give us a star!
