const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const morgan = require('morgan');

// Make Mongoose use built-in es6 promises
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Entity} = require('./models');

const app = express();
app.use(bodyParser.json());

app.use(express.static('public'));

// GET requests to /entities --> return a max of 10 entity records
app.get('/entities', (req, res) => {
  Entity
    .find()
    .limit(10)
    .exec()
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
});

app.get('/entities/:id', (req, res) => {
  Entity
    // Search by the object _id property via the convenience method Mongoose provides
    .findById(req.params.id)
    .exec()
    .then(entity =>res.json(entity.apiRepr()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
});

app.post('/save-record', (req, res) => {
  console.log("Save record via POST request");
  const requiredFields = ['date', 'results', 'averageScore'];
  requiredFields.forEach(field => {
    // ensure that required fields have been sent over
    if (! (field in req.body && req.body[field])) {
      return res.status(400).json({message: `Must specify value for ${field}`});
    }
  });

// Record that fully encapsulates search
    Entity.create(req.body, function(err, record) {
      if (err) {
        console.log("Error creating record");
        mongoose.disconnect(); 
        res.status(500).json(err);
        return;
      }
      console.log("Record created");
      mongoose.disconnect();
      res.status(201).json(record);
    });
});

app.put('/entity/:id', (req, res) => {
  // Ensure that the id in the request path and the one in the request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }

  // Support a subset of fields being updateable.
  const toUpdate = {};
  const updateableFields = ['query'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Entity
    // Update all key/value pairs in toUpdate -- that's what `$set` does
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

// Catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

let server;

// Connect to the database, then start the server
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

// Close the server, and return a promise. Use in integration tests.
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

/* Run this code block if server.js is called directly. Export the 
  runServer command as well so that other code can start the server as needed. */
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};