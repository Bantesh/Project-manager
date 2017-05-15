var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
	rvBy:String,
    rvId: String,
    prv: String 
});
module.exports = mongoose.model('review', reviewSchema);        