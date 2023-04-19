const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  subject: String,
  publishDate: String,
  desc : String
});

const Books = mongoose.model('Books', bookSchema);

module.exports = Books;