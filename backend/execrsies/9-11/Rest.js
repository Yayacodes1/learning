//2. Build a simple REST API for a todo list
const express = require('express');
const app = express();
app.use(express.json());

app.get("/todos", (req, res) => {
    res.send("This is get all todos");
});
app.get("/todos/:id", (req, res) => {
    res.send("This is get specifc todo");
});

app.post("/todos", (req, res) => {
    res.send("This is how we create a todo");
});

app.delete("/todos/:id", (req, res) => {
    res.send("This is how we delete todo");
});

app.put("/todos/:id", (req, res) => {
    res.send("This is how we update todo");
});

app.listen(3000, ()=>{
    console.log('Server is running on http://localhost:3000');

});