const express = require('express');

const app = express();

app.use(express.json());
let tasks = [];
app.get("/tasks", (req, res) => {
    const completed = req.query.completed;
if(completed === 'true'){
    const completedTasks = tasks.filter(t => t.completed === true);
res.json(completedTasks)
}else if (completed === 'false'){
    const uncompletedTasks = tasks.filter(t => t.completed === false);
res.json(uncompletedTasks);
}else {
    res.json(tasks);
}
    
});




app.get("/tasks/:id", (req, res) => {
    const id = req.params.id;  
    const task = tasks.find(t => t.id === parseInt(id));

    if(task){

    
        res.json(task);
    }
else{
    res.status(404).json({ error: 'Task not found' });
    
}});

app.post("/tasks/", (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    tasks.push(newTask);
res.status(201).json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;  // Step 1: Get ID
    const index = tasks.findIndex(t => t.id === parseInt(id));  // Step 2: Find position
    
    if (index !== -1) {  // Step 3: Check if found
        tasks.splice(index, 1);  // Step 4: Remove from array
        res.json({ message: 'Task deleted' });  // Step 5: Success
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});


app.put("/tasks/:id", (req, res) => {
    const id = req.params.id;  
    const task = tasks.find(t => t.id === parseInt(id));

    if(task){
        // Update the task properties with data from req.body
        if(req.body.title !== undefined) {
            task.title = req.body.title;
        }
        if(req.body.description !== undefined) {
            task.description = req.body.description;
        }
        if(req.body.completed !== undefined) {
            task.completed = req.body.completed;
        }
        // Update the updatedAt timestamp
        task.updatedAt = new Date();
        
        // Return the updated task
        res.json(task);
    }
    else{
        res.status(404).json({ error: 'Task not found' });
    }
});




app.listen(3000, ()=>{
    console.log('Server is running on http://localhost:3000');

});