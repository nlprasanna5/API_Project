const books = [
    {
        ISBN: "12345Book",
        title: "Tesla!!!",
        pubDate: "2021-08-05",
        language: "en",
        numPage: 250,
        author: [1,2],
        publications: [1],
        category: ["tech","space","education"]
    }
]

const author = [
    {
        id:1,
        name: "Prasanna",
        books: ["12345Book","123secretBook"]
    },
    {
        id: 2,
        name: "Elanmusk",
        books: ["12345Book"]
    }
]

const publication = [
    {
        id: 1,
        name: "writex",
        books: ["12345Book"]
    },
    {
        id: 2,
        name: "writex2",
        books: []
    }
]

//export
module.exports = {books,author,publication};

