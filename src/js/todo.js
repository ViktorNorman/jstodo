const list = document.querySelector('.todo-list');
const form = document.querySelector('.add');
const button = document.querySelector('.add__submit');

const buildElement = (element, className, parent, text) => {
  const el = element;
  el.classList.add(className);
  parent.append(el);
  if (text) el.textContent = text;
  return el;
};

const buildTodo = ({
  title, description, checked, id,
}) => {
  const fragment = new DocumentFragment();
  const todo = document.createElement('section');
  const todoTitle = document.createElement('h5');
  const todoDescription = document.createElement('p');

  buildElement(todo, 'todo', fragment);
  buildElement(todoTitle, 'todo__title', todo, title);
  buildElement(todoDescription, 'todo__description', todo, description);
  todo.setAttribute('id', id);

  if (checked) {
    const checkedIcon = document.createElement('span');
    const todoRemove = document.createElement('button');
    buildElement(checkedIcon, 'material-icons', todo, 'check_box');
    buildElement(todoRemove, 'todo__remove', todo, 'Remove');
    todo.classList.add('todo--checked');
    todoTitle.classList.add('todo__title--checked');
    todoDescription.classList.add('todo__description--checked');
  } else {
    const uncheckedIcon = document.createElement('span');
    const helperText = document.createElement('p');
    buildElement(uncheckedIcon, 'material-icons', todo, 'check_box_outline_blank');
    buildElement(helperText, 'todo__helper-text', todo, 'Uncompleted');
  }
  return fragment;
};

const readStorage = () => {
  const items = localStorage.getItem('todos');
  const json = JSON.parse(items);
  if (json === null) {
    return [];
  }
  return json;
};

const render = () => {
  const todos = readStorage();
  list.innerHTML = '';
  if (todos.length > 0) {
    todos.sort((a, b) => a.checked - b.checked);
    todos.forEach((todo) => {
      list.append(buildTodo(todo));
    });
    const line = document.createElement('hr');
    buildElement(line, 'todo-list__line', list);
  }
};

const addTodo = (e) => {
  e.preventDefault();
  const title = e.target[0].value.trim();
  const description = e.target[1].value.trim();
  const todos = readStorage();
  todos.push({
    title,
    description,
    checked: false,
    id: Date.now(),
  });
  localStorage.setItem('todos', JSON.stringify(todos));
  e.target[0].value = '';
  e.target[1].value = '';
  render();
};

const removeTodo = (e, todos) => {
  const clickedId = Number(e.target.parentNode.id);
  return todos.filter((todo) => todo.id !== clickedId);
};

const toggleChecked = (e, todos) => {
  const clickedId = Number(e.target.id);
  const notValidId = 0;
  if (clickedId === notValidId) return null;
  return todos.map((todo) => {
    const { checked, id } = todo;
    if (id === clickedId) {
      return { ...todo, checked: !checked };
    } return todo;
  });
};

const clickedTodo = (e) => {
  const clickedItem = e.target.classList.value;
  let todos = readStorage();
  todos = clickedItem === 'todo__remove' ? removeTodo(e, todos) : toggleChecked(e, todos);
  if (todos !== null) {
    localStorage.setItem('todos', JSON.stringify(todos));
    render();
  }
};

form.addEventListener('submit', addTodo);
list.addEventListener('click', clickedTodo);

render();
