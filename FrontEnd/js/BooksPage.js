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
  var date = new Date(book.publishDate); // Parse the string date into a date object

  let newdate = '';
  if (date) {
      const day = date.toLocaleDateString('en-US', {
          day: 'numeric',});
      const month = date.toLocaleDateString('en-US', {
          month: 'short',});
      const year = date.toLocaleDateString('en-US', {
          year: 'numeric',});
      newdate = day+" "+month+" "+year;
  }
  const bookElement = document.createElement('div');
  bookElement.innerHTML = `  <div class="bookelement">
  <div class="booktop">
      <div class="bookimage">
          <img src="../assets/book.svg" height="100vh" width="100vw">
      </div>
      <div class="smallinfo">
          <div class="title">
          ${book.title}
          </div>
          <div class="author">
          ${book.author}
          </div>
          <div class="publishdate">
          ${newdate}
          </div>
          <div class="subject">
          ${book.subject}
          </div>
      </div>
  </div>
  <div class="bookdown">
      <div class="desc">
      ${book.desc}
      </div>
  </div>
  </div>`
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

// search
$(document).ready(function(){
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#book-list .bookelement").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  let currLen = 0;
  function updateRes() {  
     currLen = $("#book-list .bookelement").length;
  $(".showres").html("Showing results " + currLen + " from ");
  }

  setInterval(updateRes, 100);
});