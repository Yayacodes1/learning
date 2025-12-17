//1. Create an Express server with routes for a blog (posts, comments)
const express = require('express');
const app = express();

app.get("/posts", (req, res) => {
    res.send("This is posts");
});

app.get("/comments", (req, res) => {
    res.send("This is comments");
});

app.listen(3000, ()=>{
    console.log('Server is running on http://localhost:3000');

});