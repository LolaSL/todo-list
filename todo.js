//to create global variables for "TODO list" elements
var addButton = document.getElementById('add');//"Add" button in section "Add new task"
var newTodoTask = document.getElementById('new-task');// input field in section "Add new task"
var todoListTasks = document.getElementById('uncompleted-tasks');//unfinished-tasks in section "To-do list"
var completedTasks = document.getElementById('completed-tasks');// finished-tasks in section "Completed tasks"
var data = load();
//to add method addNewTask to button "ADD"
addButton.onclick = addNewTask;

// function createNewElement for creating HTML tags 'li', 'button', 'checkbox', 'edit' &'delete' buttons
function createListElements(task, completed) {
    const liElement = document.createElement('li');
    const checkbox = document.createElement('button');
    if (completed) {
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box</i>";
    } else {
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";//button checkbox "unmarked"
    }
    const labelElement = document.createElement('label');
    labelElement.innerText = task;
    let input = document.createElement('input');
    input.type = "text";
    const editButton = document.createElement('button');
    editButton.className = "material-icons edit";
    editButton.innerHTML = "<i class='material-icons'>edit</i>";
    const deleteButton = document.createElement('button');
    deleteButton.className = "material-icons delete";
    deleteButton.innerHTML = "<i class='material-icons'>delete</i>";
    //To add elements to tag 'li' -'checkbox', 'label', 'input', 'deleteButton','editButton'
    liElement.appendChild(checkbox);
    liElement.appendChild(labelElement);
    liElement.appendChild(input);
    liElement.appendChild(deleteButton);
    liElement.appendChild(editButton);
    return liElement;
}
//To add task from input field to section ""Add new task""
function addNewTask() {
    if (newTodoTask.value) {
        const liElement = createListElements(newTodoTask.value, false);//false -checkbox is not marked
        todoListTasks.appendChild(liElement);//to append new elemet
        bindTaskEvents(liElement, moveCompletedTask)
        newTodoTask.value = "";
    }
    save();//saving data to local storage after defined action 
}
//to delete task
function deleteTask() {
    const liIElement = this.parentNode;// to appeal to tag "li"
    const ul = liIElement.parentNode;// to appeal to tag 'ul'
    ul.removeChild(liIElement);// to remove li tag -child from tag "ul"
    save();
}
//to edit task
function editTask() {
    const editButton = this;
    const liElement = this.parentNode;
    const label = liElement.querySelector('label');
    let input = liElement.querySelector('input[type=text]');
    //var containsClass will help to clarity the  presence of element "editMode"
    let containsClass = liElement.classList.contains('editMode');
    if (containsClass) {
        label.innerText = input.value;
        editButton.className = "material-icons edit";
        editButton.innerHTML = "<i class='material-icons'>edit</i>";
        save();
    } else {
        input.value = label.innerText;
        editButton.className = "material-icons save";
        editButton.innerHTML = "<i class='material-icons'>save</i>";
    }
    liElement.classList.toggle('editMode');//for toggle className
}
// if task marked it will move to completed tasks
function moveCompletedTask() {
    const liElement = this.parentNode;
    const checkbox = liElement.querySelector('button.checkbox');
    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box</i>";
    completedTasks.appendChild(liElement);
    bindTaskEvents(liElement, moveUncompletedTask);
    save();
}
//if  marked task is unmarked it will move to uncompleted tasks section
function moveUncompletedTask() {
    const liElement = this.parentNode;
    const checkbox = liElement.querySelector('button.checkbox');
    checkbox.className = "material-icons checkbox";//className property sets the class name of an element (the value of an element's class attribute).
    checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
    todoListTasks.appendChild(liElement);
    bindTaskEvents(liElement, moveCompletedTask)
    save();
}
// function that will bind methods - addNewTask, moveCompletedTask, moveUncompletedTask, load-to a new element at creation time 
function bindTaskEvents(liElement, checkboxEvent) {
    const checkbox = liElement.querySelector('button.checkbox');
    const editButton = liElement.querySelector('button.edit');
    const deleteButton = liElement.querySelector('button.delete');
    //to create event handler to buttons
    checkbox.onclick = checkboxEvent;
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
}
//to save data in local storage on Client in Browser
function save() {
    const uncompletedTasksArr = [];
    for (let i = 0; i < todoListTasks.children.length; i++) {
        uncompletedTasksArr.push(todoListTasks.children[i].getElementsByTagName('label')[0].innerText);//put a value to array
    }
    const completedTasksArr = [];
    for (let i = 0; i < completedTasks.children.length; i++) {
        completedTasksArr.push(completedTasks.children[i].getElementsByTagName('label')[0].innerText);//put a value to array
    }
    //localStorage-property allows to access the data with no expiration date
    localStorage.removeItem('todo');
    localStorage.setItem('todo', JSON.stringify({//Convert an array into a string object when data sent from client to server
        uncompletedTasks: uncompletedTasksArr,
        completedTasks: completedTasksArr
    }));
}
//to load method downloads data from local storage and convert string object to array when data sent from server to client
function load() {
    return JSON.parse(localStorage.getItem('todo'));
}
for (let i = 0; i < data.uncompletedTasks.length; i++) {
    let liElement = createListElements(data.uncompletedTasks[i], false);
    todoListTasks.appendChild(liElement);// to add li tag to ul element 
    bindTaskEvents(liElement, moveCompletedTask);
}
for (let i = 0; i < data.completedTasks.length; i++) {
    let liElement = createListElements(data.completedTasks[i], true);
    completedTasks.appendChild(liElement);// to add li tag to ul element
    bindTaskEvents(liElement, moveUncompletedTask);
}

