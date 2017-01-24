const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

// ADDED START
const morgan = require('morgan');

const {router: usersRouter} = require('./users');
// ADDED END

// Mongoose internally uses a promise-like object,
// but it's better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const {PORT, DATABASE_URL} = require('./config');
const {Entity} = require('./models');

const app = express();
app.use(bodyParser.json());

/*app.get('/public', (req, res) => {
  res.json(Entities.get());
});*/
/*app.get('/public', function(req,res) {
  res.sendfile('public/index.html');
});*/
app.use(express.static('public'));

// GET requests to /entities => return 10 entity records
app.get('/entities', (req, res) => {
  Entity
    .find()
    // we're limiting because entity db has many 
    // documents, and that's too much to process/return
    .limit(10)
    // `exec` returns a promise
    .exec()
    // success callback: for each entity we got back, we'll
    // call the `.apiRepr` instance method we've created in
    // models.js in order to only expose the data we want in the API return.
    .then(entities => {
      res.json({
        entities: entities.map(
          (entity) => entity.apiRepr())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
    // res.render("chart");
});

// can also request by ID
app.get('/entities/:id', (req, res) => {
  Entity
    // this is a convenience method Mongoose provides for searching
    // by the object _id property
    .findById(req.params.id)
    .exec()
    .then(entity =>res.json(entity.apiRepr()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
});


app.post('/entities', (req, res) => {

  const requiredFields = ['query', 'average', 'results', 'date'];
  requiredFields.forEach(field => {
    // ensure that required fields have been sent over
    if (! (field in req.body && req.body[field])) {
      return res.status(400).json({message: `Must specify value for ${field}`});
    }
  });

// Record that fully encapsulates search
    let record = {
      query: query, 
      average: average, 
      results: results, 
      date: Date()
    }
    Entity.create(record, function(err, record) {
      if (err) {
        console.log("Error creating record");
        mongoose.disconnect(); 
        return;
      }
      console.log("Record created");
      mongoose.disconnect();
    });
  /* Entity
    .create({
      query: req.body.query,
      average: req.body.average,
      type: req.body.type,
      source: req.body.source
      /*date: .body.source,
      score: .body.score*///})
   /* .then(
      entity => res.status(201).json(entity.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    }); */
});


app.put('/entity/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }

  // we only support a subset of fields being updateable.
  // if the user sent over any of the updatableFields, we udpate those values
  // in document
  const toUpdate = {};
  const updateableFields = ['query'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Entity
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .exec()
    .then(entity => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

app.delete('/entity/:id', (req, res) => {
  Entity
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(entity => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};