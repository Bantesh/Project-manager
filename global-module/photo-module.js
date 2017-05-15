var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photoSchema = new mongoose.Schema({
  Enrollment:String,
  myfile:String
})
module.exports = mongoose.model('photo', photoSchema);        