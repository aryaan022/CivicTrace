# CivicTrace 🏛️

**CivicTrace** is a decentralized, consensus-based public auditing ledger built for local Gram Panchayats. The platform connects citizens, village heads (Sarpanchs), and district administrators in a unified cryptographic auditing pipeline to bring complete transparency to grassroots infrastructure projects.

By leveraging mathematical identity verification and real-time community upvotes, CivicTrace prevents budget leakage and ensures public funds are only disbursed for high-quality, verified works.

---

## Key Core Features

### 1. Cryptographic Identity & Verification
* **Mathematical Aadhaar Validation**: Integrates the local **Verhoeff algorithm** (using `aadhaar-validator`) to ensure all entered Aadhaar cards are mathematically valid before allowing registration.
* **Deterministic Privacy Hashing**: Plain text Aadhaar numbers are never stored in the database. Instead, they are formatted and hashed using a secure **SHA-256 HMAC** to generate a unique lookup signature, enforcing one-account-per-citizen rules without compromising identity security.

### 2. Multi-Role Auditing Pipeline
* **Citizens (Auditors)**: 
  * View local village project budgets, contractor details, and active milestones.
  * File quality or execution disputes against specific project tranches.
  * Upvote community disputes to request independent inspections.
* **Village Heads (Sarpanchs)**:
  * Manage local project timelines.
  * Submit geotagged photo proofs or inspection reports for pending milestones.
  * Monitor ongoing citizen disputes and coordinate updates with the district office.
* **District Administrators (Admins)**:
  * Register projects, assign budgets, and define milestone tranches.
  * Act as independent arbitrators to inspect site proofs and mark disputes as resolved.
  * Authorize budget release to contractors.

### 3. The 50% Upvote Automatic Halt Protocol
To prevent tax funds from being wasted on substandard construction, CivicTrace implements a real-time smart halt mechanism:
* The system tracks the total count of registered citizens in each village.
* If a filed dispute receives upvotes from **more than 50% of the village's registered citizens**, the project status automatically switches to **`Halted`**.
* Once a project is halted, further milestone payments are locked.
* The halt is only lifted (returning status to **`Active`**) when the issue is resolved on-site and verified/closed by a District Administrator.

---

## Project Structure

The project is split into a modular backend server and a high-fidelity React frontend client:

```
CIVIC TRACE/
├── models/             # Mongoose database models
│   ├── User.js         # User profiles (Citizen, VillageHead, Admin)
│   ├── Village.js      # Village data & registered citizens counters
│   ├── Project.js      # Projects & milestone tranches
│   └── Ticket.js       # Citizen disputes & upvote registries
├── routes/             # Express routes grouped by role
│   ├── auth.routes.js  # Registration & session logic (Aadhaar validation)
│   ├── user.routes.js  # Citizen dashboard & dispute upvoting
│   ├── village.routes.js # Village Head proof uploads
│   └── admin.routes.js # District Admin dispute resolutions
├── utils/              # Helper functions (Aadhaar validator & HMAC hashing)
├── middleware.js       # isLoggedIn, isVillageHead, and isAdmin auth filters
├── app.js              # Express server entryway
└── Frontend/           # React + Tailwind + Vite client application
```

---

## Technical Stack

* **Backend**: Node.js, Express.js, MongoDB (Mongoose ODM), JSON Web Tokens (JWT), Bcrypt, SHA-256 HMAC.
* **Frontend**: React.js (Hooks & Contexts), Tailwind CSS, Vite.
* **Security & Formatting**: `aadhaar-validator`, `dotenv`.

---

## Quick Start & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas cluster)

### 1. Backend Server Setup
From the project root directory:

1. Install backend dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/civictrace
   JWT_SECRET=your_jwt_secret_key_here
   AADHAAR_SALT=your_hmac_secret_salt_here
   ```

3. Start the backend developer server:
   ```bash
   npm run start
   # or with nodemon:
   nodemon app.js
   ```

### 2. Frontend Client Setup
Navigate into the `Frontend` directory:

1. Install frontend dependencies:
   ```bash
   cd Frontend
   npm install
   ```

2. Start the Vite hot-reloading development server:
   ```bash
   npm run dev
   ```
   *The client runs at `http://localhost:5173`. Vite is configured to proxy `/api` calls directly to the Express backend port `3000`.*

---

## Upcoming Roadmap Updates
* **Geotag Coordinate Verification**: Automatic verification comparing photo metadata coordinates with the project's target location.
* **District Admin Portal UI**: Interface for District Administrators to manage village records, approve budgets, and close dispute tickers.
* **SMS Verification Alerts**: Real-time notifications to villagers when new progress proofs are uploaded by the contractor.
