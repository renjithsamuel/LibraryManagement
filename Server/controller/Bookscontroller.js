const Book = require('../models/book');


exports.getBooks = async (req,res,next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    try{
        const books = await Book.find();
        // console.log(expenses);
        return res.status(200).json({
            success :true,
            count : books.length,
            data : books
        });}
        catch(err){
            return res.status(500).json({
                success: false,
                Error : "server error"
            })
        }
    }

    exports.postBooks = async (req,res,next) =>{
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        console.log(req.body);
        if(req.body.title == null || req.body.author == null || req.body.subject == null || req.body.publishDate == null || req.book.desc == null){
            return res.status(400).send("Send correct values");
        }
        try{
        let books = await Book.collection.insertOne(req.body);
        if(!books){
            return res.status(400).json({
                success : false,
                error : "send correct values"
            });
        }
        return res.status(200).json(req.body);
        }catch(err){
            return res.status(500).json({
                success : false,
                error : "server error"
            })
        }
    }


    exports.postManyBooks = async (req, res, next) => {
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        console.log(req.body);
        
        // Check if the request body contains an array of book objects
        if (!Array.isArray(req.body)) {
          return res.status(400).send("Send an array of book objects");
        }
      
        // Check if all book objects have the required properties
        const invalidBooks = req.body.filter(book => (
          book.title == null || book.author == null || book.subject == null || book.publishDate == null || book.desc == null
        ));
        if (invalidBooks.length > 0) {
          return res.status(400).send("Send valid book objects");
        }
      
        try {
          let result = await Book.collection.insertMany(req.body);
          if (!result || result.insertedCount !== req.body.length) {
            return res.status(400).json({
              success: false,
              error: "Error inserting books"
            });
          }
          return res.status(200).json(req.body);
        } catch (err) {
          console.error(err);
          return res.status(500).json({
            success: false,
            error: "Server error"
          });
        }
      };