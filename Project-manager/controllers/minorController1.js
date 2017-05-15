var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://127.0.0.1:27017/minor');


var testSchema = new mongoose.Schema({
  name:String,
  dob:String,
  email:String,
  mob:String,
  nop:Number
});

var User = mongoose.model('user', testSchema); //table jo banegi vo mools ke naam se apne aap banegi kisi ka koi kaam ni h..


var urlencodedParser = bodyParser.urlencoded({ extended: false });


module.exports=function(app){

 app.get('/', function(req, res){
  //get data from mongodb and pass it to view
  User.find({}, function(err, data){  //Mool.find({}, function(err, data) =>will find all values
    if(err) throw err;
    res.render('minor', { users: data });
  });
   
 });

 app.get('/profile', function(req, res){
  //get data from mongodb and pass it to view
  User.find({ _id:req.query.id}, function(err, data){  //Mool.find({}, function(err, data) =>will find all values
    if(err) throw err;
    res.render('Profile', {qs: req.query, users:data});
  });
   
 });


  app.post('/', urlencodedParser, function(req, res){
    //get data from view and add it to mongodb
   var newUser = User(req.body).save(function(err, data){
      if (err) throw err;
      res.json(data);
    })
 });

};