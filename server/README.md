# LegacyVault Backend

The LegacyVault backend is a Node.js and Express API for secure digital inheritance workflows. It manages users, successors, verification questions, document uploads, final wishes, future messages, claims, admin review, and audit logs.

## Tech Stack

- Node.js
- Express 5
- MongoDB + Mongoose
- Firebase Admin SDK
- Cloudinary
- Multer
- JWT
- bcryptjs
- Zod
- dotenv
- morgan

## Folder Structure

```text
src/
|-- config/        # Database, Firebase, Cloudinary, and Multer config
|-- constants/     # Shared constants such as roles
|-- middlewares/   # Auth, role, and error middleware
|-- modules/       # Feature modules
|   |-- admin/
|   |-- audit/
|   |-- auth/
|   |-- claim/
|   |-- document/
|   |-- finalWish/
|   |-- futureMessage/
|   |-- question/
|   |-- successor/
|   |-- user/
|-- routes/        # API route registration
|-- app.js         # Express app setup
|-- server.js      # Server bootstrap and MongoDB connection
```

## Environment Variables

Create a `.env` file inside `server/`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Add the Firebase Admin SDK service account file at:

```text
server/firebase/serviceAccountKey.json
```

This file is required by `src/config/firebase.js` and should never be committed.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

The API base path is:

```text
http://localhost:5000/api/v1
```

## Production Start

```bash
npm start
```

## API Health Check

```http
GET /
```

Response:

```json
{
  "success": true,
  "message": "LegacyVault API Running"
}
```

## API Routes

All module routes are mounted under `/api/v1`.

### Auth

- `POST /auth/firebase-login`
- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`
- `PATCH /auth/me`
- `PATCH /auth/me/photo`

### Successors

- `POST /successors`
- `GET /successors/my-successor`
- `PATCH /successors`
- `DELETE /successors`
- `GET /successors/access`
- `GET /successors/vault`

### Verification Questions

- `POST /questions`
- `GET /questions`
- `DELETE /questions/:id`

### Documents

- `POST /documents`
- `GET /documents`
- `GET /documents/:id/open`
- `GET /documents/:id/download`
- `PATCH /documents/:id/status`
- `DELETE /documents/:id`

### Final Wishes

- `POST /final-wishes`
- `GET /final-wishes`
- `PATCH /final-wishes/:id`
- `DELETE /final-wishes/:id`

### Future Messages

- `POST /future-messages`
- `GET /future-messages`
- `PATCH /future-messages/:id`
- `DELETE /future-messages/:id`

### Claims

- `GET /claims/verification-questions`
- `GET /claims/mine`
- `POST /claims/submit`

### Admin

- `GET /admin/dashboard`
- `GET /admin/claims`
- `PATCH /admin/claims/:id/approve`
- `PATCH /admin/claims/:id/reject`
- `GET /admin/audit-logs`

## Authentication and Authorization

- Firebase-authenticated users can log in through `/auth/firebase-login`
- Email/password login and registration are also exposed through backend auth routes
- Protected routes use `Authorization: Bearer <token>`
- Admin routes require the `ADMIN` role
- Role constants are defined in `src/constants/roles.js`

## Claim Workflow

1. A user registers and creates their vault.
2. The user adds a successor, verification questions, documents, final wishes, and future messages.
3. A successor submits a claim and answers verification questions.
4. The system scores the verification answers.
5. The claim enters admin review.
6. An admin approves or rejects the claim.
7. Approved claims unlock released vault access for the successor.

## Security Notes

- Verification answers are hashed with bcrypt.
- Firebase Admin verifies Firebase-authenticated users.
- API routes use auth and role middleware where required.
- Uploaded files are handled through Multer and Cloudinary.
- Important events are recorded through audit logs.

## Scripts

```bash
npm run dev   # Start with nodemon
npm start     # Start with node
```
