const mongoose = require('mongoose');

// This is the schema to represent an entity record
const entitySchema = mongoose.Schema({
  // Consider querying by a specific type of search instead
  query: { type: String, required: true }, 
  average: { type: Number, required: true} , 
  type: { type: [String], required: true },
  source: { type: String, required: true },
  date: { type: Date, default: Date.now },
  // ofDates: [Date],
  score: Number
});

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the address object
// we're storing in Mongo.
/* entityrecordSchema.virtual('addressString').get(function() {
  return `${this.address.building} ${this.address.street}`.trim()});

// this virtual grabs the most recent grade for a restaurant.
restaurantSchema.virtual('grade').get(function() {
  const gradeObj = this.grades.sort((a, b) => {return b.date - a.date})[0] || {};
  return gradeObj.grade;
});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
entitySchema.methods.apiRepr = function() {

  return {
    id: this._id,
    query: this.query,
    date: this.date,
    average: this.average,
    source: this.source
  };
}
*/

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Entity = mongoose.model('Entity', entitySchema);

module.exports = {Entity};
