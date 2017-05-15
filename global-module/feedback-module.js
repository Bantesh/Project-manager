var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feedbackSchema = new mongoose.Schema({
  fromEnrollment:String,
  subject:String,
  feedback:String
});
module.exports = mongoose.model('Feedback', feedbackSchema);        