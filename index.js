const express = require("express");

//Database
const database = require("./database");


//initialise express
const booky = express();

/*
Route             /
Description       Get all the books
Access            PUBLIC
Parameter         NONE
Methods           GET
*/

booky.get("/",(req,res) => {
    return res.json({books: database.books});
});

/*
Route             /
Description       Get specific book on ISBN
Access            PUBLIC
Parameter         isbn
Methods           GET
*/
booky.get("/is/:isbn",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length === 0) {
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
    }

    return res.json({book: getSpecificBook})
});

/*
Route             /c
Description       Get category
Access            PUBLIC
Parameter         category
Methods           GET
*/
booky.get("/c/:category", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    )

    if(getSpecificBook.length === 0) {
        return res.json({error: `No book found for the category of ${req.params.category}`});
    }

    return res.json({book: getSpecificBook});
});


/*
Route             /la
Description       Get specific book based on language
Access            PUBLIC
Parameter         language
Methods           GET
*/
booky.get("/la/:language",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language.includes(req.params.language)
    )

    if(getSpecificBook.length === 0) {
        return res.json({error: `No book found for the language of ${req.params.language}`});
    }

    return res.json({book: getSpecificBook});
});


/*
Route             /author
Description       Get all authors
Access            PUBLIC
Parameter         NONE
Methods           GET
*/
booky.get("/author", (req,res) => {
    return res.json({authors: database.author});
});


/*
Route             /au
Description       Get a Specific author
Access            PUBLIC
Parameter         id
Methods           GET
*/
booky.get("/au/:id",(req,res) => {
    const getSpecificAuthor = database.author.filter(
        (authors) => authors.id === parseInt(req.params.id)
    );

    if(getSpecificAuthor.length === 0)
    {
        return res.json({error: `No author found for the id of ${req.params.id}`});
    }

    return res.json({authors: getSpecificAuthor});
});


/*
Route             /author/books
Description       Get list of authors based on books
Access            PUBLIC
Parameter         ISBN
Methods           GET
*/
booky.get("/author/book/:isbn", (req,res) => {
    const getSpecificAuthor = database.author.filter(
      (author) => author.books.includes(req.params.isbn)
    );
  
    if(getSpecificAuthor.length === 0){
      return res.json({error: `No author found for the book of ${req.params.isbn}`});
    }

    return res.json({authors: getSpecificAuthor});
  });


  /*
Route             /pub
Description       Get all publications
Access            PUBLIC
Parameter         NONE
Methods           GET
*/
booky.get("/pub", (req,res) => {
    return res.json({publications: database.publication});
});


 /*
Route             /publication
Description       Get Specific publication
Access            PUBLIC
Parameter         id
Methods           GET
*/
booky.get("/publication/:id", (req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publications) => publications.id === parseInt(req.params.id)
    );

    if(getSpecificPublication.length === 0)
    {
        return res.json({error: `NO book found based on the publication id ${req.params.id}`});
    }

    return res.json({publications: getSpecificPublication});
});

/*
Route             /publication/book
Description       Get a list of publication based on a book
Access            PUBLIC
Parameter         isbn
Methods           GET
*/
booky.get("/publication/book/:isbn", (req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publications) => publications.books.includes(req.params.isbn)
    );

    if(getSpecificPublication.length === 0){
        return res.json({error: `NO publication found for the book ${req.params.isbn}`});
    }

    return res.json({publications: getSpecificPublication});
});





booky.listen(3000,() => {
    console.log("Server is up and running");
});