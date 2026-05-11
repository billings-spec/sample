# Billing Application

> Workoutput, Billing and Collection Management System

A complete Node.js/Express application for billing, collection, and workoutput management with a beautiful dashboard UI.

## ✨ Features

- 🚀 Express.js server with RESTful API
- 📊 Beautiful responsive dashboard
- 🏥 Health check endpoint
- 🔧 Easy cross-platform launcher
- 📝 Environment configuration support
- 🔄 Development mode with auto-reload (nodemon)

## 📋 Prerequisites

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

## 🚀 Quick Start

### Option 1: One-Click Launch

**Windows:**
```bash
Double-click start.bat
```

**macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual Launch

```bash
# Install dependencies
npm install

# Start the server
npm start

# Or start in development mode (auto-reload on changes)
npm run dev
```

The application will:
- Install dependencies automatically (if using launcher scripts)
- Start on `http://127.0.0.1:4310/`
- Open your browser automatically (macOS/Linux support)

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Dashboard UI |
| `/api/health` | GET | Service health check |
| `/api/info` | GET | Application information |

### Example API Calls

```bash
# Health check
curl http://127.0.0.1:4310/api/health

# Application info
curl http://127.0.0.1:4310/api/info
```

## 🔧 Configuration

Create a `.env` file in the root directory (copy from `.env.example`):

```env
PORT=4310
NODE_ENV=development
```

## 📦 Project Structure

```
billing-app/
├── server.js           # Express server
├── package.json        # Dependencies and scripts
├── start.bat          # Windows launcher
├── start.sh           # macOS/Linux launcher
├── .env.example       # Environment template
├── .gitignore         # Git ignore rules
├── public/
│   └── index.html     # Dashboard UI
└── README.md          # This file
```

## 🛠️ Development

### Available npm Scripts

```bash
npm start       # Start the production server
npm run dev     # Start with auto-reload (nodemon)
```

### Development Dependencies

- **nodemon** - Auto-restart on file changes

### Production Dependencies

- **express** - Web framework
- **dotenv** - Environment configuration

## 🐛 Troubleshooting

### Node.js not found

**Windows:**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Add Node.js to PATH during installation

**macOS:**
```bash
brew install node
```

**Linux:**
```bash
sudo apt-get install nodejs npm
```

### Port 4310 already in use

Modify the `PORT` in `.env` or set it via environment:

**Windows:**
```batch
set PORT=3000
node server.js
```

**macOS/Linux:**
```bash
PORT=3000 npm start
```

### Dependencies installation fails

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules

# Reinstall
npm install
```

## 📄 License

MIT

## 👨‍💼 Support

For issues or questions, check the GitHub repository or contact the development team.

---

**Created:** 2026-05-11  
**Version:** 1.0.0
