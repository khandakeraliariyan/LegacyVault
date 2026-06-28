# LegacyVault

LegacyVault is a secure digital inheritance platform for preserving important documents, final wishes, future messages, and successor access instructions. It combines a React frontend with an Express/MongoDB backend, Firebase authentication, Cloudinary document storage, and an admin-reviewed claim workflow.

## Problem Statement

Important family, financial, legal, and digital asset information is often scattered across devices, inboxes, cloud drives, and paper folders. When something happens to a person, trusted family members may not know what exists, where to find it, or how to access it safely.

LegacyVault solves this by giving users a private vault where they can organize sensitive records and define a trusted successor. Access is not handed over automatically. A successor must submit a claim, answer verification questions, and wait for admin review before released vault information becomes available.

## Solution Overview

LegacyVault is built around three main experiences:

- **Vault owner experience**: A registered user stores documents, final wishes, future messages, verification questions, and successor details.
- **Successor experience**: A trusted successor can submit a claim and, after approval, access released vault materials.
- **Admin experience**: Admins review claims, approve or reject access, inspect dashboard data, and view audit logs.

The project is designed as a hackathon-ready full-stack MERN-style application with clear module boundaries, authentication, role-based admin protection, file upload support, and a claim verification workflow.

## Project Structure

```text
LegacyVault/
|-- client/   # React + Vite frontend
|-- server/   # Express API, MongoDB models, Firebase Admin integration
|-- LICENSE
|-- README.md
```

## Core Features

- Firebase-backed authentication with protected user and admin areas
- Personal dashboard for documents, successors, verification questions, final wishes, future messages, claims, and settings
- Secure document upload and retrieval through the backend
- Successor management and vault access flow
- Verification questions with hashed answers
- Claim submission and admin approval/rejection workflow
- Audit logging for important vault and claim events

## Feature Details

### Authentication and Profiles

- Users can register and log in through Firebase-backed authentication.
- The backend can create or resolve user records after authentication.
- User profile data includes name, email, profile photo, active status, and role.
- Admin-only areas are protected by backend role middleware.

### Document Vault

Users can upload and manage important documents through the dashboard. Documents are stored through Cloudinary and tracked in MongoDB with metadata such as name, size, extension, resource type, and status.

Supported document categories:

- `IDENTITY`
- `FINANCIAL`
- `PROPERTY`
- `INSURANCE`
- `BUSINESS`
- `DIGITAL_ASSETS`

Document statuses:

- `VERIFIED`
- `ARCHIVED`
- `ACTION_REQUIRED`

### Successor Management

Each vault owner can define a trusted successor with identity and relationship details. A successor record tracks whether access has been granted and when vault access was approved.

Successor statuses:

- `PENDING`
- `ACTIVE`
- `CLAIMED`

### Verification Questions

Vault owners create custom questions that successors must answer during the claim process. Answers are stored as bcrypt hashes, so raw answers are not persisted in the database.

### Final Wishes

Users can write structured final wishes by category:

- `PERSONAL`
- `FAMILY`
- `ASSET`
- `BUSINESS`
- `OTHER`

### Future Messages

Users can create messages intended to be released after a successful claim approval. Messages can be:

- `TEXT`
- `AUDIO`
- `VIDEO`

Each message tracks release state and release time.

### Claim System

The successor claim flow collects claimant identity information, relationship details, NID number, verification answers, and optional identity document data. The system calculates verification results and moves the claim into review.

Claim statuses:

- `PENDING`
- `UNDER_REVIEW`
- `APPROVED`
- `REJECTED`

### Admin Review

Admins can review submitted claims, approve or reject access, and inspect audit logs. Approval grants successor access to released vault data and releases eligible future messages.

### Audit Logging

Important system actions are stored as audit logs with actor, action, entity, entity ID, metadata, and timestamps. This gives the platform a traceable history for sensitive vault and claim events.

## User Roles

LegacyVault currently uses:

- `USER`: Vault owner with access to the personal dashboard
- `ADMIN`: Platform reviewer with access to admin claim management and audit logs

Successor access is represented through successor records and claim verification routes instead of a normal persisted user role.

## End-to-End Workflow

1. A user creates an account and signs in.
2. The user adds important documents to the vault.
3. The user registers a trusted successor.
4. The user creates verification questions.
5. The user writes final wishes and future messages.
6. A successor visits the claim portal.
7. The successor submits identity details and verification answers.
8. The backend scores the verification answers.
9. The claim enters admin review.
10. An admin approves or rejects the claim.
11. If approved, successor vault access is granted.
12. Released documents, wishes, and future messages become available through the vault access flow.

## Tech Stack

**Frontend**

- React 19
- Vite
- React Router
- TanStack Query
- Firebase Web SDK
- Axios
- Tailwind CSS
- Framer Motion

**Backend**

- Node.js
- Express 5
- MongoDB + Mongoose
- Firebase Admin SDK
- Cloudinary
- Multer
- JWT
- Zod

## Architecture

```text
React + Vite Client
        |
        | Axios requests with Firebase/JWT bearer tokens
        v
Express API (/api/v1)
        |
        | Mongoose models and service modules
        v
MongoDB

External services:
- Firebase Authentication for client auth and backend token verification
- Cloudinary for document and profile photo uploads
```

## API Areas

The backend API is mounted under `/api/v1` and is organized by feature module:

- `/auth` - login, registration, Firebase login, current user, profile update, photo upload
- `/successors` - successor CRUD, access status, released vault data
- `/questions` - verification question management
- `/documents` - upload, list, open, download, status update, delete
- `/final-wishes` - final wish CRUD
- `/future-messages` - future message CRUD
- `/claims` - claim submission, verification questions, user claim history
- `/admin` - admin dashboard, pending claims, approvals, rejections, audit logs

## Prerequisites

- Node.js 20 or newer
- npm
- MongoDB connection string
- Firebase project for client authentication
- Firebase Admin service account JSON for the backend
- Cloudinary account for file uploads

## Environment Setup

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Create `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Place the Firebase Admin SDK service account at:

```text
server/firebase/serviceAccountKey.json
```

The repository `.gitignore` already excludes `.env`, `node_modules`, `dist`, and the Firebase service account file.

## Run Locally

Install and start the backend:

```bash
cd server
npm install
npm run dev
```

Install and start the frontend in a second terminal:

```bash
cd client
npm install
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API base: `http://localhost:5000/api/v1`

## Demo Flow

For a complete demo, run both apps and walk through this sequence:

1. Register or log in as a vault owner.
2. Add a successor from the dashboard.
3. Create verification questions.
4. Upload a document and create at least one final wish or future message.
5. Open `/claim` and submit a claim as the successor.
6. Log in as an admin user.
7. Review the claim from the admin area.
8. Approve the claim and check successor vault access from `/vault-access`.

## Security Highlights

- Firebase authentication is used on the frontend and verified by the backend.
- Protected API routes require bearer tokens.
- Admin endpoints require the `ADMIN` role.
- Verification answers are hashed with bcrypt.
- Sensitive files are uploaded through backend-controlled Multer and Cloudinary flows.
- Environment variables and Firebase service account credentials are excluded from Git.
- Audit logs record important claim and vault events.

## Useful Scripts

Frontend:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

Backend:

```bash
npm run dev
npm start
```

## Documentation

- [Frontend README](client/README.md)
- [Backend README](server/README.md)

## Future Improvements

- Email or notification delivery for claim status changes
- Multi-successor support with priority levels
- Scheduled reminders for users to update vault contents
- Two-factor authentication for high-risk actions
- More detailed admin analytics
- Stronger document review and verification workflows

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
