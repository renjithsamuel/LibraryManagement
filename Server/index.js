const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const booksRouter = require('./routes/books');
const {getBooks , postBooks , postManyBooks} = require('./controller/Bookscontroller');
//, getBooksById, postBooks, deleteBooksById, deleteBooksByBody,updateBooksById
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://0.0.0.0:27017/Library', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

mongoose.set("strictQuery",false);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
app.use(helmet());
app.use(cors({
  origin: '*'
}));
app.use(express.json());
// app.use('/books', booksRouter);

app.get('/api/v1/books',getBooks);
// app.get('/api/v1/books/:id',getBooksById);
app.post('/api/v1/books',postBooks);
app.post('/api/v1/manyBooks',postManyBooks);
// app.delete('/api/v1/books/:id',deleteBooksById);
// app.delete('/api/v1/books',deleteBooksByBody);
// app.put('/api/v1/books/:id',updateBooksById);


app.get('/api/v1/health',(req,res)=>{
    let message = {message : "Its working perfectly",status: "success"};
    res.status(200).json(message);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});