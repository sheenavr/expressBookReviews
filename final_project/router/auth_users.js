const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const session = require('express-session')
const regd_users = express.Router();
let books = require("./booksdb.js");
let users = [];


regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (isValid(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }});
  const isValid = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

  
  regd_users.use(session({secret:"fingerpint"},resave=true,saveUninitialized=true));

  regd_users.use(express.json());


 
// Middleware for parsing JSON requests
regd_users.use(bodyParser.json());

// Middleware for managing sessions
regd_users.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));


regd_users.use(bodyParser.json());

// In-memory store for books and reviews

const reviews = {};

// Endpoint to update a book review based on ISBN
regd_users.put('/reviews/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const { reviewText } = req.body;
  const username = req.session.username; // Assuming you have user authentication with sessions

  // Check if there is a book with the given ISBN
  if (books[isbn]) {
    // Check if there is a review for the given ISBN by the same user
    if (!reviews[isbn]) {
      reviews[isbn] = {};
    }

    if (reviews[isbn][username]) {
      // Update the existing review
      reviews[isbn][username] = reviewText;
    } else {
      // Add a new review
      reviews[isbn][username] = reviewText;
    }

    res.json({ message: 'Review updated successfully' });
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});


regd_users.use(bodyParser.json());



// Endpoint to get book details based on ISBN
regd_users.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  // Check if the book exists
  if (books[isbn]) {
    const bookDetails = books[isbn];
    res.json({ bookDetails });
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
