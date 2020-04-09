const socialOpen = document.querySelector('.open');
const socialContainer = document.querySelector('.social-container');

socialOpen.addEventListener('click', showSocial);

function showSocial() {
  socialOpen.classList.toggle('active');
  socialContainer.classList.toggle('open');
}

//main code
const dialogInput = document.querySelector('.input-group');
const dialogButton = document.querySelector('.todo__open');
const inputText = document.querySelector('.todo__input');
const addButton = document.querySelector('.todo__add');
const todoList = document.querySelector('.todo__list');
const totalTask = document.querySelector('.task');
const totalComplete = document.querySelector('.complete');
const dateText = document.querySelector('.date');

// localStorage.clear();
let dataTodos = localStorage.getItem('todoItems');
dataTodos = dataTodos !== null ? JSON.parse(dataTodos) : {};
let tasks = Object.values(dataTodos).length;
let complete = countComplete();
let id = 0;
dateText.innerHTML = `<strong class="day">${getDate()[0]}</strong> ${getDate()[1]}`;
console.log(dataTodos)
if (dataTodos !== null && tasks !== 0) {
  showTodo();
} else {
  todoList.innerHTML = `<span class="nothing">Nothing todo today...</span>`;
}

dialogButton.addEventListener('click', () => {
  dialogInput.classList.toggle('open');
  dialogButton.classList.add('click');
})

addButton.addEventListener('click', updateTodo);

function showTodo(){
  let render = '';
  tasks = Object.values(dataTodos).length;
  complete = countComplete();
  for (let [key, value] of Object.entries(dataTodos)) {
    render += createTodo(key, value);
  }
  todoList.innerHTML = render;
  totalTask.innerHTML = tasks < 10 ? '0'+tasks : tasks;
  totalComplete.innerHTML = complete < 10 ? '0'+complete : complete;
  eventTodo()
}

function updateTodo() {
  let keys = Object.keys(dataTodos);
  let teks = inputText.value;

  if (teks !== '') {
    id = keys.length > 0 ? parseInt(keys[keys.length-1])+1 : 0;
    dataTodos[id] = {
      text: inputText.value,
      isDone: false
    }
    localStorage.setItem('todoItems', JSON.stringify(dataTodos));
    showTodo();
    id++;
  }
  inputText.value = '';
  dialogInput.classList.remove('open');
  dialogButton.classList.remove('click');
}

function createTodo(id, data) {
  return `<div class="todo__group" data="${id}">
    <span class="todo__done" data="${id}">${data.isDone ? '✓' : ''}</span>
    <span class="todo__text ${data.isDone ? 'done' : ''}" data="${id}">${data.text}</span>
    <span class="todo__delete ${data.isDone ? '' : 'hide'}" data="${id}">✘</span>
  </div>`
}


function eventTodo(){
  let markButton = document.querySelectorAll('.todo__done');
  let deleteButton = document.querySelectorAll('.todo__delete');
  markButton.forEach((item, i) => {
    item.addEventListener('click', () => {
      markTodo(item, item.getAttribute('data'));
    });
  });

  deleteButton.forEach((item, i) => {
    item.addEventListener('click', () => {
      deleteTodo(item, item.getAttribute('data'));
    });
  });
}

function markTodo(el,id) {
  let todo = document.querySelectorAll('.todo__text');
  todo.forEach((item, i) => {
    if (item.getAttribute('data') == id) {
      item.classList.toggle('done');
      item.nextElementSibling.classList.toggle('hide');
      if (item.classList.contains('done')) {
        el.innerHTML = '✓';
        dataTodos[id]['isDone'] = true;
        complete++
        totalComplete.innerHTML = complete < 10 ? '0'+complete : complete;
      }else {
        el.innerHTML = '';
        dataTodos[id]['isDone'] = false;
        complete--
        totalComplete.innerHTML = complete < 10 ? '0'+complete : complete;
      }
      localStorage.setItem('todoItems', JSON.stringify(dataTodos));
    }
  });
}

function deleteTodo(el, id) {
  let todo = document.querySelectorAll('.todo__group');
  todo.forEach((item, i) => {
    if (item.getAttribute('data') == id) {
      item.style.animation = `goLeft .5s ease-in`;
      setTimeout(() => {
        item.remove();
      }, 500)
      delete dataTodos[id];
      localStorage.setItem('todoItems', JSON.stringify(dataTodos));
      tasks--
      totalTask.innerHTML = tasks < 10 ? '0'+tasks : tasks;
      complete--
      totalComplete.innerHTML = complete < 10 ? '0'+complete : complete;
      if (tasks === 0) {
        todoList.innerHTML = `<span class="nothing">Nothing todo today...</span>`;
      }
    }
  });
}

function countComplete() {
  let count = 0;
  for (let [key, value] of Object.entries(dataTodos)) {
    if (value.isDone) {
      count++
    }
  }
  return count;
}

function getDate() {
  const date = new Date();
  const month = [
    "Jan", "Feb", 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  const day = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ]
  return [
    `${day[date.getDay()]},`,
    `${date.getDate()} ${month[date.getMonth()]}`
  ]
}
