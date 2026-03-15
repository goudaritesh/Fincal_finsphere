# FinSphere AI 🚀
### *Smart Investing, Simplified*

**FinSphere AI** is a comprehensive financial ecosystem designed to empower beginner investors. It features a **Premium Web Portal** for deep analysis and a **High-Performance Mobile App** for on-the-go planning.

---

## 🌐 Deployed Links
| Platform | Link | Hosted On |
| :--- | :--- | :--- |
| **Investor Web Portal** | [Live Website](https://fincal-finsphere-bh3u.vercel.app/) | Vercel |
| **Mobile App (APK)** | [Download App](https://github.com/goudaritesh/Fincal_finsphere/releases/download/v1.0.0/app-release.apk) | GitHub Releases |
| **Market API** | [API Status](https://fincal-finsphere.onrender.com/api/market-indices) | Render |
| **AI Agent Service** | [AI Health](https://fincal-finsphere-1.onrender.com/health) | Render |

---

## 📱 App vs 🌐 Website
| Feature | **Mobile App (Flutter)** | **Web Portal (Next.js)** |
| :--- | :--- | :--- |
| **Primary Use** | Quick calculations & notifications | Deep-dive planning & portfolios |
| **Animation Style** | Smooth Flutter Hero transitions | Staggered Framer Motion effects |
| **Market Data** | Real-time price alerts | Interactive charts & analysis |
| **Offline Support** | Available for basic calculators | Always live-synced |
| **Best For** | On-the-go accessibility | Desktop research & education |

---

## ✨ Key Features
- **🤖 Gemini 2.0 AI Integration**: Contextual financial advice embedded in every tool.
- **📊 Dynamic Market Engine**: Real-time fetching of NIFTY 50, Gainers, and Losers.
- **🧮 8+ Financial Calculators**: SIP, SWP, Goal, Salary, Top-Up, and more.
- **📚 Investor Education**: AI explaining concepts like the 50-30-20 rule and compounding.
- **💎 Premium Design**: Glassmorphism, dark mode, and vibrant financial aesthetics.

---

## 🚀 Deployment Guide

### 1. Web Frontend (Vercel)
- **Directory**: `frontend`
- **Framework**: Next.js
- **Env Vars**: 
  - `NEXT_PUBLIC_API_URL`: URL of your deployed Node backend.

### 2. Node Backend (Render)
- **Directory**: `backend_node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Env Vars**: 
  - `AI_AGENT_URL`: URL of your deployed Python AI Agent.
  - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Database credentials.

### 3. AI Agent (Render)
- **Directory**: `ai_agent_python`
- **Runtime**: Python 3
- **Start Command**: `python main.py` or `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Env Vars**: 
  - `GEMINI_API_KEY`: Your Google AI Studio key.

---

## 🛠 Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion
- **Mobile App**: Flutter 3.x, Dart
- **Backend**: Node.js, Express (API Gateway)
- **AI Engine**: Python, FastAPI (Gemini 2.0 Integration)
- **Database**: MySQL (Hosted on PlanetScale/Aiven/Render)

---

## 🛡 Disclaimer
FinSphere AI is an educational tool. It provides general investment strategies. It **does not** promote specific schemes or provide direct buy/sell recommendations.

---
Created for **IIT BHU FinCal Innovation Hackathon 2026** 🎓
