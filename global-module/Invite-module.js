var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var inviteSchema = new mongoose.Schema({
  fromUser:String,
  toUser:String,
  rId: String,
  response:String
});
module.exports = mongoose.model('inviteusers', inviteSchema);        