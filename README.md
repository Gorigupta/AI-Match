# AI Match – Campus Lost & Found

MERN full-stack project for reporting lost/found campus items and suggesting possible matches.

## Requirements
- Node.js 20+
- MongoDB Atlas account (or local MongoDB)
- VS Code

## Run locally

### 1. Backend
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and fill in `MONGO_URI` and `JWT_SECRET`.
```bash
npm run dev
```
API runs at http://localhost:5000

### 2. Frontend (new terminal)
```bash
cd frontend
npm install
```
Copy `.env.example` to `.env`.
```bash
npm run dev
```
Open the local URL shown by Vite, normally http://localhost:5173.

## Main API routes
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me` (token required)
- GET `/api/items`
- POST `/api/items` (token required)
- GET `/api/items/mine` (token required)
- GET `/api/items/matches` (token required)
- PATCH `/api/items/:id/status` (owner/admin)
- DELETE `/api/items/:id` (owner/admin)
- GET `/api/items/admin/stats` (admin)

## Make an admin account
Register normally, then in MongoDB Atlas open the `users` collection and change that user's `role` field from `student` to `admin`. Do not expose admin role editing in the public frontend.

## Deployment overview
1. Create a MongoDB Atlas database and copy its connection string.
2. Deploy `backend` as a Node web service on Render. Build command: `npm install`; start command: `npm start`. Add `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` environment variables.
3. Deploy `frontend` on Vercel. Set `VITE_API_URL` to `https://YOUR-BACKEND.onrender.com/api`.
4. Set backend `CLIENT_URL` to your Vercel URL and redeploy backend.
5. Test register, login, report submission, search and matches on the live site.

## Image upload note
This starter accepts an optional image URL so the core app works without an upload provider. For production image uploads, connect Cloudinary and add a server-side upload endpoint before presenting file-upload functionality.

## Matching note
The current matching engine is a transparent rule-based similarity score using category, shared words, location and date. It is an AI-inspired matching feature, not a trained machine-learning model. Describe it accurately in your report/presentation.
