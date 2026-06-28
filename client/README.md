# LegacyVault Frontend

The LegacyVault frontend is a React + Vite application for users, successors, and admins. It handles authentication, dashboard workflows, claim submission, and vault access screens while communicating with the backend API through Axios services.

## Tech Stack

- React 19
- Vite
- React Router
- TanStack Query
- Firebase Authentication
- Axios
- Tailwind CSS
- Framer Motion
- React Hook Form
- Zod
- Lucide React

## Folder Structure

```text
src/
|-- app/              # App-level providers
|-- assets/           # Images and static frontend assets
|-- components/       # Shared UI, auth, layout, and dashboard components
|-- constants/        # Route, role, and sidebar constants
|-- contexts/         # Auth context
|-- firebase/         # Firebase client configuration
|-- hooks/            # Custom React hooks
|-- layouts/          # Main, dashboard, admin, and successor layouts
|-- pages/            # Public, auth, dashboard, admin, claim, and successor pages
|-- routes/           # Router and route guards
|-- services/         # API clients by domain
|-- styles/           # Global styles
|-- utils/            # Formatting, storage, and Firebase error helpers
|-- App.jsx
|-- main.jsx
```

## Environment Variables

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

`VITE_API_URL` is optional during local development because the app falls back to `http://localhost:5000/api/v1`.

## Installation

```bash
npm install
```

## Development

Start the Vite dev server:

```bash
npm run dev
```

Default URL:

```text
http://localhost:5173
```

Make sure the backend is running on `http://localhost:5000` or update `VITE_API_URL` to match your backend URL.

## Available Scripts

```bash
npm run dev      # Start local development server
npm run build    # Build production assets
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Main Routes

- `/` - Public home page
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset screen
- `/claim` - Successor claim portal
- `/vault-access` - Released vault access screen
- `/dashboard` - Authenticated user dashboard
- `/dashboard/documents` - Document vault
- `/dashboard/successors` - Successor management
- `/dashboard/verification` - Verification questions
- `/dashboard/final-wishes` - Final wishes
- `/dashboard/future-messages` - Future messages
- `/dashboard/claims` - User claims
- `/dashboard/settings` - Profile and account settings
- `/admin` - Admin claims management
- `/admin/dashboard` - Admin overview
- `/admin/audit-logs` - Audit logs

## API Communication

The shared Axios client lives in `src/services/api.js`.

- Base URL comes from `VITE_API_URL`
- Firebase ID tokens are attached as `Authorization: Bearer <token>`
- Domain-specific service files live in `src/services/`

## Authentication

Firebase client configuration lives in `src/firebase/firebase.config.js`. Missing Firebase environment values are logged in the browser console to make setup issues easier to diagnose.

Protected routes are handled by:

- `src/routes/PrivateRoute.jsx`
- `src/routes/AdminRoute.jsx`
- `src/routes/SuccessorRoute.jsx`

## Build

```bash
npm run build
```

The production output is generated in `dist/`.
