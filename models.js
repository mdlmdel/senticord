const mongoose = require('mongoose');

// This is the schema to represent an entity record
const entitySchema = mongoose.Schema({
  date: { type: Date, default: Date.now() }, 
  results: { type: [], required: true },
  averageScore: { type: Number, required: true }, 
  // Consider querying by a specific type of search instead
  query: { type: String, required: true }
});

/* *Instance method* that is used to return an object that only
   exposes *some* of the fields we want from the underlying data */
entitySchema.methods.apiRepr = function() {
  return {
    id: this._id,
    query: this.query,
    date: this.date,
    results: [],
    average: this.average, 
    // source: this.source
  };
}

/* All instance methods and virtual properties on the schema must be 
  defined *before* the call is made to `.model`. */
const Entity = mongoose.model('Entity', entitySchema);

module.exports = {Entity};
