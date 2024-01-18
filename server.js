const fs = require('fs');
const util = require('util');
const readFromFile = util.promisify(fs.readFile);
const { v4: uuidv4 } = require('uuid');
const randomId = uuidv4();

// Import Express.js
const express = require('express');

// Import Node.js path package
const path = require('path');

// Initializes instance of Express.js
const app = express();

const PORT = process.env.PORT || 3001;

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

app.get('/api/notes', (req, res) => {
    // Go to the db, get all the notes
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note.`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            id: randomId,
            title,
            text,
        };

        const response = {
            status: 'success',
            body: newNote,
        };

        const readFile = fs.readFileSync('./db/db.json');
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

app.delete(`/api/notes/:id`, (req, res) => {
    const noteId = req.params.id;

    const readFile = fs.readFileSync('./db/db.json');
    const dbArray = JSON.parse(readFile.toString());

    // remove the object from the array where the id of the object equals the given id
    const newArray = dbArray.filter(note => note.id !== noteId);

    fs.writeFile(`db/db.json`, JSON.stringify(newArray), (err) =>
        err ? console.error(err)
            : console.log(`Note was sucessfully deleted.`)
    );

    res.status(201).json({ status: 'success', message: `Note ID ${noteId} deleted` });

});

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
});