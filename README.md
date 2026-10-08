# Poker Ledger Frontend

Frontend client for the Poker Ledger application, built with React and Vite.

The application provides the user interface for authentication, poker sessions, session state, and real-time game updates. It communicates with the Poker Ledger backend through REST APIs and WebSockets.

## Tech Stack

- React 18
- Vite
- React Router
- TanStack Query
- Axios
- JavaScript
- WebSocket

The project uses Vite for development and production builds. TanStack Query is used for managing server state and API data, while Axios handles HTTP communication.

## Application Architecture

The frontend follows a component-based React architecture.

```text
Browser
   |
   v
React Application
   |
   +--------------------+
   |                    |
   v                    v
React Router       Application State
   |                    |
   v                    v
Pages / Components   TanStack Query
   |                    |
   +---------+----------+
             |
             v
          API Layer
             |
        +----+----+
        |         |
        v         v
      Axios    WebSocket
        |         |
        v         v
   REST API    Real-time
        |       Updates
        +----+----+
             |
             v
      Poker Backend
```

The frontend is responsible for presentation and client-side interaction. Business rules and persistent game state are handled by the backend.

## Working Structure

### React Components

The UI is divided into reusable React components.

Components are responsible for:

- Rendering the poker interface
- Handling user interaction
- Displaying session information
- Displaying player information
- Sending user actions to the backend
- Reacting to changes in application state

### Routing

React Router manages navigation between application pages.

The router allows different parts of the application to be represented as separate routes without requiring a full browser page reload.

```text
Browser
   |
   v
React Router
   |
   +-- Authentication pages
   |
   +-- Application pages
   |
   +-- Poker session pages
```

### API Communication

HTTP communication with the backend is handled through Axios.

The base URL is configured through:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

The frontend then uses this base URL when communicating with the backend.

For example:

```text
Frontend
   |
   | HTTP request
   v
Axios
   |
   v
http://localhost:8080/api
   |
   v
Spring Boot Backend
```

### Server State

TanStack Query manages data received from the backend.

It provides:

- API request management
- Query caching
- Request status handling
- Refetching
- Synchronization of server data with React components

This keeps server state separate from ordinary component state.

### Authentication

After successful authentication, the backend provides a JWT.

The frontend stores the JWT in browser local storage and uses it for subsequent authenticated communication with the backend.

The general authentication flow is:

```text
User
 |
 | Login
 v
Frontend
 |
 | POST /auth/login
 v
Backend
 |
 | JWT
 v
Frontend
 |
 | Store JWT
 v
localStorage
```

When the application needs to make an authenticated request, the stored token is used to authenticate the request.

### WebSocket Communication

The frontend uses a WebSocket connection for live updates.

The WebSocket endpoint is derived from:

```env
VITE_API_BASE_URL
```

For the default local configuration:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

the frontend derives the corresponding backend WebSocket endpoint.

The purpose of the WebSocket connection is to receive real-time changes to poker sessions without repeatedly polling the backend.

The communication model is:

```text
Frontend
    |
    | WebSocket connection
    v
Poker Backend
    |
    | Session/game events
    v
Frontend
    |
    v
React UI update
```

This is particularly important for multiplayer sessions where one player's action needs to be reflected on the screens of other connected players.

## Project Structure

The repository is organized as a Vite React application.

```text
Poker-Frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── ...
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

The exact contents of `src` may evolve as the application grows, but the main separation is between UI components, pages, API/data handling, and application logic.

## Environment Configuration

Create the environment file:

```bash
cp .env.example .env
```

The frontend currently requires:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

`VITE_API_BASE_URL` is the base URL of the Poker Backend REST API. The WebSocket URL is derived from this value.

For a deployed backend, for example:

```env
VITE_API_BASE_URL=https://your-backend.example.com/api
```

After changing environment variables, restart the Vite development server.

## Prerequisites

Install:

- Node.js 18 or later
- npm
- Poker Ledger Backend

The repository currently specifies React 18 and Vite dependencies and requires Node.js 18 or later according to its setup documentation.

## Installation

Clone the repository:

```bash
git clone https://github.com/Dark74A/Poker-Frontend.git
cd Poker-Frontend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Make sure `VITE_API_BASE_URL` points to the running backend.

## Running the Application

Start the development server:

```bash
npm run dev
```

Vite will normally start the application at:

```text
http://localhost:5173
```

Open that URL in the browser.

The backend must also be running and its CORS configuration must allow the frontend origin.

For local development, the expected setup is:

```text
Frontend
http://localhost:5173
        |
        | REST + WebSocket
        v
Backend
http://localhost:8080
        |
        v
MongoDB
```

## Production Build

Create a production build:

```bash
npm run build
```

The generated production files are placed in:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

The available npm scripts are defined in `package.json`: `dev`, `build`, and `preview`.

## Frontend and Backend Integration

The frontend is designed to work with the Poker Ledger backend.

The complete application consists of:

```text
Poker Ledger
│
├── Poker Frontend
│   ├── React
│   ├── React Router
│   ├── TanStack Query
│   ├── Axios
│   └── WebSocket client
│
└── Poker Backend
    ├── Spring Boot
    ├── Spring Security
    ├── JWT
    ├── REST API
    ├── WebSocket / STOMP
    └── MongoDB
```

The frontend handles:

```text
UI
Navigation
User interaction
API requests
Client-side authentication state
Server-state caching
Real-time updates
```

The backend handles:

```text
Authentication
Authorization
Poker business logic
Session management
Game state
Persistence
Real-time event processing
```

## Typical Application Flow

A typical user session follows this flow:

```text
1. Start frontend
        |
2. Open application
        |
3. Register / Login
        |
4. Backend returns JWT
        |
5. JWT stored in browser
        |
6. User accesses poker application
        |
7. Frontend requests session data
        |
8. Frontend connects to WebSocket
        |
9. User creates or joins a session
        |
10. Poker actions are sent to backend
        |
11. Backend processes the action
        |
12. Backend broadcasts updated state
        |
13. Frontend receives the update
        |
14. React UI updates
```

## API Configuration

For local development, the default configuration is:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

The backend should therefore be running on:

```text
http://localhost:8080
```

and the frontend on:

```text
http://localhost:5173
```

The backend must allow:

```text
http://localhost:5173
```

in its CORS configuration.

## Troubleshooting

### Backend connection fails

Check that the backend is running and that:

```env
VITE_API_BASE_URL
```

points to the correct backend URL.

### CORS error

Make sure the backend allows the frontend origin:

```text
http://localhost:5173
```

### Authentication does not persist

The frontend stores the JWT session in browser local storage. Check the browser's local storage and verify that the login request completed successfully.

### WebSocket does not connect

Check:

1. The backend is running.
2. `VITE_API_BASE_URL` is correct.
3. The backend WebSocket endpoint is available.
4. The frontend origin is allowed by the backend.
5. The user has successfully authenticated.

### Environment changes are not reflected

Restart Vite after changing `.env`:

```bash
npm run dev
```

Vite reads `VITE_*` variables when the application is started/built.

## Useful Commands

Start development server:

```bash
npm run dev
```

Build production version:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Install dependencies:

```bash
npm install
```

## Related Repository

Backend:

https://github.com/Dark74A/Poker-Backend
