let myLibrary = [];
let libraryDefault = [];
let id = 1

const storage = window.localStorage;

//initialize DOM
const card = document.querySelector('.card');
const modal = document.querySelector('.modal-container');
const form = document.querySelector('#input')

class books {
    constructor(title, author, pages, isRead) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }
}

function addToLibrary(books) {
    let obj = {
        title: books.title,
        author: books.author,
        pages: books.pages,
        isRead: books.isRead
    }
    myLibrary = JSON.parse(storage.getItem('library'))
    myLibrary.push(obj);
    updateStorage(myLibrary);
}

function updateBook(title, status) {
    const library = JSON.parse(storage.getItem('library'));
    library.map( data => {
        data.title === title ? data.status = status : 'not find'
    })
    updateStorage(library);

}

function deleteBook(title) {
    const library = JSON.parse(storage.getItem('library'));
    let index = library.indexOf(data => data.title === title);
    const newLibrary = library.splice(index, 1);
    updateStorage(newLibrary);
}


function getBook() {
    const submit = form.querySelector('#submit');
    
    submit.addEventListener('click', (e) => {
        const status = form.querySelector('#status').value;
        const title = form.querySelector('#title').value;
        const author = form.querySelector('#author').value;
        const pages = form.querySelector('#pages').value;

        const book = new books(title, author, pages, status);
        addToLibrary(book);
    })
}


function toogleModal() {
    const modal = document.querySelector('.modal-container');
    const button = document.querySelector('.add button');
    button.addEventListener('click', () => {
        modal.classList.add('display');
    })
}

function closeModal() {
    const close = document.querySelector('#close');
    close.addEventListener('click', () => {
        modal.classList.remove('display');
    })
    window.addEventListener('click', (e) => {
        if(e.target == modal) {
            modal.classList.remove('display');
        }
    })

}

function updateStorage(library) {
    storage.setItem('library', JSON.stringify(library));
}

function checkStorage() {
    // if(storage.getItem('library')) {
        myLibrary = JSON.parse(storage.getItem('library'));
        return myLibrary;
    // } else {

    // }
}

function setData() {
    const library = checkStorage();
    library.map(value => {
        const cards = renderData(value);
        card.insertAdjacentHTML('beforeend', cards);
        card.addEventListener('click', buttonCard)
    })
} 

function buttonCard(e) {
    if(e.target.classList.contains('delete')) {
        const bookEl = e.target.parentNode.previousElementSibling;
        const parent = e.target.parentNode.parentNode.parentNode;
        const child = e.target.parentNode.parentNode;
        deleteBook(bookEl.firstChild.nextElementSibling.innerHTML);
        parent.removeChild(child);
    } else if(e.target.classList.contains('status')) {
        const bookEl = e.target.parentNode.previousElementSibling;
        if(e.target.innerHTML === 'Not Read') {
            const title = bookEl.firstChild.nextElementSibling.innerHTML
            updateBook(title, 'is Read')
            e.target.style.backgroundColor = 'var(--add)'
            e.target.style.color = 'var(--neutral)'
        } else {
            const title = bookEl.firstChild.nextElementSibling.innerHTML
            updateBook(title, 'is Read')
            e.target.style.backgroundColor = 'var(--neutral)'
            e.target.style.color = 'var(--black)'
        }
    }
}

function renderData(data) {
    let read = '';
    if(data.read === 'on') {
        read = 'is Read'
    } else {
        read = 'Not Read'
    }
    return `
        <div class="card-content">
                <div class="book">
                    <h3 class="title">"${data.title}"</h3>
                    <h3 class="author">${data.author}</h3>
                    <h3 class="pages">${data.pages}</h3>
                </div>
                <div class="button-content">
                    <button class="status">${read}</button>
                    <button class="delete">Delete</button>
                </div>
            </div>
        `
} 

function main() {
    toogleModal();
    closeModal();
    checkStorage();
    getBook();
    setData();
}

main()