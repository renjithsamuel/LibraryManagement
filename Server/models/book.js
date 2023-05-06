const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  subject: String,
  publishedDate: String,
  desc : String,
  previewLink:{
    type: String,
    default: ""
  },
  coverImage : String
});

const Books = mongoose.model('Books', bookSchema);

module.exports = Books;