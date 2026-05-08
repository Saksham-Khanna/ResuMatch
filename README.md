# ResuMatch

ResuMatch is a sophisticated, AI-driven resume optimization platform designed for modern job seekers. It features a high-performance analysis engine that evaluates resumes against job descriptions to provide actionable insights, formatting recommendations, and keyword gap analysis.

## Core Technology Stack

- **Frontend**: React.js with Vite and TailwindCSS for a responsive, high-performance user interface.
- **Backend**: Node.js and Express.js RESTful API.
- **Database**: MongoDB Atlas for persistent storage of user profiles and analysis history.
- **AI/ML**: OpenAI GPT-4o-mini integration for advanced natural language processing.
- **Animations**: Framer Motion for premium, smooth UI interactions.

---

## Project Architecture

```text
ATS-NEW/
├── client/               # Frontend Application
│   ├── src/
│   │   ├── components/   # Reusable UI modules (Charts, Upload, Analysis)
│   │   ├── pages/        # Core views: Landing Page, Dashboard, History
│   │   └── utils/api.js  # Interceptor-based API client
│   ├── tailwind.config.js
│   └── vite.config.js
└── server/               # Backend API
    ├── controllers/      # Business logic handlers
    ├── models/           # Mongoose data schemas
    ├── routes/           # API endpoint definitions
    └── services/         # Core logic: PDF Parsing, ATS Scoring, LLM Integration
```

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- A MongoDB Atlas instance or local MongoDB
- (Optional) OpenAI API Key for advanced AI recommendations

### Installation

1. Install server-side dependencies:
   ```bash
   cd server
   npm install
   ```

2. Install client-side dependencies:
   ```bash
   cd ../client
   npm install
   ```

### Configuration

Copy the example environment file in the server directory:
```bash
cd server
cp .env.example .env
```

Configure your `server/.env` with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Development

Run the backend and frontend services simultaneously:

**Backend Service:**
```bash
cd server
npm run dev
```

**Frontend Service:**
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## Technical Specifications

### Design System
The application utilizes a custom dark-mode design system optimized for readability and professional aesthetics.
- **Primary Palette**: Slate-950 (`#0C0A09`) and Stone-900 (`#1C1917`) for backgrounds.
- **Accent Color**: Orange-500 (`#F97316`) for primary actions and brand identity.

### API Resources

| Method | Endpoint | Functionality |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | Authentication and JWT issuance |
| `POST` | `/api/analysis/analyze` | Resume parsing and analysis |
| `GET`  | `/api/analysis/history` | Paginated retrieval of analysis history |
| `GET`  | `/api/analysis/:id` | Detailed view of a specific analysis record |

---

## Deployment Configuration

### Frontend (Vercel)
The client is optimized for Vercel deployment. Ensure you set the `VITE_API_URL` environment variable to point to your hosted backend.

### Backend (Render)
Configure your Render web service with `node index.js` as the start command and provide the necessary environment variables in the Render dashboard.

---

## Core Dependencies

### Server-Side
- `express`: Core framework for API routing and middleware.
- `mongoose`: MongoDB object modeling.
- `multer` & `pdf-parse`: Binary file handling and text extraction.
- `openai`: Integration with LLM services.

### Client-Side
- `react` & `react-router-dom`: Modern component-based architecture and routing.
- `framer-motion`: Orchestrating complex UI transitions.
- `tailwind-merge`: Managing dynamic CSS styles.
- `lucide-react`: Professional-grade iconography.
