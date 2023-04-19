const Books = require('../models/book');


exports.getBooks = async (req,res,next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    try{
        const books = await Books.find();
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
        if(req.body.title == null || req.body.author == null || req.body.subject == null || req.body.publishDate == null || req.body.desc == null){
            return res.status(400).send("Send correct values");
        }
        try{
        let books = await Books.collection.insertOne(req.body);
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
          let result = await Books.collection.insertMany(req.body);
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

    exports.getBooksPage = async (req, res, next) => {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
  
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      const results = {};
  
      if (endIndex < await Books.countDocuments().exec()) {
          results.next = {
              page: page + 1,
              limit: limit
          }
      }
  
      if (startIndex > 0) {
          results.previous = {
              page: page - 1,
              limit: limit
          }
      }
  
      try {
          results.data = await Books.find().limit(limit).skip(startIndex).exec();
          res.json(results);
      } catch (e) {
          res.status(500).json({ message: e.message });
      }
    }