require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database
const database = require("./database");


//initialise express
const booky = express();

//initialise the bodyparse
booky.use(bodyParser.urlencoded({extended:true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
).then(() => console.log("Connection Established"));

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


//POST
/*
Route             /book/new
Description       Add new book
Access            PUBLIC
Parameter         NONE
Methods           POST
*/
booky.post("/book/new", (req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
});

/*
Route             /author/new
Description       Add new author
Access            PUBLIC
Parameter         NONE
Methods           POST
*/
booky.post("/author/new",(req,res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json(database.author);
});

/*
Route             /publication/new
Description       Add new publication
Access            PUBLIC
Parameter         NONE
Methods           POST
*/
booky.post("/publication/new", (req,res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json(database.publication);
});

/*
Route             /publication/update/book
Description       Update / add new publication
Access            PUBLIC
Parameter         isbn
Methods           PUT
*/
booky.put("/publication/update/book/:isbn", (req,res) => {
    //Update the publication database
    database.publication.forEach((pub) => {
      if(pub.id === req.body.pubId) {
        return pub.books.push(req.params.isbn);
      }
    });
  
    //Update the book database
    database.books.forEach((book) => {
      if(book.ISBN === req.params.isbn) {
        book.publications = req.body.pubId;
        return;
      }
    });
  
    return res.json(
      {
        books: database.books,
        publications: database.publication,
        message: "Successfully updated publications"
      }
    );
  });


/********Delete*****/
  /*
Route             /book/delete
Description       Delete a book
Access            PUBLIC
Parameter         isbn
Methods           DELETE
*/
booky.delete("/book/delete/:isbn", (req,res) => {
    //whichever book that doesnot 
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )
    database.books = updatedBookDatabase;
    return res.json({books: database.books});

});

  /*
Route             /book/delete/author
Description       Delete author from book and related book from author
Access            PUBLIC
Parameter         isbn/authorId
Methods           DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    //Update the book database
     database.books.forEach((book)=>{
       if(book.ISBN === req.params.isbn) {
         const newAuthorList = book.author.filter(
           (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
         );
         book.author = newAuthorList;
         return;
       }
     });
  
  
    //Update the author database
    database.author.forEach((eachAuthor) => {
      if(eachAuthor.id === parseInt(req.params.authorId)) {
        const newBookList = eachAuthor.books.filter(
          (book) => book !== req.params.isbn
        );
        eachAuthor.books = newBookList;
        return;
      }
    });
  
    return res.json({
      book: database.books,
      author: database.author,
      message: "Author was deleted!!!!"
    });
  });

   /*
Route             /book/delet/author
Description       Delete an author from the book
Access            PUBLIC
Parameter         isbn/authorId
Methods           DELETE
*/
booky.delete("/book/delet/author/:isbn/:authorId", (req,res) => {
  //Update the book database
   database.books.forEach((book)=>{
     if(book.ISBN === req.params.isbn) {
       const newAuthorList = book.author.filter(
         (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
       );
       book.author = newAuthorList;
       return;
     }
   });
   return res.json({
    book: database.books,
    message: "Author was deleted!!!!"
  });
});







booky.listen(3000,() => {
    console.log("Server is up and running");
});