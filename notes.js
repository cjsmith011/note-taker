const fs = require('fs');
const path = require('path');

const express = require(`express`);

const PORT = process.env.PORT || 3001;
//this one will instantiate the server
const app = express();

//this middleware will connect our index pages to the css and js styling pages
app.use(express.static('public'));
//parse the incoming user data into something that our app understands
app.use(express.urlencoded({ extended: true }));
//parse the incoming JSON data
app.use(express.json());

const notes = require('./db/db.json');


function createNewNote(body, notesArray) {
    
    //our function's main code is here
    const note = body;
    notesArray.push(note);
    //this is the synchronous version of writeFile, use for small datasets only
    fs.writeFileSync(
        //this is telling createNewNote where to put the data the user sent as a note - in our db.json file
        //the join word is needed to take from the url dir and join it to the data file
        path.join(__dirname, './db/db.json'),

        //the null says to not change our existing data: add to it don't overwrite it and the 2 gives 2 lines of whitespace gap
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    //return finished code to post route for response//
    return note;
}

function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
}


//this will route to our index
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

//this will activate our notes page
app.get('/api/notes', (req, res) => {
    //res.sendFile(path.join(__dirname, '../Note-Taker/public/notes.html'));
    let readNotes = JSON.parse(fs.readFileSync('./db/db.json'));
    res.json(readNotes);
 });


//this will route to the homepage if a user selects an option without a route, wildcard option with the *, should always be the last GET
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/api/notes', (req, res) => {
    //req.body is where our incoming content will be
    //set id based on what the next index of the array will be when user adds an animal
    req.body.id = notes.length.toString();

    //validation of user added notes- if any data is missing, send a 400 error back to the user
    if (!validateNote(req.body)) {
        res.status(400).send('Please give your note a Title and content!');
    } else {
    //add note to the db.json file and array 
    const note = createNewNote(req.body, notes);

    res.json(note);
    }
});

module.exports = {
    createNewNote,
    validateNote
};




app.listen(PORT, () => {
    console.log(`Go to your browser for the page at localhost:3001!`);
  });