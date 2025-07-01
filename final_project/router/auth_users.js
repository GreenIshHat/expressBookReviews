// router/auth_users.js

const express = require('express');
const jwt     = require('jsonwebtoken');
let   books   = require("./booksdb.js");

// At the very top of both index.js and auth_users.js
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


const regd_users = express.Router();
let users = [];   // in-memory user store: [{ username, password }, …]

// 1) isValid: ensure a non-empty username that isn’t already in use
const isValid = (username) => {
  if (typeof username !== "string" || username.trim().length === 0) {
    return false;
  }
  return !users.some(u => u.username === username);
};

// 2) authenticatedUser: check for a matching username/password in our users[]
const authenticatedUser = (username, password) => {
  return users.some(u => u.username === username && u.password === password);
};

// 3) /login → issue JWT & save it to req.session.authorization
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // sign a token with the username in its payload
  const accessToken = jwt.sign(
    { username },
    JWT_SECRET,           // your JWT secret; consider moving to process.env.JWT_SECRET
    { expiresIn: "1h" }
  );

  // store both token & username in session
  req.session.authorization = { accessToken, username };

  return res.status(200).json({
    message: "User successfully logged in",
    accessToken
  });
});

// 4) PUT /auth/review/:isbn → add or update the logged-in user's review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // pull username out of session (set by index.js auth middleware)
  const sessionAuth = req.session.authorization;
  if (!sessionAuth || !sessionAuth.username) {
    return res.status(403).json({ message: "You must be logged in to post a review." });
  }
  const username = sessionAuth.username;
  const { isbn } = req.params;
  const reviewText = req.query.review || req.body.review;

  if (!reviewText) {
    return res.status(400).json({ message: "Review text is required." });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `No book found with ISBN ${isbn}.` });
  }

  // ensure the reviews object exists
  if (!book.reviews) {
    book.reviews = {};
  }

  // add/update this user's review
  book.reviews[username] = reviewText;

  return res.status(200).json({
    message: "Review successfully added/updated.",
    reviews: book.reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid       = isValid;
module.exports.users         = users;
