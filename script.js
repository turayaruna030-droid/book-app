const bookForm = document.getElementById("book-form");
const bookTitle = document.getElementById("book-title");
const bookAuthor = document.getElementById("book-author");
const bookLink = document.getElementById("book-link");
const bookContent = document.getElementById("book-content");
const bookList = document.getElementById("book-list");
const searchBook = document.getElementById("search-book");
const bookFilter = document.getElementById("book-filter");
const bookStats = document.getElementById("book-stats");
const clearBooksButton = document.getElementById("clear-books-btn");
const reader = document.getElementById("reader");
const readerTitle = document.getElementById("reader-title");
const readerContent = document.getElementById("reader-content");
const closeReaderButton = document.getElementById("close-reader-btn");

let books = JSON.parse(localStorage.getItem("books")) || [];

function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
}

function displayBooks() {
  bookList.innerHTML = "";

  const readCount = books.filter(function (book) {
    return book.read;
  }).length;

  bookStats.textContent =
    "Total books: " + books.length +
    " | Read: " + readCount +
    " | Unread: " + (books.length - readCount);

  const searchText = searchBook.value.toLowerCase();
  const filterValue = bookFilter.value;

  books.forEach(function (book, index) {
    const matchesSearch =
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText);

    if (!matchesSearch) return;
    if (filterValue === "read" && !book.read) return;
    if (filterValue === "unread" && book.read) return;

    const bookElement = document.createElement("article");
    bookElement.classList.add("book");

    if (book.read) {
      bookElement.classList.add("read");
    }

    bookElement.innerHTML = `
      <div>
        <h3>${book.title}</h3>
        <p>by ${book.author}</p>
      </div>
      <div class="book-actions">
        <button class="find-btn">Find Book</button>
        ${book.content ? '<button class="inside-read-btn">Read Inside App</button>' : ""}
        ${book.link ? '<button class="open-btn">Read Book</button>' : ""}
        <button class="read-btn">${book.read ? "Read" : "Mark as Read"}</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    bookElement.querySelector(".find-btn").addEventListener("click", function () {
      const search = encodeURIComponent(book.title + " " + book.author);
      window.open("https://books.google.com/books?q=" + search, "_blank");
    });

    const insideReadButton = bookElement.querySelector(".inside-read-btn");

    if (insideReadButton) {
      insideReadButton.addEventListener("click", function () {
        readerTitle.textContent = book.title + " — " + book.author;
        readerContent.textContent = book.content;
        reader.hidden = false;
        reader.scrollIntoView({ behavior: "smooth" });
      });
    }

    const openButton = bookElement.querySelector(".open-btn");

    if (openButton) {
      openButton.addEventListener("click", function () {
        window.open(book.link, "_blank");
      });
    }

    bookElement.querySelector(".read-btn").addEventListener("click", function () {
      books[index].read = !books[index].read;
      saveBooks();
      displayBooks();
    });

    bookElement.querySelector(".edit-btn").addEventListener("click", function () {
      const newTitle = prompt("Enter the new book title:", book.title);
      const newAuthor = prompt("Enter the new author name:", book.author);
      const newLink = prompt("Enter the book reading link:", book.link || "");

      if (newTitle && newAuthor) {
        books[index].title = newTitle;
        books[index].author = newAuthor;
        books[index].link = newLink || "";
        saveBooks();
        displayBooks();
      }
    });

    bookElement.querySelector(".delete-btn").addEventListener("click", function () {
      books.splice(index, 1);
      saveBooks();
      displayBooks();
    });

    bookList.appendChild(bookElement);
  });
}

bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  books.push({
    title: bookTitle.value,
    author: bookAuthor.value,
    link: bookLink.value,
    content: bookContent.value,
    read: false
  });

  saveBooks();
  displayBooks();

  bookTitle.value = "";
  bookAuthor.value = "";
  bookLink.value = "";
  bookContent.value = "";
  bookTitle.focus();
});

searchBook.addEventListener("input", displayBooks);
bookFilter.addEventListener("change", displayBooks);

clearBooksButton.addEventListener("click", function () {
  if (confirm("Do you want to delete every book?")) {
    books = [];
    saveBooks();
    displayBooks();
  }
});

closeReaderButton.addEventListener("click", function () {
  reader.hidden = true;
});

displayBooks();