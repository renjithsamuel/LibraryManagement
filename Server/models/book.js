const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  subject: String,
  publishDate: String,
  desc : String
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;