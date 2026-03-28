# Quiz App

A trivia quiz web app built for BCIT COMP 4945 — Distributed Software Architecture. Supports individual and moderated quiz modes with real-time WebSocket functionality.

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** SQL Server
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
├── Dockerfile
├── .env               # Not committed — see setup below
└── package.json
```

## Getting Started

### Prerequisites
- Node.js v18+
- Docker (for running SQL Server)

### Setup

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start SQL Server in Docker:
   ```bash
   docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=your_password" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
   ```
4. Create a `.env` file in the project root:
   ```
   PORT=3000
   DB_CONNECTION_STRING=your_sql_server_connection_string
   JWT_SECRET=your_secret_key
   ```
5. Start the server:
   ```bash
   node server.js
   ```
6. Visit `http://localhost:3000`

### Running with Docker

```bash
docker build -t quiz-app .
docker run -p 3000:3000 --env-file .env quiz-app
```

## API Routes

### Auth
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/register` | Register a new user | None |
| POST | `/login` | Login and receive a JWT | None |

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
- [ ] Database running in a Docker container
- [x] App deployed to the cloud with HTTPS enabled

### General
- [ ] Code is modularized (frontend JS/React and backend)
- [x] README includes instructions on how to run the app
- [ ] Video demo recorded
- [ ] Individual contributions are tracked and equitable
