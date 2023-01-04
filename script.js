const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;


// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = []; // this array will contain all arrays above in it

// Drag Functionality

let draggedItem;
let currentColumn;
let dragging = false;


// Get Arrays from localStorage if available, set default values if not
//if statement allows us to check if there is something on the local sttorage. If there is
//We use JSON.parse to transform strings (local storage only saves strings) into objects that can be read by js
//else we give initial values to the arrays initialized above
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

//we call this functions to check if there is local storage and to initialize some if there is not
// getSavedColumns()
// updateSavedColumns()

// Set localStorage Arrays / setItem(variable name to identify info, info)
//allows us to save info on the local storage 
function updateSavedColumns() {

  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold']
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]))
  })


  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  // localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  // localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  // localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}

//Filters arrays to remove empty items
function filterArray(array) {
  console.log(array);
  const filteredArray = array.filter(item => item !== null);
  console.log(filteredArray);
  return filteredArray

}


// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  console.log('columnEl:', columnEl);
  console.log('column:', column);
  console.log('item:', item);
  console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)')//we start listening to ondragstart (event) and the we call the function grag(event)
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  //append
  columnEl.appendChild(listEl);

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = ''; // THIS WILL CLEAR OUT THE CONTENT ON THE LIST ITEMS
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray)


  // Progress Column
  progressList.textContent = ''; // THIS WILL CLEAR OUT THE CONTENT ON THE LIST ITEMS
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = ''; // THIS WILL CLEAR OUT THE CONTENT ON THE LIST ITEMS
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);


  // On Hold Column
  onHoldList.textContent = ''; // THIS WILL CLEAR OUT THE CONTENT ON THE LIST ITEMS
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);


  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns()
}

//Update Item - delete if necessay or update array value

function updateItem(id, column) {
  const selectedArray = listArrays[column]
  console.log(selectedArray)

  const selectedColumnEl = listColumns[column].children
  console.log(selectedColumnEl[id].textContent)
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id]
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    console.log(selectedArray);
    updateDOM();
  }


}

//Add to column list, reset text box
function addToColumn(column) {
  console.log(addItems[column].textContent);
  const itemText = addItems[column].textContent
  const selectedArray = listArrays[column];
  selectedArray.push(itemText)
  addItems[column].textContent = '' //reseting so that the input box is empty after adding item

  updateDOM();

}

//Show add item input box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';

}

//Hide item input box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);

}

//Allows arrays o reflect Drag and Drop Items

function rebuildArrays() {

  backlogListArray = []
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent)
  }

  progressListArray = []
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent)
  }

  completeListArray = []
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent)
  }

  onHoldListArray = []
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent)
  }
  updateDOM();
}

//When item starts dragging

function drag(e) {
  draggedItem = e.target;
  console.log('draggedItem:', draggedItem);
  dragging = true;
}

//Colun allows for item to drop

function allowDrop(e) {
  e.preventDefault();
}

//When item enters column area
function dragEnter(column) {
  currentColumn = column

}

//Dropping item in column

function drop(e) {
  e.preventDefault();
  //add item to colmn
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem)
  //dragging complete
  dragging = false;
  rebuildArrays()

}


//ON LOAD

updateDOM();

