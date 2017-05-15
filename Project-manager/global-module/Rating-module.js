var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
   Enrollment:String,
   pId: String,
   projectTitle:String, 
   star:Number,
});
module.exports = mongoose.model('ratings', projectSchema);        