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

const { notes } = require('./Develop/db/db');


function createNewNote(body, notesArray) {
    
    //our function's main code is here
    const note = body;
    notesArray.push(animal);
    //this is the synchronous version of writeFile, use for small datasets only
    fs.writeFileSync(
        //this is telling createNewAnimal where to put the data the user sent as a new animal - in our animals.json file
        //the join word is needed to take from the url dir and join it to the data file
        path.join(__dirname, './Develop/db/db.json'),

        //the null says to not change our existing data: add to it don't overwrite it and the 2 gives 2 lines of whitespace gap
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    //return finished code to post route for response 
    return note;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

app.get('/api/animals', (req, res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
    res.send(404);
    }
});

//this will route to our index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//this will activate our animals page, just animals not api/animals since we are connecting to an html, not the data
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

//this will activate our zookeepers page, just zookeeperss not api/zookeepers since we are connecting to an html, not the data
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

//this will route to the homepage if a user selects an option without a route, wildcard option with the *, should always be the last GET
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '.public/index.html'));
});

app.post('/api/animals', (req, res) => {
    //req.body is where our incoming content will be
    //set id based on what the next index of the array will be when user adds an animal
    req.body.id = animals.length.toString();

    //validation of user added animals- if any data is missing, send a 400 error back to the user
    if (!validateAnimal(req.body)) {
        res.status(400).send('Please send your animal data in the proper format');
    } else {
    //add animal to the animals.json file and array 
    const animal = createNewAnimal(req.body, animals);

    res.json(animal);
    }
});






app.listen(3001, () => {
    console.log(`Got to your browser for the page at localhost:3001!`);
  });