# Quiz App

A trivia quiz web app built for BCIT COMP 4945 — Distributed Software Architecture. Supports individual and moderated quiz modes with real-time WebSocket functionality.

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** SQL Server (MSSQL) running in Docker
- **Auth:** JWT (jsonwebtoken), bcrypt
- **Frontend:** Vanilla JS, HTML, CSS
- **Containerization:** Docker

## Project Structure
```
quiz-app/
├── server.js          # Express server, routes, middleware
├── static/            # Frontend static files
│   ├── login.html
│   ├── register.html
│   ├── admin.html
│   ├── styles.css
│   └── js/
│       └── client.js
├── db/
│   ├── docker-compose.yml  # MSSQL container config
│   └── init.sql            # Schema + seed data
├── Dockerfile
├── .env               # Not committed — see setup below
└── package.json
```

## Getting Started

### Prerequisites
- Node.js v18+
- Docker Desktop (must be running before any docker commands)
- SQL Server Management Studio (SSMS) — optional, for inspecting the database visually

### 1. Clone the repo and install dependencies
```bash
git clone <repo-url>
cd quiz-app
npm install
```

### 2. Create your `.env` file
Create a `.env` file in the project root. This file is gitignored and must be created manually by each developer:
```
PORT=3000
JWT_SECRET=your_secret_key_here
DB_SERVER=localhost
DB_PORT=1433
DB_NAME=quiz_app
DB_USER=sa
DB_PASSWORD=your_db_password_here
SA_PASSWORD=your_db_password_here
```

> **Note:** `DB_PASSWORD` and `SA_PASSWORD` should be the same value. The SA password must be at least 8 characters and include uppercase, lowercase, a number, and a symbol (e.g. `QuizApp_2024!`). Avoid using `$` in the password as Docker Compose may try to interpret it as a variable.

### 3. Generate seed password hashes
The `init.sql` seed data uses bcrypt hashes for the default admin and user accounts. Generate real hashes before running the init script:
```bash
node -e "
const bcrypt = require('bcrypt');
Promise.all([
  bcrypt.hash('admin1234', 10),
  bcrypt.hash('user1234', 10)
]).then(([a, u]) => console.log('admin:', a, '\nuser:', u));
"
```

Open `db/init.sql` and replace the two placeholder hashes in the `INSERT INTO users` statements with the values printed above.

### 4. Start the database container
```bash
docker compose -f db/docker-compose.yml --env-file .env up -d
```

Wait about 30 seconds, then confirm the container is healthy:
```bash
docker ps
# STATUS should show "(healthy)" next to quiz-db
```

### 5. Run the init script
This creates all tables and inserts seed data. Only needs to be run once per machine (or after wiping the volume):
```bash
# Windows (PowerShell)
docker exec -it quiz-db /opt/mssql-tools18/bin/sqlcmd `
  -S localhost -U sa -P "your_db_password_here" `
  -i /docker-entrypoint-initdb.d/init.sql -No

# Mac / Linux
docker exec -it quiz-db /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "your_db_password_here" \
  -i /docker-entrypoint-initdb.d/init.sql -No
```

Verify the tables were created:
```bash
# Windows (PowerShell)
docker exec -it quiz-db /opt/mssql-tools18/bin/sqlcmd `
  -S localhost -U sa -P "your_db_password_here" `
  -Q "USE quiz_app; SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE';" -No

# Mac / Linux
docker exec -it quiz-db /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "your_db_password_here" \
  -Q "USE quiz_app; SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE';" -No
```

You should see 7 tables: `users`, `categories`, `quizzes`, `questions`, `answers`, `quiz_attempts`, `attempt_answers`.

### 6. Start the server
```bash
node server.js
```

Visit `http://localhost:3000` — you should be redirected to the login page.

### Default seed accounts
| Email | Password | Role |
|-------|----------|------|
| admin@quiz.com | admin1234 | Admin |
| user@quiz.com | user1234 | User |

---

## Inspecting the Database (SSMS)
You can connect SQL Server Management Studio directly to the Docker container:
- **Server name:** `localhost,1433`
- **Authentication:** SQL Server Authentication
- **Login:** `sa`
- **Password:** your `SA_PASSWORD` from `.env`
- **Encryption:** Optional

---

## Resetting the Database
If you need to wipe the database and start fresh (e.g. after a schema change):
```bash
# Stop the container and delete the volume
docker compose -f db/docker-compose.yml --env-file .env down -v

# Bring it back up
docker compose -f db/docker-compose.yml --env-file .env up -d

# Wait for healthy, then re-run the init script (step 5 above)
```

---

## Running with Docker (App Container)
```bash
docker build -t quiz-app .
docker run -p 3000:3000 --env-file .env quiz-app
```

---

## API Routes

### Auth
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/register` | Register a new user | None |
| POST | `/login` | Login and receive a JWT | None |
| GET | `/me` | Get current user profile | Required |

### Categories
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/categories` | Get all quiz categories | Required |
| GET | `/categories/:id` | Get a single category with its quizzes | Required |

### Quizzes
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/quizzes` | Get all quizzes | Required |
| GET | `/quizzes/:id` | Get a single quiz with its questions | Required |
| GET | `/quizzes/autoplay` | Get quizzes flagged for auto-play mode | Required |

### Questions & Answers
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/quizzes/:id/questions` | Get all questions for a quiz (with answers and media) | Required |
| POST | `/questions/:id/answer` | Submit an answer — returns whether it is correct | Required |

### Admin
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/admin/users` | Get all users | Admin |
| DELETE | `/admin/delete-user` | Delete a user by ID | Admin |
| POST | `/admin/categories` | Create a new category | Admin |
| DELETE | `/admin/categories/:id` | Delete a category | Admin |
| POST | `/admin/quizzes` | Create a new quiz | Admin |
| DELETE | `/admin/quizzes/:id` | Delete a quiz | Admin |
| POST | `/admin/questions` | Add a question to a quiz | Admin |
| DELETE | `/admin/questions/:id` | Delete a question | Admin |

> Requests to protected routes must include the JWT in the `Authorization` header as `Bearer <token>`.

---

## Deliverables

### Part A — Core Quiz Functionality
- [ ] Display a categories page listing all available quizzes (Netflix/Apple TV style layout)
- [ ] Categories are dynamically generated from the database
- [ ] Each quiz category plays questions one by one
- [ ] Each question shows 2–4 answer buttons
- [ ] Correct answer advances to the next question
- [ ] Questions can reference a quote, image, animated image, audio, or video clip
- [ ] Media auto-starts when a question is navigated to
- [ ] Media auto-stops when moving to the next question
- [ ] Auto-play mode: quizzes and answers play automatically without user input
- [ ] Quiz content (questions, answers, media) is retrieved from the backend database

### Part B — Moderated Mode
- [ ] Staff member can run a quiz on a large screen monitor
- [ ] Participants can join on tablets and see answer buttons
- [ ] Answers from tablets are collected and displayed on the large screen
- [ ] Implemented using WebSockets

### Part C — DevOps
- [x] Web API runs in a Docker container
- [ ] GitHub Actions CI/CD pipeline for build/compilation
- [x] Database running in a Docker container
- [x] App deployed to the cloud with HTTPS enabled

### General
- [ ] Code is modularized (frontend JS/React and backend)
- [x] README includes instructions on how to run the app
- [ ] Video demo recorded
- [ ] Individual contributions are tracked and equitable