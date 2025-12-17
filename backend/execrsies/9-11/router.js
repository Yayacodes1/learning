//4. Create a router for user-related routes

const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.send("all posts");
});

router.get('/:id', (req, res) => {
    res.send("one post's id");
});

module.exports = router;