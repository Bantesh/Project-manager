var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://127.0.0.1:27017/test');
/*mongoose.connection.once('connected', function() {
	console.log("Database connected successfully")
});*/
var todoSchema = new mongoose.Schema({
	item:String
});

var Todo = mongoose.model('Todo', todoSchema);
var itemOne = Todo({item: 'buy flowers'}).save(function(err){
  if (err) throw err;
  console.log('item saved');
});



var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding '}];
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports=function(app){

 app.get('/todo', function(req, res){
   res.render('todo', {todos: data});
 });

  app.post('/todo', urlencodedParser, function(req, res){
   data.push(req.body);
   res.json(data);
 });

   app.delete('/todo/:item', function(req, res){
    data = data.filter(function(todo){
    	return todo.item.replace(/ /g, "-") !== req.params.item;
    });
    res.json(data);
 });

};