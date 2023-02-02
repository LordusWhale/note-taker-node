const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const userRouter = require('./routes/User');
const notesRouter = require('./routes/Notes');
require("dotenv").config()


const app = express();


app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.urlencoded({extended: true}));

// Routes

app.use("/api/user", userRouter);
app.use("/api/notes", notesRouter);



app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})



app.listen(process.env.port || 3000)



