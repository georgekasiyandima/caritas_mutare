# Caritas Mutare - Digital Platform

A modern web application for Caritas Mutare, the Catholic community development organization serving the Diocese of Mutare, Zimbabwe.

## 🎯 Mission

To provide a comprehensive digital platform that showcases Caritas Mutare's community development work, facilitates donations, and serves as a central hub for community engagement and support.

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Material-UI (MUI) v5** - Professional design system
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **i18next** - Internationalization (English/Shona)

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **Helmet** - Security

### Development
- **ESLint & Prettier** - Code quality
- **Jest** - Testing
- **Docker** - Containerization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd caritas_mutare
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
caritas_mutare/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── locales/        # Translation files
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── server/                 # Express.js backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── uploads/            # File upload directory
│   └── package.json
├── docs/                   # Documentation
├── PROJECT_OVERVIEW.md     # Detailed project overview
└── README.md
```

## 🌟 Key Features

- **Multilingual Support** - English and Shona translations
- **Donation System** - Secure online donations
- **Content Management** - Admin panel for content updates
- **Mobile Responsive** - Optimized for all devices
- **Progressive Web App** - App-like mobile experience
- **Security** - Enterprise-level security features

## 🔧 Development Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run install-all` - Install dependencies for all projects

## 🌍 Internationalization

The application supports both English and Shona languages. Translation files are located in `client/src/locales/`.

## 🔐 Environment Variables

Create `.env` files in both `client/` and `server/` directories:

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id
```

### Server (.env)
```
PORT=5000
JWT_SECRET=your-jwt-secret
DATABASE_PATH=./database.sqlite
UPLOAD_PATH=./uploads
```

## 📱 Mobile Support

The application is fully responsive and includes Progressive Web App (PWA) features for mobile devices.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Caritas Mutare for their important community development work
- The Diocese of Mutare for their support
- The local communities served by Caritas Mutare

## 📞 Support

For technical support or questions about this project, please contact the development team.

---

**Caritas Mutare** - Serving the community, building hope, creating change.

