var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sortListSchema = new Schema({
	slBy:String,
    slId: String,
    slTitle: String 
});
module.exports = mongoose.model('sortLists', sortListSchema);        