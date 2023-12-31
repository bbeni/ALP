
// teaser
if (localStorage.length == 0) {
    addCardToStorage(0, "Finish thesis", "Go and finish it!");
    addCardToStorage(1, "Second TODO", "wash dishes");
    addCardToStorage(2, "Collect leaves", "fun but not so important..");
}

const cardTable = document.querySelector(".card-table")

function genCardsFromStorage() {
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i)
        keys.push(key);
    }

    var sortedKeys = keys.sort();
    sortedKeys.forEach( (key) => {
        value = JSON.parse(localStorage.getItem(key));
            addCardAt(key, value[0], value[1])
    });
}

function addCardToStorage(index, title, descr) {
    localStorage.setItem(String(index), JSON.stringify([title, descr]));
}


function updateCardsInStorage() {
    localStorage.clear();
    const todoCards = document.querySelectorAll(".todo-card");
    for (var i = 0; i < todoCards.length; i++) {
        var title = todoCards[i].querySelector(".title");
        var descr = todoCards[i].querySelector(".description");

        addCardToStorage(i, title.innerHTML, descr.innerHTML);
    }
}


function addCardAt(index, title, descr){
    const content = `
        <li class="todo-card" draggable="true">
            <div class="todo-content">
                <span class="title">${title}</span>
                <span class="description">${descr}</span>
            </div>
            <i class="fa-solid fa-grip-lines"></i>
        </li>
    `;

    cardTable.insertAdjacentHTML('beforeend', content);

    // Rebind drag events to all todo cards
    bindDragEvents();
    addCardToStorage(index, title, descr);
}

// add a new Card item
function addCard() {
    const title = document.querySelector("#newTitle").value;
    const descr = document.querySelector("#newDescr").value;

    if (title.trim() === "") {
        return;
    }

    addCardAt(localStorage.length, title, descr);

    var popup = document.getElementById("addPage");
    popup.classList.toggle("show");

    document.querySelector("#newTitle").value = "";
    document.querySelector("#newDescr").value = "";

}

// event listener for inserting the card into the table while dragging
const changeCardTable = (e) => {
    e.preventDefault();
    const draggingCard = cardTable.querySelector(".dragging")

    const others = [...cardTable.querySelectorAll(".todo-card:not(.dragging)")];
    
    let next = others.find(card => {
        return e.clientY + window.scrollY <= card.offsetTop + card.offsetHeight /2;
    })
    cardTable.insertBefore(draggingCard, next);
}



// Event listener functions
function dragStart(e) {
    setTimeout(() => this.classList.add("dragging"), 0);
}

function dragEnd(e) {
    this.classList.remove("dragging");
    updateCardsInStorage();
}

// touch listeners
function touchStart(e) {
    dragStart.call(this, e.touches[0]);
}

function touchEnd(e) {
    const draggingCard = cardTable.querySelector(".dragging");
    if (!draggingCard) return;
    let rect = trashArea.getBoundingClientRect();
    let y = e.changedTouches[0].clientY;
    let x = e.changedTouches[0].clientX;
    
    if (rect.left <= x && rect.right >= x &&
         rect.top <= y && rect.bottom >= y) {
        console.log(rect);
        if (draggingCard) {
            draggingCard.remove();
        }
    } else {
        this.classList.remove("dragging");
    }
    updateCardsInStorage();
}



function touchMove(e) {
    e.preventDefault(); // Prevent default scrolling behavior
    var y = e.touches[0].clientY;
    const draggingCard = cardTable.querySelector(".dragging")

    const others = [...cardTable.querySelectorAll(".todo-card:not(.dragging)")];
    
    let next = others.find(card => {
        return y + window.scrollY <= card.offsetTop + card.offsetHeight /2;
    })
    cardTable.insertBefore(draggingCard, next);
}

function bindDragEvents() {
    const todoCards = document.querySelectorAll(".todo-card");

    todoCards.forEach(card => {
        card.removeEventListener("dragstart", dragStart);
        card.removeEventListener("dragend", dragEnd);
        card.removeEventListener("touchstart", touchStart);
        card.removeEventListener("touchend", touchEnd);
        card.removeEventListener("touchmove", touchMove);

        card.addEventListener("dragstart", dragStart);
        card.addEventListener("dragend", dragEnd);
        card.addEventListener("touchstart", touchStart);
        card.addEventListener("touchend", touchEnd);
        card.addEventListener("touchmove", touchMove);
    });
}


const toTrashMoved = (e) => {
    e.preventDefault();
}

function touchMoved(e) {
    e.preventDefault();
    toTrashMoved.call(this, e.touches[0]);
}

const deletedCard = (e) => {
    e.preventDefault();
    const draggingCard = cardTable.querySelector(".dragging");
    if (draggingCard) {
        draggingCard.remove();
    }
}

function changeCardTableTouch(e) {
    changeCardTable.call(this, e.touches[0]);
}

trashArea = document.getElementById("trashArea");
trashArea.addEventListener("dragover", toTrashMoved);
trashArea.addEventListener("drop", deletedCard);


cardTable.addEventListener("dragover", changeCardTable);


// initialize stuff
genCardsFromStorage();
bindDragEvents();


