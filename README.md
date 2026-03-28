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
