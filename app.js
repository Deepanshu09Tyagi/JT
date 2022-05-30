const express = require("express");
const fs = require('fs');
const app =express();
const PORT = 3000;

app.use(express.json());

app.post('/book/add',(req,res)=>{
    var bookData = fs.readFileSync("bookdata.json");
    var bookItem = JSON.parse(bookData);

    const addBook = req.body;
    if (addBook.name == null || addBook.description == null || addBook.author == null ) {
        return res.status(401).send({error: true, msg: 'Book data missing'})
    }

    bookItem.push(addBook);
    fs.writeFileSync('bookdata.json',JSON.stringify(bookItem, null, 2));
    res.status(202).send({success: true, msg: 'Book added successfully', addedData:addBook})
})

app.get('/book/getall', (req,res)=>{
    var bookData = fs.readFileSync("bookdata.json");
    var bookItem = JSON.parse(bookData);
    res.status(202).send({success:true, msg: bookItem});
})

app.get('/book/get/:name', (req,res)=>{
    const name = req.params.name;
    var bookData = fs.readFileSync("bookdata.json");
    var bookItem = JSON.parse(bookData);
    const findBook = bookItem.find(book => book.name === name)
    if(findBook){
        res.status(202).send({success:true, msg: findBook});
    }
})


app.put('/book/update/:name',(req,res)=>{
    const name = req.params.name;
    const updateBook = req.body;
    var bookData = fs.readFileSync("bookdata.json");
    var bookItem = JSON.parse(bookData);

    const findBook = bookItem.find( book => book.name === name )
    if (!findBook) {
        res.status(404).send({error: true, msg: 'Book does not exist'})
    }
    const updatedBook = bookItem.filter( book => book.name !== name )
    updatedBook.push(updateBook)
    fs.writeFileSync('bookdata.json',JSON.stringify(updatedBook, null, 2))
    res.status(202).send({success: true, msg: 'Book updated successfully', updatedData:updateBook})
})


app.delete('/book/delete/:name',(req,res)=>{
    const name = req.params.name;
    var bookData = fs.readFileSync("bookdata.json");
    var bookItem = JSON.parse(bookData);
    const deleteBook = bookItem.find(book => book.name === name);
    if(deleteBook){
        bookItems = bookItem.filter(book => book.name !== name)
        fs.writeFileSync('bookdata.json',JSON.stringify(bookItems, null, 2))
        res.status(202).send({success: true, msg: 'Book deleted successfully',deletedBook:deleteBook})
    }
    else{
        res.status(404).send({error: true, msg: 'Book does not exist'})
    }
})



app.listen(PORT,console.log(`${PORT}`))