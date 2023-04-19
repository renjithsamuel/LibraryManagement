const bookList = document.getElementById('book-list');
let page = 1;
let getBooksurl = `https://librarymanagementnode.onrender.com/api/v1/booksPage?page=${page}&limit=11`;
let postBooksUrl = `https://librarymanagementnode.onrender.com/api/v1/books`;

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

  async function fetchBooksPage(url) {
    // Add query handling and pagination logic
    try {
      await sendHttpRequest('GET',url).then((responseData)=>{
        // console.log(responseData.data);
        displayBooksBypage(responseData.data);
      })
    } catch (error) {
      console.error(error.message);
    }
  }

fetchBooks();

function displayBooks(books) {
  console.log(books);
  bookList.innerHTML = ''; // clear the book list before displaying new books
  books.forEach((book) => {
    createCard(book);
  });
}
function displayBooksBypage(books) {
  console.log(books); // clear the book list before displaying new books
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
          <img src="./assets/book.svg" height="100vh" width="100vw">
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



// search
$(document).ready(function(){
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#book-list .bookelement").filter(function() {
      let newLen=0;
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            // Get the number of visible book elements
      const visibleCount = $("#book-list .bookelement:visible").length;

      // Update the "Showing results" message
      const showRes = $(".showres");
      showRes.text(`Showing ${visibleCount} results from `);

    });
  });


});

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
      dropbtn.innerHTML = 'Sort';
      fetchBooks();
    }
  }
  updateRes();
});



//filter search results 

const dropdownLinks = document.querySelectorAll('.filterforsearch .dropdown-content a');
let filterdropbtn  = document.querySelector('.filterforsearch .dropbtn');
// Add event listeners to dropdown links
dropdownLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    // Prevent default link behavior
    event.preventDefault();

    // Get the filter criteria from the clicked link
    const sortBy = event.target.dataset.sortby;

    // Iterate through all book elements and filter them based on criteria
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
          // console.log(bookElement);
          const allFields = title + author + publishDate + subject + desc;
          bookElement.style.display = allFields.includes(searchText) ? 'block' : 'none';
          break;
        default:
          updateRes();
          filterdropbtn.innerHTML = 'All';
          bookElement.style.display = 'block';
        
      }
      updateRes();
    });
  });
});

setTimeout(()=>{
  const currlen = document.querySelectorAll('.bookelement').length;
const showres = document.querySelector('.showres');
showres.innerHTML = `Showing results ${currlen} from `;
},5000);


// $(window).scroll(function() {
//   if($(window).scrollTop() + $(window).height() == $(document).height()) {
//       alert("bottom!");
//   }
// });


window.addEventListener('scroll', (event) => {
  if(window.innerHeight + window.scrollY >= document.body.offsetHeight){
    setTimeout(()=>{},2000);
    page += 1;
    fetchBooksPage(getBooksurl);
  }
});