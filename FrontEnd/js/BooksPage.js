const bookList = document.getElementById('book-list');
let getBooksurl = "http://localhost:3000/api/v1/books";
let postBooksUrl = "http://localhost:3000/api/v1/books";
let currentPage = 1;

const sendHttpRequest = async (method, url, data) => {
    let returndata;
    await fetch(url, {    
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    })
    .then((response) => returndata =  response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
    return returndata;
}

async function fetchBooks() {
    // Add query handling and pagination logic
    try {
      await sendHttpRequest('GET',getBooksurl).then((responseData)=>{
        console.log(responseData);
        const arr = responseData.data;
        const res =  arr.filter(book => book["author"].includes("Dan"));
        console.log("Filter!!!!..............");
        console.log(res);
        displayBooks(responseData.data);
      })
    } catch (error) {
      console.error(error.message);
    }
  }

window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    currentPage += 10;
    fetchBooks({ page: currentPage });
  }
});


function displayBooks(books) {
  console.log(books);
  bookList.innerHTML = ''; // clear the book list before displaying new books
  books.forEach((book) => {
    createCard(book);
  });
}

function createCard(book){
  const bookElement = document.createElement('div');
  bookElement.setAttribute('class', 'book');
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = book.title;
  bookElement.appendChild(bookTitle);
  const bookAuthor = document.createElement('p');
  bookAuthor.setAttribute('class', 'book-author');
  const authorLabel = document.createElement('strong');
  authorLabel.innerText = 'Author:';
  bookAuthor.appendChild(authorLabel);
  bookAuthor.appendChild(document.createTextNode(` ${book.author}`));
  bookElement.appendChild(bookAuthor);

  const bookSubject = document.createElement('p');
  bookSubject.setAttribute('class', 'book-subject');
  const subjectLabel = document.createElement('strong');
  subjectLabel.innerText = 'Subject:';
  bookSubject.appendChild(subjectLabel);
  bookSubject.appendChild(document.createTextNode(` ${book.subject}`));
  bookElement.appendChild(bookSubject);

  const bookPublishDate = document.createElement('p');
  bookPublishDate.setAttribute('class', 'book-publish-date');
  const dateLabel = document.createElement('strong');
  dateLabel.innerText = 'Publish Date:';
  bookPublishDate.appendChild(dateLabel);
  bookPublishDate.appendChild(document.createTextNode(` ${book.publishDate}`));
  bookElement.appendChild(bookPublishDate);

  bookList.appendChild(bookElement);
}


fetchBooks();

// async function fetchBookCount({ title, author, subject, publishDate } = {}) {
//     const queryParams = new URLSearchParams();
//     if (title) queryParams.append('title', title);
//     if (author) queryParams.append('author', author);
//     if (subject) queryParams.append('subject', subject);
//     if (publishDate) queryParams.append('publishDate', publishDate);
  
//     try {
//       const response = await fetch(`http://localhost:3000/books/count?${queryParams}`);
//       const { count } = await response.json();
//       console.log(`Book count: ${count}`);
//     } catch (error) {
//       console.error(error.message);
//     }
//   }


// async function fetchBooks({ title, author, subject, publishDate, page } = {}) {
//   const queryParams = new URLSearchParams();
//   if (title) queryParams.append('title', title);
//   if (author) queryParams.append('author', author);
//   if (subject) queryParams.append('subject', subject);
//   if (publishDate) queryParams.append('publishDate', publishDate);
//   if (page) queryParams.append('page', page);

//   try {
//     const response = await fetch(`http://localhost:3000/books?${queryParams}`);
//     const books = await response.json();
//     displayBooks(books);
//   } catch (error) {
//     console.error(error.message);
//   }
// }