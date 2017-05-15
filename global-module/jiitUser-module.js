var mongoose = require('mongoose');
var Schema = mongoose.Schema;   

var jiitSchema = new mongoose.Schema({
  Enrollment:String,
  DOB:String,
 // password:String,
  name:String,
  email:String,
  github:String,
  facebook:String,
  mob:String
});
module.exports = mongoose.model('jiitUser', jiitSchema);     