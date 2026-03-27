const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");

class ServerApp {
  constructor() {
    require("dotenv").config();
    this.clientDir = path.join(__dirname, "static");
    this.app = express();

    this.JWT_SECRET = process.env.JWT_SECRET;
    if (!this.JWT_SECRET) {
      throw new Error("Missing JWT_SECRET in .env");
    }
  }

  setupMiddleware() {
    this.app.use(express.static(this.clientDir, { index: false }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
  }

  setupStaticRoutes() {
    this.app.get(["/"], (req, res) => {
      res.redirect(`/login.html`);
    });
  }

  // ==================
  // MIDDLEWARE
  // ==================

  // verifies JWT and attaches decoded user to req.user.
  async requireAuth(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, this.JWT_SECRET);
    } catch {
      return res.status(403).json({
        error: "Invalid or expired token",
      });
    }

    try {
      // const [rows] = await this.appPool.query(
      //   "SELECT id, email, api_calls_consumed, is_admin FROM users WHERE id = ?",
      //   [decoded.userId],
      // );
      // const user = rows[0];
      // if (!user) return res.status(401).json({ error: "User not found" });

      next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      res.status(500).json({ error: "Authentication check failed" });
    }
  }

  setupRoutes() {
    // ==================
    // AUTH ROUTES
    // ==================

    this.app.post("/register", async (req, res) => {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const hash = await bcrypt.hash(password, 10);

      try {
        // ToDo: add new user to db here

        // const token = jwt.sign({ userId: result.insertId, email }, this.JWT_SECRET, {
        //   expiresIn: "7d",
        // });
        // res.json({ success: true, token, isAdmin: false });
      } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: "Registration failed" });
      }
    });

    this.app.post("/login", async (req, res) => {
      try {
        const { email, password } = req.body || {};

        if (!email || !password) {
          return res
            .status(400)
            .json({ error: "Email and password are required" });
        }
        // ToDo: add login validation
      } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Login failed" });
      }
    });
    // ==================
    // ADMIN ROUTES
    // ==================

    this.app.get("/admin/", async (req, res) => {
        // ToDo add admin routes like create quiz, delete quiz etc.
    });
  }

  start() {
    this.app.listen(process.env.PORT || 5551);
    console.log(`Server running`);
  }

  init() {
    this.setupMiddleware();
    this.setupStaticRoutes();
    this.setupRoutes();
    this.start();
  }
}

const serverApp = new ServerApp();
serverApp.init();
