const bookList = document.getElementById('book-list');
let page = 1;
let endOfBooks = false;
let posting = false;
let whileadding = false;
let getBooksurl = `https://librarymanagementnode.onrender.com/api/v1/booksPage?page=${page}&limit=10`;
let getAllBooksurl = `https://librarymanagementnode.onrender.com/api/v1/books`;
let postBooksUrl = `https://librarymanagementnode.onrender.com/api/v1/books`;
let permanantDataArray  = [];
let dataArray = [];
// the below code doesn't follow much of mnemonics rules i'll update it ASAP
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
    .then((response) => {
      try{
        document.getElementById("loadingText").remove();
      }
      catch(e){
        
      }
      returndata =  response.json()}
    )

    .catch((error) => {
      console.log("429 - Too Many Request Error - Not a Problem - Try Again Later - 👍");
      let timebomb = 3;
      let timeout;

      timeout = setInterval(()=>{
        if(timebomb>=0){
          bookList.innerHTML = `<b>Server Down - Try Again in ${timebomb}</b>`
          timebomb-=1;
        }
        else{
          clearInterval(timeout);
          bookList.innerHTML = `<b id="loadingText">Loading...</b>`
          timebomb = 3;
          fetchBooksPage(getAllBooksurl);
        }
      },1000)
    });
    return returndata;
}


const loadingElem = document.getElementById('loading');
let loading = false;
//fetch books function that is not used currently
async function fetchBooks() {
  loading = true;
  loadingElem.classList.add('loading');
    try {
      await sendHttpRequest('GET',getAllBooksurl).then((responseData)=>{
          
        const arr = responseData.data;
        // const res =  arr.filter(book => book["author"].includes("Dan"));
        // displayBooks(responseData.data);
        responseData.data.map((e)=>{
          permanantDataArray.push(e);
        });
        (responseData.data).map(e =>{
          dataArray.push(e);
        });
        displayBooksUsingArray();       
        endOfBooks=true;
        page= Number.parseInt(responseData.data.length/10 + 1) - 1;  
      })
    } catch (error) {
      console.error(error.message);
    }
    loadingElem.classList.remove('loading');
    loading = false;
  }


  //fetches books page by page 
  async function fetchBooksPage(url) {
    loading = true;
    loadingElem.classList.add('loading');
    let resultdata;
    try {
      await sendHttpRequest('GET',url).then((responseData)=>{
        resultdata = responseData;
        // displayBooksBypage(responseData.data);
        // (responseData.data).map((e)=>{
        //   permanantDataArray.push(e);
        // });
        // (responseData.data).map(e => {
        //   dataArray.push(e);
        // });
        permanantDataArray = [...permanantDataArray,...responseData.data];
        dataArray = [...responseData.data];
        // console.log(dataArray);
        displayBooksUsingArray();
      })
    } catch (error) {
      console.error(error.message);
    }
    loadingElem.classList.remove('loading');
    loading = false;
    return resultdata;
  }

fetchBooksPage(getBooksurl);
//displaybook function gets books data fetched from db and creates card , instead of adding it to an array
function displayBooks(books) {
  bookList.innerHTML = '';
  books.forEach((book) => {
    createCard(book);
  });
  updateRes();
}
function displayBooksBypage(books) {
  books.forEach((book) => {
    createCard(book);
  });
  updateRes();
}

function displayBooksUsingArray() {
    dataArray.forEach((book) => {
    createCard(book);
  });
  updateRes();
}

//post book function  
async function postOneBook(body){
  try{
    await sendHttpRequest('POST',postBooksUrl,body).then((response)=>{
        // console.log('');
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
      newdate = date.toLocaleDateString('en-US', {
          day: 'numeric',month : 'short' , year: 'numeric'});
      // const month = date.toLocaleDateString('en-US', {
      //     month: 'short',});
      // const year = date.toLocaleDateString('en-US', {
      //     year: 'numeric',});
      // newdate = day+" "+month+" "+year;
      
  }

  let imageData , imageLink, previewLink;
  if(!book.imageLink && !book.previewLink){
  let bookImageObj = await sendHttpRequest('GET' , `https://www.googleapis.com/books/v1/volumes?q=${book.title}`);
   imageLink = (bookImageObj.items && bookImageObj.items[0] && bookImageObj.items[0].volumeInfo &&bookImageObj.items[0].volumeInfo.imageLinks && bookImageObj.items[0].volumeInfo.imageLinks.thumbnail) ? bookImageObj.items[0].volumeInfo.imageLinks.thumbnail : "";
   previewLink = (bookImageObj.items && bookImageObj.items[0] && bookImageObj.items[0].volumeInfo &&bookImageObj.items[0].volumeInfo.imageLinks && bookImageObj.items[0].volumeInfo.previewLink) ? bookImageObj.items[0].volumeInfo.previewLink : "";
    async  function updateBookDetails(){
       imageData = await sendHttpRequest('PATCH',`https://librarymanagementnode.onrender.com/api/v1/books`,{
          id : book._id,
          imageLink : imageLink,
          previewLink : previewLink,
        }); 
    }
    updateBookDetails();
    // imageLink = `data:image/jpeg;base64,${imageData.coverImage.toString('base64')}`;
    // previewLink = 
  }
  else{
      previewLink = book.previewLink;
      imageLink =  book.coverImage;;
  }
  
  const bookElement = document.createElement('div');
  bookElement.innerHTML = `<div class="bookelement">
  <div class="booktop">
      <div class="bookimage">
          <img src=${imageLink?imageLink:`./assets/book.svg`}  alt="book" height="80%"  width="80%"  style="border-radius: 10px;" ${previewLink?`onclick="window.open('${previewLink}','_blank');"`:''}>
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
  // BookMap.set(book.id,bookElement);
  // return bookElement;
}

//to show and hide results count from search
let showres = document.getElementById('showreswrapper');
let searchfocus = document.getElementById('myInput');
let bookswrapper = document.getElementById('book-list');

searchfocus.addEventListener("focus", function() {
  loading = true;
  showres.style.display = 'flex';
  setTimeout(() => {showres.classList.add('visible');}
  , 0);

});

searchfocus.addEventListener("blur", function() {
  if(!searchfocus.value)
  {
  showres.classList.remove('visible');
  showres.style.display = 'none';
  loading = false;
  }
  
});


//to update count results of search
function updateRes(){
  // const visibleCount = Array.from(document.querySelectorAll("#book-list .bookelement"))
  // .filter(element => element.style.display !== "none").length;
  const visibleCount = dataArray.length;
  const showRes = document.querySelector(".showres");
  showRes.textContent = `Showing ${visibleCount} results from `;
}

//sorting
function sortByTitle() {
  let bookElements = bookList.querySelectorAll('.bookelement');
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
  //   
  sortedBooks.forEach(book => bookList.appendChild(book));
}

let dropbtn  = document.querySelector('.sortbox .dropbtn');
document.querySelector('.sortbox .dropdown-content').addEventListener('click', (event) => {
  event.preventDefault();
  if (event.target.matches('a')) {
    const sortBy = event.target.textContent.toLowerCase();
      
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


function disableScroll() {
  
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  window.onscroll = () => {
    window.scrollTo({
      top: scrollTop,
      left: scrollLeft, 
      behavior: 'instant'
    })
  }
}

function enableScroll() {
    window.onscroll = null;
}

//to post new book data
document.getElementById('postbox').addEventListener('click', () => {
  whileadding = true;
  disableScroll()
  endOfBooks=true;
  let dialogBox = document.createElement('div');
  dialogBox.setAttribute('id', 'dialog-box');
  dialogBox.innerHTML = `
    <div id="dialog-content">
      <h2>Add Book</h2>
      <label for="title">Title:</label>
      <input type="text" id="title" name="title">
      <label for="author">Author:</label>
      <input type="text" id="author" name="author">
      <label for="date">Published Date: </label>
      <input type="date" pattern="\d{4}/\d{2}/\d{2}" id="date" name="date" max="${new Date().toISOString().slice(0,10)}">
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
    if(!posting){
      posting = true;
    let title = document.getElementById('title').value.trim();
    let author = document.getElementById('author').value.trim();
    let date = document.getElementById('date').value.trim();
    let subject = document.getElementById('subject').value.trim();
    let description = document.getElementById('description').value.trim();
    if((title+author+date+subject+description).includes('<script>') || title=='' || author=='' || date == '' || subject == '' || description == ''){alert('Enter valid book details!');return}
      else{let obj = {
        title : title,
        author : author, 
        publishedDate : date,
        subject : subject,
        desc : description 
      }
      await postOneBook(obj).then(()=>{
        alert('Posted successully!');
        endOfBooks=false;
      }).catch((err)=>alert('Something went wrong!' + err.message));
      dialogBox.remove();
      }
      posting=false;
      enableScroll();
      endOfBooks=false;
      whileadding = false;
    }
  });

  let cancelBtn = document.getElementById('cancel');
  cancelBtn.addEventListener('click', () => {
    dialogBox.remove();
    enableScroll();
    endOfBooks=false;
    whileadding = false;
  });

  // click outside the dialog box to exit add dialog box
  // document.getElementById('dialog-box').addEventListener('click', (e) => {
  //   // dialogBox.childNodes.forEach((node) => {
  //   //   node.
  //   // })
  //   document.getElementById('dialog-box').remove();
  //   enableScroll();
  //   endOfBooks=false;
  //   whileadding = false;
  // })
});

document.body.addEventListener('keydown', (e) => {
  if(whileadding && e.key === 'Escape'){
    document.getElementById('dialog-box').remove();
    enableScroll();
    endOfBooks=false;
    whileadding = false;
  }
})

//scroll to top and bottom of the screen button 
let gototop = document.getElementById('go-to-top');
let gotobottom = document.getElementById('go-to-bottom');
let prevPageOffset = 0
function scrollFunction() {
  if(!whileadding){let currPageOffset =  window.pageYOffset  || document.documentElement.scrollTop;
  if (currPageOffset<prevPageOffset )  {
    gototop.style.display = "block";
    gototop.classList.add("hideScroll");
    gotobottom.style.display = "none";
    gotobottom.classList.remove("hideScroll");
  } else {
    gotobottom.style.display = "block";
    gotobottom.classList.add("hideScroll");
    gototop.style.display = "none";
    gototop.classList.remove("hideScroll");
  }
  prevPageOffset = currPageOffset;}
}

gototop.addEventListener('click', ()=>{
  if(!whileadding){
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;}
});

gototop.addEventListener('mouseenter', ()=>{
  if(!whileadding){
  gototop.classList.remove("hideScroll");
  gototop.style.display = 'block';}
});
gototop.addEventListener('mouseleave', ()=>{
  if(!whileadding){
  gototop.classList.add("hideScroll");}
});

gotobottom.addEventListener('click' , () =>{
  if(!whileadding){
  window.scrollTo(0,document.body.scrollHeight);}
})

gotobottom.addEventListener('mouseenter' , () =>{
  if(!whileadding){
  gotobottom.classList.remove("hideScroll");
  gotobottom.style.display = 'block';}
})
gotobottom.addEventListener('mouseleave' , () =>{
  if(!whileadding){
  gotobottom.classList.add("hideScroll");}
})




// search and search filtering with debouncing 

let sortBy = 'all';
document.getElementById('myInput').addEventListener('input',(e)=>{
  updateSearch(e.target.value);
});

let updateSearch = debounce((text)=>{

  endOfBooks = true;
  let searchtext = text.toString().toLowerCase().trim();
  
  dataArray = permanantDataArray.filter((e)=>{
    let titleText = e.title.toString().toLowerCase().trim();
    let subjectText = e.subject.toString().toLowerCase().trim();
    let descText = e.desc.toString().toLowerCase().trim();
    let authorText = e.author.toString().toLowerCase().trim();
    let date  = new Date(e.publishedDate);
    let PublishdateText = date.toLocaleDateString('en-US',{day:'numeric',month:'short',year : 'numeric'}).toLocaleLowerCase().trim();
    let all = titleText + subjectText + descText + authorText + PublishdateText ;
    if(sortBy=='all' &&  all.includes(searchtext)){
      return true;
    }
    else{
        if(sortBy == 'title' && titleText.includes(searchtext)){
          return true;
        }
        else if(sortBy == 'author' && authorText.includes(searchtext)){
          return true;
        }
        else if(sortBy == 'date' && PublishdateText.includes(searchtext)){
          return true;
        }
        else if(sortBy == 'subject' && subjectText.includes(searchtext)){
          return true;
        }
        else if(sortBy == 'description' && descText.includes(searchtext)){
          return true;
        }
    }
  });
  // console.log(dataArray);
  bookList.innerHTML = '';
  displayBooksUsingArray();
  endOfBooks = false;
})


const dropdownLinks = document.querySelectorAll('.filterforsearch .dropdown-content a');
let filterdropbtn  = document.querySelector('.filterforsearch .dropbtn');
dropdownLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    sortBy = event.target.dataset.sortby;
    // console.log(sortBy);
    let value = document.getElementById('myInput').value;
      updateSearch(value);
    
    if(sortBy=='title')filterdropbtn.innerHTML = 'title';
    else if(sortBy=='description')filterdropbtn.innerHTML = 'description';
    else if(sortBy=='author')filterdropbtn.innerHTML = 'author';
    else if(sortBy=='subject')filterdropbtn.innerHTML = 'subject';
    else if(sortBy=='date')filterdropbtn.innerHTML = 'date';
    else filterdropbtn.innerHTML = 'all';
  })
})

function debounce(cb,delay=1000){
  let timeout;
  return (...args)=>{
    clearTimeout(timeout);
    timeout = setTimeout(()=>{
      cb(...args);
    },delay);
  }
} 


function throttle(cb,delay = 1000){
  let shouldWait = false;
  let waitingArgs ;
  let timeoutfunc = ()=>{
      if(waitingArgs==null){
      shouldWait = false;}
      else{
          cb(...waitingArgs);
          waitingArgs = null;
           setTimeout(timeoutfunc,delay);
      }
  }
  return (...args) => {
      if(shouldWait){
          waitingArgs = args;
          return;
      }
      cb(...args)
      shouldWait = true;
      setTimeout(timeoutfunc,delay)
  }
}

//scroll functions into throttling
let allScrollFunctions = throttle(async (event) => {
    // console.log(window.scrollY);
    scrollFunction();
    if (!endOfBooks && window.innerHeight + window.scrollY  >= (document.body.offsetHeight - 30 ) && !loading ) {
      page += 1;
    await fetchBooksPage(`https://librarymanagementnode.onrender.com/api/v1/booksPage?page=${page}&limit=10`).then((res)=>{
          if(res.data.length==0){
            endOfBooks=true;
            page-=1
          }
      });
    }
},300);

//loading animation and generate new data by using fetch 
window.addEventListener('scroll',allScrollFunctions);
//end of javascript



// commented out functions for future reference

// search api - working perfect
// let searchBy = 'all';
// document.getElementById('myInput').addEventListener('input',(e)=>updateSearchApi(e.target.value));
// let updateSearchApi = debounce(async(text)=>{
//   let searchText = text.toLowerCase().trim();
//     if(searchText==''){
//       dataArray = []
//       permanantDataArray.map((e)=>{
//         dataArray.push(e);
//       })
//       displayBooksUsingArray();
//       return;
//     }
//   await sendHttpRequest('GET', `https://librarymanagementnode.onrender.com/api/v1/searchBooks?searchQuery=${searchText}&searchBy=${searchBy}`)
//   .then((response)=>{
//     dataArray = [];
//     console.log(response);
//     response.map((e)=>{
//       dataArray.push(e);
//     });
//     bookList.innerHTML = '';
//     displayBooksUsingArray();
//     return;
//   })
// })

// const dropdownLinks = document.querySelectorAll('.filterforsearch .dropdown-content a');
// let filterdropbtn  = document.querySelector('.filterforsearch .dropbtn');
// dropdownLinks.forEach(link => {
//   link.addEventListener('click', (event) => {
//     event.preventDefault();
//     searchBy = event.target.dataset.sortby;
//     // console.log(sortBy);
//     let value = document.getElementById('myInput').value;
//     updateSearchApi(value);
    
//     if(searchBy=='title')filterdropbtn.innerHTML = 'title';
//     else if(searchBy=='description')filterdropbtn.innerHTML = 'description';
//     else if(searchBy=='author')filterdropbtn.innerHTML = 'author';
//     else if(searchBy=='subject')filterdropbtn.innerHTML = 'subject';
//     else if(searchBy=='date')filterdropbtn.innerHTML = 'date';
//     else filterdropbtn.innerHTML = 'all';
//   })
// })

// dont go below this
//filter search results function - inefficient must switch to better way
// const dropdownLinks = document.querySelectorAll('.filterforsearch .dropdown-content a');
// let filterdropbtn  = document.querySelector('.filterforsearch .dropbtn');
// dropdownLinks.forEach(link => {
//   link.addEventListener('click', (event) => {
//     event.preventDefault();

//     const sortBy = event.target.dataset.sortby;

//     const bookElements = document.querySelectorAll('.bookelement');
//     bookElements.forEach(bookElement => {
//       const title = bookElement.querySelector('.title').textContent.toLowerCase();
//       const author = bookElement.querySelector('.author').textContent.toLowerCase();
//       const publishDate = bookElement.querySelector('.publishdate').textContent.toLowerCase();
//       const subject = bookElement.querySelector('.subject').textContent.toLowerCase();
//       let desc = bookElement.querySelector('.desc').textContent.toLowerCase();
//       let searchText = document.getElementById(('myInput')).value.toLowerCase().trim();
//       // desc = desc.trim().slice(0,13).trim();
//       desc = desc.replace('description:', '').trim();
//       switch (sortBy) {
//         case 'title':
//           filterdropbtn.innerHTML = 'Title';
//           bookElement.style.display = title.includes(searchText) ? 'block' : 'none';
//           break;
//         case 'author':
//           filterdropbtn.innerHTML = 'Author';
//           bookElement.style.display = author.includes(searchText) ? 'block' : 'none';
//           break;
//         case 'date':
//           filterdropbtn.innerHTML = 'Date';
//           bookElement.style.display = publishDate.includes(searchText) ? 'block' : 'none';
//           break;
//         case 'subject':
//           filterdropbtn.innerHTML = 'Subject';
//           bookElement.style.display = subject.includes(searchText) ? 'block' : 'none';
//           break;
//         case 'description':
//           filterdropbtn.innerHTML = 'Description';
//           bookElement.style.display = desc.includes(searchText) ? 'block' : 'none';
//           break;
//         case 'all':
//           filterdropbtn.innerHTML = 'All';
//           const allFields = title + author + publishDate + subject + desc;
//           bookElement.style.display = allFields.includes(searchText) ? 'block' : 'none';
//           break;
//         default:
//           filterdropbtn.innerHTML = 'All';
//           fetchBooks();
//           bookElement.style.display = 'block';
        
//       }

//       updateRes();
//     });
//   });
// });

// setTimeout(()=>{
//   const currlen = document.querySelectorAll('.bookelement').length;
// const showres = document.querySelector('.showres');
// showres.innerHTML = `Showing results ${currlen} from `;
// },5000);


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
//       
//   }).catch(function (error) {
//     console.error(error);
//   });

// }



  // search using jquery credits - w3schools
  // $(document).ready(function(){
  //   $("#myInput").on("keyup", function() {
  //     var value = $(this).val().toLowerCase();
  //     $("#book-list .bookelement").filter(function() {
  //       $(this).toggle($(this).text().trim().replace("Description:", "").toLowerCase().indexOf(value) > -1);
  //       // Update the "Showing results" message
  //       updateRes();
        
  //     });
  //   });
  // });