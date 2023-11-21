const express = require('express');
let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
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
   const isbn = req.params.isbn;
  res.send(books[isbn])
  return res.status(300).json({message: "ISBN existing"});
 });


//  Get book review
public_users.get('/auth/:isbn', (req, res) => {
  const isbn = req.params.isbn;
 res.send(books[isbn])
 return res.status(300).json({message: "ISBN existing"});
});

//update details

public_users.put("/review/isbn/:isbn", function (req, res) {
  const isbn= req.params.isbn;
  let book= books[isbn]
  if (book) { //Check is friend exists
      let review = req.body.review;
      
      if(review) {
          books["review"] = review 
      }
      
      books[isbn]=book;
      res.send(`Updated Successfully.`);
  }
  else{
      res.send("Unable to find the Item");
  }
});

// delete the details

public_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (isbn){
      delete books[isbn]
  }
  res.send(`Book setails with  ${isbn} deleted.`);
});
//===================================================================
// Example external API URL
const externalApiUrl = 'https://example.com/api/books';

// Async function to fetch all books
const getAllBooks = async () => {
  try {
    const response = await axios.get(externalApiUrl);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch books');
  }
};



//=======================================

// Endpoint to get book details based on ISBN using Promise callbacks
public_users.get('/books-promise/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  getBookDetailsByISBNPromise(isbn)
    .then(bookDetails => res.json({ bookDetails }))
    .catch(error => res.status(404).json({ error: error.message }));
});

//============================================

// Endpoint to get book details based on Author using async-await
public_users.get('/books-by-author-async/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const bookDetails = await getBookDetailsByAuthorAsync(author);
    res.json({ bookDetails });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

//=======================================================
// Function to fetch book details based on Title using async-await
const getBookDetailsByTitleAsync = async (title) => {
  try {
    const response = await axios.get(`${externalApiUrl}?title=${title}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch book details');
  }
};



module.exports.general = public_users;
