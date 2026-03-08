# 🌾 Smart Farmer – Full Stack Agriculture Assistant

Smart Farmer is a **full-stack web application** that helps farmers make better agricultural decisions using modern technology.
It provides crop recommendations, soil analysis, weather updates, market prices, and government schemes.

---

# 🌐 Live Application

**Frontend (Live App)**
https://smartfamer-forntend.vercel.app

**Backend API**
https://smartfamer-backend.onrender.com

---

# 🚀 Features

* 👨‍🌾 Farmer Registration & Login (JWT Authentication)
* 🌱 Crop Recommendation System
* 🌍 Soil Analysis
* ☁️ Weather Information
* 🦠 Crop Disease Detection
* 💰 Market Price Tracking
* 🏛 Government Schemes Information
* 🤖 AI Chat Assistant for Farmers
* 💧 Irrigation Suggestions
* 📊 Yield Prediction
* 💵 Expense Tracking

---

# 🛠 Tech Stack

### Frontend

* React
* Vite
* Axios
* React Router
* Context API

### Backend

* Node.js
* Express.js
* MongoDB (optional / in-memory fallback)
* JWT Authentication
* REST API

### Deployment

* Frontend → Vercel
* Backend → Render

---

# 📁 Project Structure

```
farmer/
│
├── server/                 # Node.js Backend
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Farmer.js
│   │   ├── Crop.js
│   │   ├── Soil.js
│   │   └── Expense.js
│   └── routes/
│       ├── authRoutes.js
│       ├── cropRoutes.js
│       ├── soilRoutes.js
│       ├── weatherRoutes.js
│       ├── diseaseRoutes.js
│       ├── marketRoutes.js
│       ├── schemeRoutes.js
│       ├── chatRoutes.js
│       ├── irrigationRoutes.js
│       └── yieldRoutes.js
│
└── client/                 # React Frontend
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/
    │   └── utils/
    └── index.html
```

---

# ⚙️ Local Development Setup

## 1️⃣ Clone Repository

```
git clone https://github.com/yourusername/smart-farmer.git
cd smart-farmer
```

---

## 2️⃣ Start Backend

```
cd server
npm install
npm start
```

Backend runs at:

```
http://localhost:5000
```

---

## 3️⃣ Start Frontend

Open a new terminal:

```
cd client
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 🔑 Environment Variables

Create a `.env` file in the **client folder**:

```
VITE_API_URL=https://smartfamer-backend.onrender.com
```

---

# 🌐 API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
```

### Crop & Soil

```
POST /api/crop/recommend
POST /api/soil/analyze
```

### Weather

```
GET /api/weather/current
```

### Disease Detection

```
POST /api/disease/detect
```

### Market Prices

```
GET /api/market/prices
```

### Government Schemes

```
GET /api/schemes/schemes
```

### AI Assistant

```
POST /api/chat
```

### Farming Tools

```
POST /api/expense
POST /api/yield/predict
POST /api/irrigation/suggest
```

---

# 👨‍💻 Author

Developed by **Arthi**

---

# 📜 License

This project is for **educational and learning purposes**.
