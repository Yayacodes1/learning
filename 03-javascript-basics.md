# JavaScript Basics

## What is JavaScript?
JavaScript makes pages interactive - like adding electricity to the house.

## Key Concepts:

### 1. Variablesipt
let name = "John";  // can change
const age = 25;     // cannot change### 2. Functions
function greet(name) {
    return "Hello " + name;
}

// Arrow function (modern way)
const greet = (name) => {
    return "Hello " + name;
};### 3. Arraysipt
let tasks = ["Task 1", "Task 2"];
tasks.push("Task 3");  // add to end
tasks.pop();           // remove from end### 4. Objectsript
let task = {
    text: "Buy groceries",
    completed: false
};### 5. DOM Selectionscript
document.getElementById("myButton");  // get element by id
document.querySelector(".myClass");   // get first matching element
### 6. Event Listeners
let button = document.getElementById("myButton");
button.addEventListener("click", function() {
    alert("Button clicked!");
});### 7. Local Storage
localStorage.setItem("key", "value");           // save
let value = localStorage.getItem("key");        // get
localStorage.removeItem("key");                 // delete


let tasks = ["Task 1", "Task 2"];
tasks.push("Task 3");  // add to end
tasks.pop();           // remove from end## Key Concepts:

### 1. Creating Elements
let newDiv = document.createElement("div");
newDiv.textContent = "Hello";### 2. Adding to Page
let container = document.getElementById("container");
container.appendChild(newDiv);### 3. Removing Elementsascript
let element = document.getElementById("myElement");
element.remove();### 4. Changing Content
element.textContent = "New text";
element.innerHTML = "<strong>Bold text</strong>";### 5. Changing Stylesript
element.style.color = "red";
element.style.display = "none";  // hide
element.style.display = "block"; // show### 6. Adding Classespt
element.classList.add("completed");
element.classList.remove("completed");
element.classList.toggle("completed");