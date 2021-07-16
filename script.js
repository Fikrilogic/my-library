let myLibrary = [];
let libraryDefault = [];
let book;

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

    set status(information) {
        return this.isRead = information
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
    if(myLibrary.some(book => book.title === books.title)) return false
    myLibrary.push(obj);
    updateStorage();
    return true;
}

function getBook(title) {
    myLibrary = JSON.parse(storage.getItem('library'));
    
    for(let lib of myLibrary) {
        if(lib.title === title){
            return lib
        }
    }

    return null
}

function deleteBook(index) {
    myLibrary = JSON.parse(storage.getItem('library'));  
    if(!index) {
        myLibrary.shift()
    } else {
        myLibrary.splice(index, 1);
    }
    updateStorage();
    window.location.reload();
}


function setBook() {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let status = form.querySelector('#status');
        const title = form.querySelector('#title').value;
        const author = form.querySelector('#author').value;
        const pages = form.querySelector('#pages').value;

        if(status.checked === true) {
            status = true
        } else if (status.checked === false) {
            status = false
        }
        book = new books(title, author, pages, status);
        if(addToLibrary(book)) {
            hiddenModal();
            form.reset()
            window.location.reload()
        } else {
            alert('book exists in your library')
        };
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

function hiddenModal() {
    modal.classList.remove('display')
}

function updateStorage() {
    storage.setItem('library', JSON.stringify(myLibrary));
}

function checkStorage() {
    if(storage.getItem('library')) {
        myLibrary = JSON.parse(storage.getItem('library'));
        return myLibrary;
    } else {
        myLibrary = []
        updateStorage();
    }
}

function setData() {
    const library = checkStorage();
    if(!library) {
        alert('empty data')
    } else {
        library.map((value, index) => {
            if(value.isRead === true) {
                value.isRead = 'is Read'
            }

            if(value.isRead === false) {
                value.isRead = 'Not Read'
            }
            const cards = renderData(value,index);
            card.insertAdjacentHTML('beforeend', cards);
            card.addEventListener('click', buttonCard)
        })
    }
} 

function buttonCard(e) {
    if(e.target.classList.contains('delete')) {
        const child = e.target.parentNode.parentNode;
        deleteBook(child.dataset.index);
        const container = document.querySelector('.card');
        container.removeChild(child);
    } else if(e.target.classList.contains('status')) {
        const bookEl = e.target.parentNode.previousElementSibling;
        if(e.target.innerHTML === 'Not Read') {
            const title = bookEl.firstChild.nextElementSibling.innerHTML
            let book = getBook(title);
            book.isRead = true
            e.target.innerHTML = 'is Read'
            e.target.style.backgroundColor = 'var(--add)'
            e.target.style.color = 'var(--neutral)'
            updateStorage()
        } else if(e.target.innerHTML === 'is Read') {
            const title = bookEl.firstChild.nextElementSibling.innerHTML
            let book = getBook(title);
            book.isRead = false
            e.target.innerHTML = 'Not Read'
            e.target.style.backgroundColor = 'var(--remove)'
            e.target.style.color = 'var(--black)'
            updateStorage();
        }
    }
}

function renderData(data,index) {
    if(data.isRead === 'is Read') {
        return `
        <div class="card-content" data-index="${index}">
                <div class="book">
                    <h3 class="title">${data.title}</h3>
                    <h3 class="author">${data.author}</h3>
                    <h3 class="pages">${data.pages}</h3>
                </div>
                <div class="button-content">
                    <button class="status" style="background-color: var(--add)">${data.isRead}</button>
                    <button class="delete">Delete</button>
                </div>
            </div>
        `
    } else if(data.isRead === 'Not Read') {
        return `
        <div class="card-content" data-index="${index}">
                <div class="book">
                    <h3 class="title">${data.title}</h3>
                    <h3 class="author">${data.author}</h3>
                    <h3 class="pages">${data.pages}</h3>
                </div>
                <div class="button-content">
                    <button class="status" style="background-color: var(--remove)">${data.isRead}</button>
                    <button class="delete">Delete</button>
                </div>
            </div>
        `
    }
} 

function main() {
    setData();
    setBook();
    toogleModal();
    closeModal();
}

main()