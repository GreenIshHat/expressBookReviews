// index.js

const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes     = require('./router/general.js').general;

const app = express();
app.use(express.json());

// At the very top of both index.js and auth_users.js
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;



// mount session middleware for all /customer routes
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer", 
    resave: true, 
    saveUninitialized: true
  })
);

// all routes matching /customer/auth/* go through this check
app.use("/customer/auth/*", function auth(req, res, next) {
  // 1) do we have any session info?
  if (!req.session.authorization || !req.session.authorization.accessToken) {
    return res.status(403).json({ message: "You must log in first." });
  }

  const token = req.session.authorization.accessToken;

  // 2) verify the JWT
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      // invalid or expired token
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    // optionally stash the decoded payload on req for handlers down-stream
    req.user = {
      username: decoded.username,
      // any other fields you encoded...
    };
    // 3) authorized! forward to the actual route
    next();
  });
});

const PORT = 5000;
app.use("/customer", customer_routes);
app.use("/",        genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
