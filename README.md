# Hostel Management System

A MERN-stack web application for managing hostel operations, student complaints, and administrative activities. The project includes role-based access for students and administrators, authentication, and a responsive web interface.

**Developer:** Dhruv  
**Project status:** In development  
**Technology stack:** MongoDB, Express.js, React.js, Node.js

---

## 1. Project Overview

The Hostel Management System aims to provide a centralized platform for managing hostel-related activities.

### Current Features

- Student registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Student and administrator roles
- Complaint submission and tracking
- Complaint status management for administrators
- Role-based access restrictions
- Responsive UI with a navy-blue and white design
- Dashboard navigation for student and administrator accounts

### Planned / UI Preview Features

The following modules may currently contain sample data and are not necessarily connected to backend APIs:

- Room allocation and room management
- Fee management and payment history
- Notices and announcements
- Leave requests
- Visitor management
- Student directory
- Profile and system settings

**Note:** UI availability does not mean a module is fully implemented or operational. Verify the functionality of each module before testing it.

---

## 2. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Frontend build tool | Vite |
| Routing | React Router |
| Backend | Node.js and Express.js |
| Database | MongoDB |
| Database integration | Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password hashing | bcryptjs |
| Security middleware | Helmet |
| Request rate limiting | express-rate-limit |
| Cross-origin requests | CORS |

---

## 3. Project Structure

```text
hostel-management/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── AppLayout.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ModulePage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── package-lock.json
├── server/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Complaint.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

The structure above describes the expected layout. If files have been added, removed, or renamed during development, use the actual repository structure as the source of truth.

---

## 4. Prerequisites

Install the following software before running the project:

- Node.js and npm
- MongoDB Community Server, or access to an authorized MongoDB instance
- Git
- Visual Studio Code or another code editor
- A modern web browser

Verify Node.js and npm:

```bash
node --version
npm --version
```

Verify Git:

```bash
git --version
```

---

## 5. Installation and Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/Dhruv051105/hostel-management-system.git
cd hostel-management-system
```

### Step 2: Install frontend dependencies

```bash
cd client
npm install
```

### Step 3: Install backend dependencies

Open another terminal, or return to the project root:

```bash
cd server
npm install
```

### Step 4: Configure environment variables

Create a `.env` file inside the `server/` directory.

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hostel_management
JWT_SECRET=REPLACE_WITH_A_STRONG_RANDOM_SECRET
```

Replace the JWT placeholder with a securely generated random secret. Use a separate secret for every environment.

**Security requirements:**

- Never commit `.env` files to GitHub.
- Never put real credentials in this README.
- Do not use production credentials in a test environment.
- Use an isolated test database for cybersecurity testing.
- Share test credentials only through an approved secure channel.

The example MongoDB URI assumes a local MongoDB instance. Configure it appropriately if using a different database host.

### Step 5: Start the backend

From the `server/` directory, run the command configured in `server/package.json`.

For example, if a `dev` script exists:

```bash
npm run dev
```

Otherwise, if the application has a `start` script:

```bash
npm start
```

The backend is expected to listen on port `5000` when configured with the example environment variables.

### Step 6: Start the frontend

From the `client/` directory:

```bash
npm run dev
```

Open the local address displayed by Vite, typically:

http://localhost:5173

### Step 7: Check backend health

When the backend is running, open:

http://localhost:5000/api/health

A successful response should indicate that the health endpoint is available. Confirm database connectivity separately; an HTTP health response alone does not necessarily prove every database operation is working.

---

## 6. Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Backend listening port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |

The exact variables required depend on the current backend implementation.

Never publish actual environment values in GitHub issues, screenshots, reports, or this document.

---

## 7. Application Roles

### Student

Students can:

- Register an account
- Log in and log out
- Submit complaints
- View their own complaints
- Access student-facing dashboard pages

### Administrator

Administrators can:

- View complaints across students
- Update complaint status
- Access administrator-facing pages
- View administrative UI sections

Administrator privileges should be assigned only through an authorized process. Public registration is intended for student accounts; an ordinary user must not be able to grant themselves administrator privileges.

The actual permissions available should be verified against the current backend and frontend code.

---

## 8. API Reference

Base URL for local development:

```text
http://localhost:5000/api
```

### Authentication

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| GET | `/health` | Health check | No |
| POST | `/auth/register` | Register a student | No |
| POST | `/auth/login` | Authenticate a user | No |
| GET | `/auth/me` | Retrieve authenticated user information | Bearer token |

### Complaints

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| POST | `/complaints` | Submit a complaint | Required |
| GET | `/complaints` | List permitted complaints | Required |
| PATCH | `/complaints/:id/status` | Update complaint status | Administrator only |

For authenticated requests, the expected header is:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

The token is obtained through the login endpoint. Do not include real tokens in reports or commit them to the repository.

### Complaint Fields

A complaint includes fields such as:

- Title
- Description
- Category
- Status
- Student reference
- Creation and update timestamps

The currently implemented categories include Maintenance, Cleanliness, Electrical, and Other.

The available statuses are Pending, In Progress, and Resolved.

### API Testing

Use a tool such as Postman, Insomnia, or an approved security-testing tool. Use only test accounts and test data in the authorized environment.

---

## 9. Security Controls Implemented

The current implementation includes the following controls, which should be verified during testing:

- Password hashing using bcryptjs
- JWT-based authentication
- Authentication middleware for protected routes
- Role-based restrictions for administrator operations
- Server-side validation of selected request fields
- Helmet security middleware
- CORS configuration for the development frontend origin
- Request rate limiting
- Mongoose models and schema validation
- Restricted login and registration attempts
- Session data stored in browser `sessionStorage`

These controls are not proof that the application is secure. Their correctness, completeness, configuration, and resistance to bypass must be assessed independently.

### Known Areas Requiring Review

The following areas should be assessed rather than assumed secure:

- JWT expiry, validation, secret strength, and invalid-token handling
- Authorization enforcement on every protected API route
- Broken access control and horizontal/vertical privilege escalation
- Authentication rate-limit effectiveness
- Input validation and NoSQL injection resistance
- CORS and security-header configuration
- Error messages and sensitive information disclosure
- Password policy and account enumeration
- Token exposure risks associated with browser storage
- Dependency vulnerabilities
- Database access controls and network exposure
- Logging, monitoring, and incident handling
- Deployment configuration, HTTPS, and production secrets
- Automated tests and regression coverage

---

## 10. Cybersecurity Tester Handover

This section is intended for an authorized cybersecurity tester.

### A. Project Information

| Item | Details |
|---|---|
| Application | Hostel Management System |
| Repository | https://github.com/Dhruv051105/hostel-management-system |
| Application type | Web application |
| Architecture | MERN stack |
| Frontend | React with Vite |
| Backend | Express.js on Node.js |
| Database | MongoDB |
| Authentication | JWT |
| Developer / contact | Dhruv |
| Environment under test | To be agreed before testing |
| Test dates | To be agreed |
| Application version / commit | Record the commit hash before testing |

### B. Scope of Testing

Agree on a written scope before testing.

Potential in-scope components, once confirmed by the project owner:

- Frontend routes and role-based navigation
- Authentication and registration endpoints
- Authenticated user information endpoint
- Complaint creation and listing
- Complaint status updates
- Authorization boundaries between students and administrators
- Input validation and error handling
- Rate limiting, security headers, and CORS
- Dependency and configuration review

Explicitly document which hosts, ports, APIs, databases, and environments are in scope.

### C. Recommended Test Scenarios

1. **Authentication:** Test invalid credentials, malformed requests, and token expiry.
2. **Authorization:** Verify that students cannot access administrator functions.
3. **Data isolation:** Verify that one student cannot retrieve or modify another student's complaints.
4. **Privilege escalation:** Attempt to modify a student's role through registration or other user-controlled inputs.
5. **Input validation:** Test invalid IDs, oversized fields, missing fields, and unexpected data types.
6. **Injection resistance:** Use safe, non-destructive tests for NoSQL injection and related input-handling weaknesses.
7. **Rate limiting:** Verify enforcement on authentication and API endpoints.
8. **Session and token security:** Assess token storage, logout behavior, and expired or tampered tokens.
9. **Configuration:** Review CORS, security headers, error responses, exposed services, and dependency versions.
10. **Frontend security:** Check for cross-site scripting risks, unsafe rendering, and client-side-only authorization assumptions.

Do not conduct destructive testing, denial-of-service testing, data deletion, or testing against third-party systems without explicit written authorization.

### D. Test Accounts and Data

Prepare separate, synthetic accounts for:

- A student
- A second student
- An administrator

Use fictional names, email addresses, and complaint records. Avoid real student information and production data.

Provide the tester with access through an approved secure channel. Do not publish passwords, access tokens, private keys, or database credentials in GitHub.

### E. Test Environment

Prefer an isolated staging or local environment with:

- A dedicated test database
- Non-production secrets
- Synthetic data
- No connection to production systems
- Restricted network access
- A documented reset and recovery procedure

Record the exact application commit, environment configuration, and dependencies tested so the results are reproducible.

### F. Deliverables Requested From the Tester

Request a report containing:

- Executive summary
- Scope, methodology, and limitations
- Findings ranked by severity
- Affected endpoint or component
- Reproduction steps
- Evidence with secrets and personal data redacted
- Security impact and realistic exploitation conditions
- Recommended remediation
- Retest results
- Overall risk assessment

Ask the tester to follow an agreed responsible-disclosure process and communicate critical findings promptly.

### G. Authorization and Safety

Testing must be explicitly authorized by the owner of the target systems. The tester should remain within the written scope and stop if testing affects availability, exposes real personal information, or reaches an out-of-scope system.

The repository being public does not itself authorize security testing of any hosted deployment or third-party service.

---

## 11. Reporting a Vulnerability

For each finding, record:

- Finding title
- Severity and rationale
- Affected endpoint or file
- Preconditions
- Reproduction steps
- Expected and actual behavior
- Security impact
- Recommended fix
- Evidence with sensitive information redacted

Do not commit proof-of-concept secrets, working credentials, personal information, or sensitive exploit data to a public repository. Share detailed evidence privately with the authorized project owner.

---

## 12. Git and GitHub Guidelines

Before committing changes, check:

```bash
git status
```

Verify that the repository does not include:

- `.env` files containing real values
- `node_modules/`
- Database dumps containing personal or confidential data
- API tokens, passwords, private keys, or other secrets

Commit and push source changes using:

```bash
git add .
git commit -m "Describe your changes"
git push
```

Keep the repository updated with meaningful commit messages and do not publish sensitive security findings in public issues.

---

## 13. Current Limitations

- Some modules are UI previews backed by sample data.
- Fee processing, room allocation, notices, leave requests, and visitor workflows may not have backend integration.
- A complete automated test suite and independent penetration test have not been established by this README.
- The security controls listed above require independent verification.
- Deployment-specific security depends on the environment and configuration.

Update this section as features are implemented and testing is completed.

---

## 14. Future Improvements

- Backend integration for all management modules
- Automated unit, integration, and end-to-end tests
- Improved audit logging
- Stronger deployment and secrets management
- Centralized error handling and monitoring
- Automated dependency and security scanning
- Documented backup and recovery procedures
- Accessibility and usability testing

---

## 15. License

No license has been specified yet. Unless a license is added, do not assume that others have permission to reuse, modify, or distribute this project.

---

**Maintained by Dhruv**  
Hostel Management System — development and security review documentation.
