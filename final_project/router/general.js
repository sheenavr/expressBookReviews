const express = require('express');
let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});


public_users.use(express.json()); // middleware to parse JSON requests

// Route to get the list of all books
public_users.get('/books', (req, res) => {
  res.json(books);
  return res.status(200).json({message: "Listing successfully"});
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
  return res.status(300).json({message: "ISBN existing"});
 });

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const authorName = req.params.author;

  // Find books by the provided author
  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === authorName.toLowerCase());

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: 'Books by the author not found' });
  }
});






// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const bookTitle = req.params.title;

  // Find books by the provided title
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === bookTitle.toLowerCase());

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: 'Books with the title not found' });
  }
});


//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const bookISBN = req.params.isbn;

  // Find the book by the provided ISBN
  const bookWithReviews = booksWithReviews.find(book => book.isbn === bookISBN);

  if (bookWithReviews) {
    res.json({ reviews: bookWithReviews.reviews });
  } else {
    res.status(404).json({ message: 'Book with the ISBN not found' });
  }
});

module.exports.general = public_users;
