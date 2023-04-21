const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {getBooks , postBooks , postManyBooks,getBooksPage} = require('./controller/Bookscontroller');
const helmet = require('helmet');
const config = require('config');

const app = express();
const PORT = process.env.PORT || 3000;

//mongo db connection 
mongoose.connect(`mongodb+srv://${config.get('DBNAME')}:${config.get('DBPASSWORD')}@cluster0.gp8dend.mongodb.net/Library?retryWrites=true&w=majority`, {
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

//routing to api handlers
app.get('/api/v1/books',getBooks);
app.get('/api/v1/booksPage',getBooksPage);
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