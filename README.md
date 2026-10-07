# Poker Ledger Frontend

React 18 and Vite client for Poker Ledger. Requires Node.js 18 or later and npm.

## Setup

```sh
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to the backend API root, including `/api` (for example, `http://localhost:8080/api`). The live-update WebSocket endpoint is derived from this value. Restart Vite after changing environment variables.

## Build

```sh
npm run build
npm run preview
```

The app uses browser local storage for its JWT session. Run the backend and configure its CORS origins to include the frontend origin, normally `http://localhost:5173`.
