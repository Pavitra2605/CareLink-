# CareLink Backend

A production-ready Node.js + Express backend for the CareLink healthcare system.

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Ensure `.env` exists with:
    ```
    PORT=3000
    JWT_SECRET=supersecretkey_change_in_production
    DB_PATH=./carelink.db
    NODE_ENV=development
    ```

3.  **Seed Database**
    Populates the database with initial users (Patient, Doctor) and profiles.
    ```bash
    npm run seed
    ```

## Running the Server

Start the development server:
```bash
npm run dev
```
Server runs on `http://localhost:3000`.

## Verification & Testing

### Automated Test Flow
Run the included end-to-end test script to verify all modules (Auth, Triage, Records, etc.):
```bash
npx ts-node src/scripts/test_flow.ts
```

### Manual Testing (Credentials)
- **Patient**: `john@example.com` / `password123`
- **Doctor**: `doctor@example.com` / `password123`

## How to Test Login Manually

### Option 1: Using the automated script
The file `src/scripts/test_flow.ts` already does this for you!
View lines 6-10 to see the login code:
```typescript
const patientLogin = await axios.post(`${BASE_URL}/auth/login`, {
    email: 'john@example.com',
    password: 'password123'
});
```

### Option 2: Using CURL in Terminal
Run this command in your terminal to test login:

**Patient Login:**
```bash
curl -X POST http://localhost:3000/auth/login ^
 -H "Content-Type: application/json" ^
 -d "{\"email\": \"john@example.com\", \"password\": \"password123\"}"
```

**Doctor Login:**
```bash
curl -X POST http://localhost:3000/auth/login ^
 -H "Content-Type: application/json" ^
 -d "{\"email\": \"doctor@example.com\", \"password\": \"password123\"}"
```

If successful, you will receive a JSON response containing a `token`. This token is your "key" to access other endpoints.

## API Endpoints

| Module | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| **Auth** | POST | `/auth/register` | Register new user |
| | POST | `/auth/login` | Login (returns JWT) |
| | GET | `/auth/me` | Get current user info |
| **Triage** | POST | `/triage` | Submit symptoms & severity |
| | GET | `/triage/me` | Get my triage logs |
| **Profile** | POST | `/users/profile` | Create patient profile |
| | GET | `/users/me` | Get full profile |
| **Consultation** | POST | `/consultations/request` | Request consultation (Patient) |
| | GET | `/consultations/me` | Get my consultations |
| | PATCH | `/consultations/:id/status` | Update status (Doctor) |
| **Records** | POST | `/records` | Create record (Doctor) |
| | GET | `/records/:patientId` | Get patient records |
| **Emergency** | POST | `/emergency` | Trigger emergency |

## Project Structure
- `src/config`: Database setup
- `src/middleware`: Auth, Role, Error handling
- `src/modules`: Feature-based modules (Controller, Service, Routes)
