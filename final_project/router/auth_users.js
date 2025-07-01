require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();
let users = []; // in-memory store: [{ username, password }]

// Check if username is valid (non-empty & not already taken)
const isValid = (username) => {
  return typeof username === 'string' && username.trim().length > 0 &&
         !users.some(u => u.username === username);
};

// Authenticate existing user credentials
const authenticatedUser = (username, password) => {
  return users.some(u => u.username === username && u.password === password);
};

const JWT_SECRET = process.env.JWT_SECRET || 'access';

// Task 7: Login route for registered users
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }
  // sign a JWT
  const accessToken = jwt.sign(
    { username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  // store in session
  req.session.authorization = { accessToken, username };
  return res.status(200).json({ message: 'User successfully logged in.', accessToken });
});

// Task 8: Add or modify a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const sessionAuth = req.session.authorization;
  if (!sessionAuth || !sessionAuth.username) {
    return res.status(403).json({ message: 'You must be logged in to post a review.' });
  }
  const username = sessionAuth.username;
  const { isbn } = req.params;
  const { review } = req.body;
  if (!review) {
    return res.status(400).json({ message: 'Review text is required.' });
  }
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
  book.reviews = book.reviews || {};
  book.reviews[username] = review;
  return res.status(200).json({ message: 'Review successfully added/updated.', reviews: book.reviews });
});

// Task 9: Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const sessionAuth = req.session.authorization;
  if (!sessionAuth || !sessionAuth.username) {
    return res.status(403).json({ message: 'You must be logged in to delete a review.' });
  }
  const username = sessionAuth.username;
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: 'Review by this user not found.' });
  }
  delete book.reviews[username];
  return res.status(200).json({ message: 'Review successfully deleted.', reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
