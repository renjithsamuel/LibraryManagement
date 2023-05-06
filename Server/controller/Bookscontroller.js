const Books = require('../models/book');
const axios = require('axios');
//API HANDLERS
// getting all books 
exports.getBooks = async (req,res,next) => {

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

// posting single book
    exports.postBooks = async (req,res,next) =>{
        console.log(req.body);
        if(req.body.title == null || req.body.author == null || req.body.subject == null || req.body.publishedDate == null || req.body.desc == null){
            return res.status(400).send("Send correct values");
        }
        try{
            
            // let newPost = {
            //     title : req.body.title, 
            //     author : req.body.author,
            //     subject : req.body.subject,
            //     desc  : req.body.desc,
            //     publishedDate : new Date(req.body.date),
            // } 
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

// posting many books
    exports.postManyBooks = async (req, res, next) => {
        console.log(req.body);
        
        if (!Array.isArray(req.body)) {
          return res.status(400).send("Send an array of book objects");
        }

        const invalidBooks = req.body.filter(book => (
          book.title == null || book.author == null || book.subject == null || book.publishedDate == null || book.desc == null
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
// getting books by page count
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

// Search api included for querying
    exports.searchBooks = async (req,res,next) =>{
        const searchText = req.query.searchQuery;
        const searchBy = req.query.searchBy;
        try{
            let results = [] ;
            if(searchBy==='all'){
                 results = await Books.find({
                $or: [
                    { title: { $regex: searchText , $options : "i" } },
                    { author: { $regex: searchText, $options: "i" } },
                    { date: { $regex: searchText, $options: "i" } },
                    { subject: { $regex: searchText, $options: "i" } },
                    { description: { $regex: searchText, $options: "i" } },
                  ]
              });} 
              else{
                if(searchBy==='title'){
                     results = await Books.find({title:{$regex : searchText,$options : "i"}});
                }
                else if(searchBy === 'author'){
                    console.log(searchBy);
                     results = await Books.find({author:{$regex:searchText , $options:"i"}});
                }
                else if(searchBy === 'subject'){
                     results = await Books.find({subject:{$regex:searchText , $options:"i"}});
                }
                else if(searchBy === 'date'){
                     results = await Books.find({publishedDate:{$regex:searchText , $options:"i"}});
                }
                else if(searchBy === 'desc'){
                     results = await Books.find({desc:{$regex:searchText , $options:"i"}});
                }
              } 
            return res.status(200).send(results);
        }catch(err){
            res.status(500).json({message:err.message});
        }
    }

    // updateBooks with image and previeLink
    exports.updateBookDetails = async (req,res,next) =>{
        const {id, previewLink, imageLink} = req.body;

        try{
            let updatedData;
             updatedData = await Books.findByIdAndUpdate(id,{
                coverImage  :imageLink,
                previewLink : previewLink
            },{new:true});
        
            if(!updatedData){
                return res.status(400).json({
                    message : "something went wrong!",
                    success : false
                });
            }
            return res.status(200).json({
                message : "data patched successfully!",
                data : updatedData,
                success:true
            });
        }catch(err){
            console.log(err);
            return res.status(500).json({
                message: "Internal server error!  " + err.message,
                success : false
            });
        }
    }


    exports.loggerFunc = async (req,res,next) => {
        console.log("logging");
        console.log(req.method , req.url);
        next();
    }

    exports.checkAdmin = (req,res,next) =>{
        const isAdmin = false;
        if(!isAdmin){
            return res.status(403).json({
                message: "Admin access required!"
            })
        }
    }