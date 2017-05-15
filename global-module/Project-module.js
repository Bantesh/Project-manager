var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
	addedBy:String,
   pType: String, 
   pId: String,
   tech: String,
   dbUsed: String,
   projectSubject: String, 
   projectTitle: String, 
   book:String,
   attachFile: String
});
module.exports = mongoose.model('projects', projectSchema);        