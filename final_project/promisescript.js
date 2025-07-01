// promisescript.js
// Tasks 10–13: Promise and Async/Await demos using Axios as a client

const axios = require('axios');
const BASE = 'http://localhost:5000';

// Task 10: List all books
function listAllBooks() {
  axios.get(`${BASE}/`)
    .then(resp => console.log('All books (Promise):', resp.data))
    .catch(err => console.error('Error listing books:', err.message));
}

async function listAllBooksAsync() {
  try {
    const resp = await axios.get(`${BASE}/`);
    console.log('All books (Async):', resp.data);
  } catch (err) {
    console.error('Error listing books:', err.message);
  }
}

// Task 11: Get by ISBN
function getByISBN(isbn) {
  axios.get(`${BASE}/isbn/${isbn}`)
    .then(resp => console.log(`Book ${isbn} (Promise):`, resp.data))
    .catch(err => console.error(`Error ISBN ${isbn}:`, err.response?.data || err.message));
}

async function getByISBNAsync(isbn) {
  try {
    const resp = await axios.get(`${BASE}/isbn/${isbn}`);
    console.log(`Book ${isbn} (Async):`, resp.data);
  } catch (err) {
    console.error(`Error ISBN ${isbn}:`, err.response?.data || err.message);
  }
}

// Task 12: Get by author
function getByAuthor(author) {
  axios.get(`${BASE}/author/${encodeURIComponent(author)}`)
    .then(resp => console.log(`By ${author} (Promise):`, resp.data))
    .catch(err => console.error(`Error author ${author}:`, err.response?.data || err.message));
}

async function getByAuthorAsync(author) {
  try {
    const resp = await axios.get(`${BASE}/author/${encodeURIComponent(author)}`);
    console.log(`By ${author} (Async):`, resp.data);
  } catch (err) {
    console.error(`Error author ${author}:`, err.response?.data || err.message);
  }
}

// Task 13: Get by title
function getByTitle(title) {
  axios.get(`${BASE}/title/${encodeURIComponent(title)}`)
    .then(resp => console.log(`Title "${title}" (Promise):`, resp.data))
    .catch(err => console.error(`Error title ${title}:`, err.response?.data || err.message));
}

async function getByTitleAsync(title) {
  try {
    const resp = await axios.get(`${BASE}/title/${encodeURIComponent(title)}`);
    console.log(`Title "${title}" (Async):`, resp.data);
  } catch (err) {
    console.error(`Error title ${title}:`, err.response?.data || err.message);
  }
}

//––– Invoke each demo once –––
listAllBooks();
listAllBooksAsync();

getByISBN(1);
getByISBNAsync(2);

getByAuthor('Jane Austen');
getByAuthorAsync('Dante Alighieri');

getByTitle('Pride and Prejudice');
getByTitleAsync('The Divine Comedy');
