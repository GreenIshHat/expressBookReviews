const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered. Now you can log in." });
});

// Get the list of all books
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
});

// Get books based on author
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;
  const results = Object.values(books).filter(
    (b) => b.author.toLowerCase() === author.toLowerCase()
  );

  if (results.length > 0) {
    return res.status(200).json(results);
  }
  return res.status(404).json({ message: `No books found by author ${author}.` });
});

// Get books based on title
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;
  const results = Object.values(books).filter(
    (b) => b.title.toLowerCase() === title.toLowerCase()
  );

  if (results.length > 0) {
    return res.status(200).json(results);
  }
  return res.status(404).json({ message: `No books found with title '${title}'.` });
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }

  const reviews = book.reviews;
  if (reviews && Object.keys(reviews).length > 0) {
    return res.status(200).json(reviews);
  }

  return res.status(200).json({ message: `No reviews for book with ISBN ${isbn}.` });
});

module.exports.general = public_users;
