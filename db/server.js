// Import Express.js
const exp = require('constants');
const express = require('express');

// Import Node.js path package
const path = require('path');

// Initializes instance of Express.js
const app = express();

const PORT = 3001;

// Middleware points to the public folder where all the static files are
// Middleware is a starting point to minimize paths -- EDIT THIS NOTE
app.use(express.static('public'));

app.get('/api/notes', (req, res) => 
res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.listen(PORT, () =>
console.log(`Listening at http://localhost:${PORT}`)
)