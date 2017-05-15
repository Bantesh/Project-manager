var mongoose = require('mongoose');
var Schema = mongoose.Schema;   

var userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  mob:String,
  nop:Number
});
module.exports = mongoose.model('user', userSchema);     