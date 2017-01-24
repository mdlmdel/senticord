const mongoose = require('mongoose');

// This is the schema to represent an entity record
const entitySchema = mongoose.Schema({
  // Consider querying by a specific type of search instead
  query: { type: String, required: true }, 
  average: { type: Number, required: true} , 
  //results { type: [], required: true},
  date: { type: Date, default: Date.now }
  // ofDates: [Date],
});


// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
entitySchema.methods.apiRepr = function() {

  return {
    id: this._id,
    query: this.query,
    average: this.average, 
    results: [],
    date: this.date,
    // source: this.source
  };
}


// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Entity = mongoose.model('Entity', entitySchema);

module.exports = {Entity};
