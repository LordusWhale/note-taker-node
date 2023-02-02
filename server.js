const express = require('express');
const path = require('path');
const app = express();


app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended: true}));


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.listen(process.env.port || 3000);