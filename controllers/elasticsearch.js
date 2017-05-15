var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

//var db = mongoose.connect('mongodb://127.0.0.1:27017/minor');
 mongoose.Promise = global.Promise;


var Schema = mongoose.Schema;

var projectSchema = new Schema({
	pId:String,
	pType: String,
	projectTitle: String,
	projectSubject: String,
	tech: String,
	dbUsed: String
});


projectSchema.plugin(mongoosastic, {
	hosts: [
		'localhost:9200'
	]
});

module.exports = mongoose.model('Project', projectSchema);

