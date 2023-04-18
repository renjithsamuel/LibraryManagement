// const express = require('express');
// const Book = require('../models/book');

// const router = express.Router();


// router.get('/books', async (req, res) => {
//     // Add query handling and pagination logic
//     try {
//       const books = await Book.find();
//       res.json(books);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });

// router.get('/', async (req, res) => {
//     const { title, author, subject, publishDate, page } = req.query;
//     const filter = {};
//     const options = {
//       limit: 10,
//       skip: page ? (page - 1) * 10 : 0
//     };
  
//     if (title) filter.title = { $regex: title, $options: 'i' };
//     if (author) filter.author = { $regex: author, $options: 'i' };
//     if (subject) filter.subject = { $regex: subject, $options: 'i' };
//     if (publishDate) filter.publishDate = { $gte: new Date(publishDate) };
  
//     try {
//       const books = await Book.find(filter, null, options);
//       res.json(books);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });

  
  
  
  
  
  
  router.get('/count', async (req, res) => {
      const { title, author, subject, publishDate } = req.query;
      const filter = {};
      
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (author) filter.author = { $regex: author, $options: 'i' };
    if (subject) filter.subject = { $regex: subject, $options: 'i' };
    if (publishDate) filter.publishDate = { $gte: new Date(publishDate) };
  
    try {
      const count = await Book.countDocuments(filter);
      res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
    

// module.exports = router;