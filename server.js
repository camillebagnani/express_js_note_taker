const fs = require('fs');

// Import Express.js
const express = require('express');

// Import Node.js path package
const path = require('path');

// Initializes instance of Express.js
const app = express();

const PORT = 3001;

const notesData = require('./db/db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Middleware points to the public folder where it will serve all the static files 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.get('/notes', (req, res) => {
    console.log(__dirname)
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.post('/notes', (req, res) => {
    console.info(`${req.method} request received to add a review.`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
        };

        const response = {
            status: 'success',
            body: newNote,
        };

        const readFile = fs.readFileSync(`./db/db.json`);
        const dbArray = JSON.parse(readFile.toString());

        dbArray.push(newNote);

        fs.writeFile(`./db/db.json`, JSON.stringify(dbArray), (err) =>
            err ? console.error(err)
                : console.log(`New note for ${newNote.title} has been added to the JSON file`)
        );

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
});