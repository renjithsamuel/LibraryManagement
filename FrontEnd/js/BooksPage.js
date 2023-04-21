const bookList = document.getElementById('book-list');
let page = 1;
let getBooksurl = `https://librarymanagementnode.onrender.com/api/v1/booksPage?page=${page}&limit=10`;
let getAllBooksurl = `https://librarymanagementnode.onrender.com/api/v1/books`;
let postBooksUrl = `https://librarymanagementnode.onrender.com/api/v1/books`;

//fetch request function 
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

//fetch books function that is not used currently
async function fetchBooks() {
    try {
      await sendHttpRequest('GET',getAllBooksurl).then((responseData)=>{
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

  //fetches books page by page 
  async function fetchBooksPage(url) {
    try {
      await sendHttpRequest('GET',url).then((responseData)=>{
        // console.log(responseData.data);
        displayBooksBypage(responseData.data);
      })
    } catch (error) {
      console.error(error.message);
    }
  }

  fetchBooksPage(getBooksurl);
//displaybook function gets books data fetched from db and creates card , instead of adding it to an array
function displayBooks(books) {
  console.log(books);
  bookList.innerHTML = '';
  books.forEach((book) => {
    createCard(book);
  });
}
function displayBooksBypage(books) {
  console.log(books); 
  books.forEach((book) => {
    createCard(book);
  });
}

//post book function  
async function postOneBook(body){
  try{
    await sendHttpRequest('POST',postBooksUrl,body).then((response)=>{
      console.log(response);
      console.log('posted!');
    });
  }catch(err){
    console.error(err.message);
  }
} 

//funciton that creates card and updates number of cards
async function createCard(book){
  var date = new Date(book.publishedDate); 

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
  let bookImageObj = await sendHttpRequest('GET' , `https://www.googleapis.com/books/v1/volumes?q=${book.title}`);
  let imageLink = (bookImageObj.items && bookImageObj.items[0] && bookImageObj.items[0].volumeInfo && bookImageObj.items[0].volumeInfo.imageLinks && bookImageObj.items[0].volumeInfo.imageLinks.thumbnail) ? bookImageObj.items[0].volumeInfo.imageLinks.thumbnail : `./assets/book.svg`;
  // let imageLink = (bookImageObj.items[0].volumeInfo.imageLinks.thumbnail)!=null?bookImageObj.items[0].volumeInfo.imageLinks.thumbnail:`./assets/book.svg`;
  // let imageLink = bookImageObj.items[0].volumeInfo.imageLinks.thumbnail; //BooksPage.js:96  Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'thumbnail')at createCard (BooksPage.js:96:63) error😢
  const bookElement = document.createElement('div');
  bookElement.innerHTML = `<div class="bookelement">
  <div class="booktop">
      <div class="bookimage">
          <img src=${imageLink}  alt="book" height="80%"  width="80%"  style="border-radius: 10px;">
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
      <strong>Description:</strong> <br>
      ${book.desc}
      </div>
  </div>
  </div>`
  bookList.appendChild(bookElement);
  updateRes();
}



// search using jquery credits - w3schools
$(document).ready(function(){
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#book-list .bookelement").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      // Update the "Showing results" message
      updateRes();
      
    });
  });
});

//to show and hide results count from search
let showres = document.getElementById('showreswrapper');
let searchfocus = document.getElementById('myInput');
let bookswrapper = document.getElementById('book-list');

searchfocus.addEventListener("focus", function() {
  showres.style.display = 'flex';
  setTimeout(() => {showres.classList.add('visible');}
  , 0);

});

searchfocus.addEventListener("blur", function() {
  
  if(!searchfocus.value) {showres.classList.remove('visible');
  showres.style.display = 'none';}
});


//to update count results of search
function updateRes(){
  const visibleCount = Array.from(document.querySelectorAll("#book-list .bookelement"))
  .filter(element => element.style.display !== "none").length;

  const showRes = document.querySelector(".showres");
  showRes.textContent = `Showing ${visibleCount} results from `;
}

//sorting
function sortByTitle() {
  let bookElements = bookList.querySelectorAll('.bookelement');
  console.log(bookElements);
  const sortedBooks = Array.from(bookElements)
  .sort((a, b) => a.querySelector('.title').textContent.localeCompare(b.querySelector('.title').textContent));
  sortedBooks.forEach(book => bookList.appendChild(book));
}

function sortByAuthor() {
  let bookElements = bookList.querySelectorAll('.bookelement');
  const sortedBooks = Array.from(bookElements)
  .sort((a, b) => a.querySelector('.author').textContent.localeCompare(b.querySelector('.author').textContent));
  sortedBooks.forEach(book => bookList.appendChild(book));
}

function sortByDate() {
  let bookElements = bookList.querySelectorAll('.bookelement');
  const sortedBooks = Array.from(bookElements)
  .sort((a, b) => new Date(a.querySelector('.publishdate').textContent) - new Date(b.querySelector('.publishdate').textContent));
  sortedBooks.forEach(book => bookList.appendChild(book));
}

function sortBySubject() {
  let bookElements = bookList.querySelectorAll('.bookelement');
  const sortedBooks = Array.from(bookElements)
    .sort((a, b) => a.querySelector('.subject').textContent.localeCompare(b.querySelector('.subject').textContent));
  // console.log(sortedBooks);
  sortedBooks.forEach(book => bookList.appendChild(book));
}

let dropbtn  = document.querySelector('.sortbox .dropbtn');
document.querySelector('.sortbox .dropdown-content').addEventListener('click', (event) => {
  
  if (event.target.matches('a')) {
    const sortBy = event.target.textContent.toLowerCase();
    console.log(sortBy);
    if (sortBy === 'title') {
      dropbtn.innerHTML = 'Title';
      sortByTitle();
    } else if (sortBy === 'author') {
      dropbtn.innerHTML = 'Author';
      sortByAuthor();
    } else if (sortBy === 'date') {
      dropbtn.innerHTML = 'Date';
      sortByDate();
    } else if (sortBy === 'subject') {
      dropbtn.innerHTML = 'Subject';
      sortBySubject();
    }
    else {
      dropbtn.innerHTML = 'Sort by';
      fetchBooks();
    }
  }
});



//filter search results function - inefficient must switch to better way
const dropdownLinks = document.querySelectorAll('.filterforsearch .dropdown-content a');
let filterdropbtn  = document.querySelector('.filterforsearch .dropbtn');
dropdownLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    const sortBy = event.target.dataset.sortby;

    const bookElements = document.querySelectorAll('.bookelement');
    bookElements.forEach(bookElement => {
      const title = bookElement.querySelector('.title').textContent.toLowerCase();
      const author = bookElement.querySelector('.author').textContent.toLowerCase();
      const publishDate = bookElement.querySelector('.publishdate').textContent.toLowerCase();
      const subject = bookElement.querySelector('.subject').textContent.toLowerCase();
      const desc = bookElement.querySelector('.desc').textContent.toLowerCase();
      let searchText = document.getElementById(('myInput')).value;
      console.log(sortBy);
      switch (sortBy) {
        case 'title':
          filterdropbtn.innerHTML = 'Title';
          bookElement.style.display = title.includes(searchText) ? 'block' : 'none';
          break;
        case 'author':
          filterdropbtn.innerHTML = 'Author';
          bookElement.style.display = author.includes(searchText) ? 'block' : 'none';
          break;
        case 'date':
          filterdropbtn.innerHTML = 'Date';
          bookElement.style.display = publishDate.includes(searchText) ? 'block' : 'none';
          break;
        case 'subject':
          filterdropbtn.innerHTML = 'Subject';
          bookElement.style.display = subject.includes(searchText) ? 'block' : 'none';
          break;
        case 'description':
          filterdropbtn.innerHTML = 'Description';
          bookElement.style.display = desc.includes(searchText) ? 'block' : 'none';
          break;
        case 'all':
          filterdropbtn.innerHTML = 'All';
          const allFields = title + author + publishDate + subject + desc;
          bookElement.style.display = allFields.includes(searchText) ? 'block' : 'none';
          break;
        default:
          filterdropbtn.innerHTML = 'All';
          fetchBooks();
          bookElement.style.display = 'block';
        
      }

      updateRes();
    });
  });
});

// setTimeout(()=>{
//   const currlen = document.querySelectorAll('.bookelement').length;
// const showres = document.querySelector('.showres');
// showres.innerHTML = `Showing results ${currlen} from `;
// },5000);



//loading animation and generate new data by using fetch 
const loadingElem = document.getElementById('loading');
let loading = false;

window.addEventListener('scroll', async (event) => {
 
  if (window.innerHeight + window.scrollY  >= document.body.offsetHeight && !loading) {
    console.log("Reached end!");
    loading = true; 
    console.log(loading?"loading":"");
    loadingElem.classList.add('loading');
    page += 1;
    console.log(page);
    fetchBooksPage(`https://librarymanagementnode.onrender.com/api/v1/booksPage?page=${page}&limit=10`).then(()=>{
        loadingElem.classList.remove('loading');
        loading = false;
    });
  }
});


//slogan genarator from RapidAPI test failed
// getSlogan();  
// //slogan generator
// async function getSlogan(){  
//   await await fetch("https://andruxnet-random-famous-quotes.p.rapidapi.com/", {    
//     method: 'GET',
//     params: {cat: 'famous', count: '1'},
//     headers: {
//       'X-RapidAPI-Key': '274c49fc77mshdc27b81036cbb24p14897ajsn4896a',
//       'X-RapidAPI-Host': 'andruxnet-random-famous-quotes.p.rapidapi.com'
//     },
//     }).then(function (response) {
//     console.log(response.data);
//   }).catch(function (error) {
//     console.error(error);
//   });

// }


//to post new book data
let postbox = document.getElementById('postbox');
postbox.addEventListener('click', () => {
  let dialogBox = document.createElement('div');
  dialogBox.setAttribute('id', 'dialog-box');
  dialogBox.innerHTML = `
    <div id="dialog-content">
      <h2>Add Book</h2>
      <label for="title">Title:</label>
      <input type="text" id="title" name="title">
      <label for="author">Author:</label>
      <input type="text" id="author" name="author">
      <label for="date">Date: </label>
      <input type="date" pattern="\d{4}/\d{2}/\d{2}" id="date" name="date">
      <label for="subject">Subject:</label>
      <input type="text" id="subject" name="subject">
      <label for="description">Description:</label>
      <textarea id="description" name="description"></textarea>
      <button id="add-book">Add Book</button>
      <button id="cancel">Cancel</button>
    </div>
  `;
  document.body.appendChild(dialogBox);

  let addBookBtn = document.getElementById('add-book');
  addBookBtn.addEventListener('click',async () => {
    let title = document.getElementById('title').value;
    let author = document.getElementById('author').value;
    let date = document.getElementById('date').value;
    let subject = document.getElementById('subject').value;
    let description = document.getElementById('description').value;
    if(title=='' || author=='' || date == '' || subject == '' || description == ''){alert('Enter valid book details!');return}
      else{let obj = {
        title : title,
        author : author, 
        publishedDate : date,
        subject : subject,
        desc : description 
      }
      await postOneBook(obj).then(()=>{
        alert('Posted successully!');
      }).catch((err)=>alert('Something went wrong!' + err.message));
      dialogBox.remove();}
      });

  let cancelBtn = document.getElementById('cancel');
  cancelBtn.addEventListener('click', () => {
    dialogBox.remove();
  });
});

//end of javascript