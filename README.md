<div align="center">

<img src="./frontend/public/logo.png" alt="FinTrack Logo" width="80" />

# FinTrack

### A full-stack expense tracker built with the MERN stack

Track income and expenses, visualize spending patterns, and attach receipts — all in one clean, fast application.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-6366f1?style=for-the-badge&logo=vercel)](https://usefinancetrack.vercel.app)
[![API Health](https://img.shields.io/badge/API-Render-46e3b7?style=for-the-badge&logo=render)](https://fintrack-osdv.onrender.com/api/health)
[![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)

</div>

---

## Screenshots

|                     Dashboard                      |                       Transactions                       |
| :------------------------------------------------: | :------------------------------------------------------: |
| ![Dashboard](./frontend/screenshots/dashboard.png) | ![Transactions](./frontend/screenshots/transactions.png) |

|                     Analytics                      |
| :------------------------------------------------: |
| ![Analytics](./frontend/screenshots/analytics.png) |

|              Add Transaction               |                 Receipt Upload                 |
| :----------------------------------------: | :--------------------------------------------: |
| ![Modal](./frontend/screenshots/modal.png) | ![Receipt](./frontend/screenshots/receipt.png) |

---

## Live Links

| Service                 | URL                                           |
| ----------------------- | --------------------------------------------- |
| 🌐 Frontend (Vercel)    | https://usefinancetrack.vercel.app            |
| ⚙️ Backend API (Render) | https://fintrack-osdv.onrender.com/api/health |

---

## Features

- 🔐 **Authentication** — Secure sign-up and sign-in via Clerk (email, Google, GitHub)
- 💸 **Transaction CRUD** — Add, edit, and delete income and expense transactions
- 🧾 **Receipt uploads** — Attach receipt images stored securely on Cloudinary
- 📊 **Dashboard** — Live summary of total income, expenses, and net balance
- 📈 **Analytics** — Monthly bar chart, category pie chart, and income vs expense trend
- 🔍 **Search & filter** — Filter by type, category, date range, and keyword search
- 📱 **Responsive** — Fully works on mobile, tablet, and desktop
- 🛡️ **Security** — Helmet headers, Arcjet bot protection, and rate limiting

---

## Tech Stack

### Frontend

| Technology      | Purpose                            |
| --------------- | ---------------------------------- |
| React 18 + Vite | UI framework and build tool        |
| Tailwind CSS v4 | Utility-first styling              |
| React Router v7 | Client-side routing                |
| Zustand         | Global state management            |
| Axios           | HTTP client with interceptors      |
| Clerk           | Authentication and user management |
| Recharts        | Interactive data visualization     |
| Lucide React    | Icon library                       |
| React Hot Toast | Toast notifications                |

### Backend

| Technology           | Purpose                          |
| -------------------- | -------------------------------- |
| Node.js + Express v5 | Server framework                 |
| MongoDB + Mongoose   | Database and ODM                 |
| Clerk Express SDK    | JWT verification middleware      |
| Cloudinary           | Receipt image storage and CDN    |
| Multer               | Multipart file upload parsing    |
| Arcjet               | Rate limiting and bot protection |
| Helmet               | HTTP security headers            |
| Morgan               | HTTP request logging             |
| express-rate-limit   | Fallback IP rate limiting        |

---

## Project Structure

```bash
fintrack/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── arcjet.js
│   │   │   ├── cloudinary.js
│   │   │   ├── db.js
│   │   │   └── multer.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── categoryController.js
│   │   │   ├── receiptController.js
│   │   │   └── transactionController.js
│   │   ├── middleware/
│   │   │   ├── arcjetMiddleware.js
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── Category.js
│   │   │   ├── Transaction.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── receiptRoutes.js
│   │   │   └── transactionRoutes.js
│   │   ├── utils/
│   │   │   └── seedCategories.js
│   │   └── app.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── screenshots/
    │   ├── logo.png
    │   ├── dashboard.png
    │   ├── transactions.png
    │   ├── analytics.png
    │   ├── mobile.png
    │   ├── modal.png
    │   └── receipt.png
    ├── src/
    │   ├── components/
    │   ├── layouts/
    │   ├── pages/
    │   ├── services/
    │   ├── store/
    │   └── utils/
    ├── .env.example
    ├── vercel.json
    ├── vite.config.js
    └── package.json
```

---

## API Reference

### Auth

| Method | Endpoint             | Auth Required | Description                       |
| ------ | -------------------- | :-----------: | --------------------------------- |
| POST   | `/api/auth/register` |      No       | Create or verify user in database |
| GET    | `/api/auth/me`       |      Yes      | Get current user profile          |

### Transactions

| Method | Endpoint                                | Auth Required | Description                          |
| ------ | --------------------------------------- | :-----------: | ------------------------------------ |
| GET    | `/api/transactions`                     |      Yes      | List transactions (supports filters) |
| POST   | `/api/transactions`                     |      Yes      | Create a new transaction             |
| GET    | `/api/transactions/:id`                 |      Yes      | Get a single transaction             |
| PUT    | `/api/transactions/:id`                 |      Yes      | Update a transaction                 |
| DELETE | `/api/transactions/:id`                 |      Yes      | Delete a transaction                 |
| GET    | `/api/transactions/summary`             |      Yes      | Total income, expense, balance       |
| GET    | `/api/transactions/summary/monthly`     |      Yes      | Monthly breakdown by year            |
| GET    | `/api/transactions/summary/by-category` |      Yes      | Category breakdown                   |

### Receipts

| Method | Endpoint                               | Auth Required | Description            |
| ------ | -------------------------------------- | :-----------: | ---------------------- |
| POST   | `/api/transactions/:id/upload-receipt` |      Yes      | Upload a receipt image |
| DELETE | `/api/transactions/:id/receipt`        |      Yes      | Delete a receipt image |

### Categories

| Method | Endpoint          | Auth Required | Description                       |
| ------ | ----------------- | :-----------: | --------------------------------- |
| GET    | `/api/categories` |      Yes      | List all categories (auto-seeded) |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account
- Clerk account
- Cloudinary account
- Arcjet account

---

## 1. Clone the repository

```bash
git clone https://github.com/Unish4/fintrack.git
cd fintrack
```

---

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your values:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fintrack?retryWrites=true&w=majority

CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ARCJET_KEY=your_arcjet_key

NODE_ENV=development
PORT=3000

CLIENT_URL=https://usefinancetrack.vercel.app
```

Start the development server:

```bash
npm run dev
```

---

## 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Open `.env` and fill in your values:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
```

Start the development server:

```bash
npm run dev
```

---

## 4. Open the app

Visit:

https://usefinancetrack.vercel.app

---

## Environment Variables

### Backend — `.env.example`

```env
# Database
MONGODB_URI=

# Clerk Authentication
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Arcjet
ARCJET_KEY=

# Server
NODE_ENV=development
PORT=3000

# CORS
CLIENT_URL=https://usefinancetrack.vercel.app
```

### Frontend — `.env.example`

```env
# Backend API
VITE_API_BASE_URL=http://localhost:3000/api

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=
```

---

## Deployment

### Backend → Render

1. Push your backend folder to GitHub
2. Go to Render → New Web Service
3. Connect your GitHub repository
4. Add all environment variables from `.env.example`
5. Set:

```env
NODE_ENV=production
CLIENT_URL=https://usefinancetrack.vercel.app
```

6. Deploy the service
7. Copy your Render URL

### Frontend → Vercel

1. Push your frontend folder to GitHub
2. Import the repository into Vercel
3. Framework preset: Vite
4. Build command:

```bash
npm run build
```

5. Output directory:

```bash
dist
```

6. Add environment variables
7. Set:

```env
VITE_API_BASE_URL=https://fintrack-osdv.onrender.com/api
```

8. Deploy the project

### vercel.json

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Security

| Layer            | Implementation                                                |
| ---------------- | ------------------------------------------------------------- |
| Authentication   | Clerk JWT verification on every protected request             |
| Authorization    | Every DB query filters by `userId`                            |
| Rate limiting    | Arcjet token bucket + express-rate-limit fallback             |
| Bot protection   | Arcjet detectBot blocks scrapers and scanners                 |
| Attack shield    | Arcjet shield blocks SQLi, XSS, and path traversal attempts   |
| HTTP headers     | Helmet sets security headers                                  |
| File validation  | Multer validates MIME types and enforces upload size limits   |
| Input validation | express-validator sanitizes and validates request body fields |
| CORS             | Strict frontend allowlist                                     |
| Secrets          | Environment variables only, never committed to git            |

---

## How It Works

```bash
Browser (React + Vite)
  ├── Clerk
  ├── Zustand
  ├── Axios
  └── Recharts

        ↕ HTTPS

Render (Node.js + Express)
  ├── Helmet
  ├── Morgan
  ├── Rate limiter
  ├── Clerk SDK
  ├── Arcjet
  ├── Multer
  └── Mongoose

        ↕

MongoDB Atlas
Cloudinary
Clerk
```

---

## Scripts

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

---

## Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Commit your changes

```bash
git commit -m "Add your feature"
```

4. Push the branch

```bash
git push origin feature/your-feature
```

5. Open a Pull Request

---

## License

MIT — see `LICENSE` for details.

---

<div align="center">
Made with ❤️ by <a href="https://github.com/Unish4" target="_blank" rel="noreferrer">Unish</a>
<br />

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47a248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06b6d4?logo=tailwindcss&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6c47ff?logo=clerk&logoColor=white)

</div>
