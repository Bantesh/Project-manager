var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://127.0.0.1:27017/test');
//mongoose.connect('mongodb://test:test123@ds041516.mlab.com:41516/minor_database').connect;
//mongoose.createConnection('mongodb://test:test123@ds041516.mlab.com:41516/minor_database');

var testSchema = new mongoose.Schema({
  item:String,
  who:String,
  email:String,
  age:String
});

var Test = mongoose.model('Test', testSchema);
var Mool = mongoose.model('Mool', testSchema); //table jo banegi vo mools ke naam se apne aap banegi kisi ka koi chod ni h..



var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports=function(app){

 app.get('/', function(req, res){
  //get data from mongodb and pass it to view
  Mool.find({"age":{$gt:17,$lt:21}}, function(err, data){  //Mool.find({}, function(err, data) =>will find all values
    if(err) throw err;
    res.render('testdata', {mools: data});
  });
   
 });

 app.get('/book', function(req, res){
  //get data from mongodb and pass it to view
  Test.find({}, function(err, data){  //Mool.find({}, function(err, data) =>will find all values
    if(err) throw err;
    res.render('book', {tests: data});
  });
   
 });

  app.post('/', urlencodedParser, function(req, res){
    //get data from view and add it to mongodb
   var newMool = Mool(req.body).save(function(err, data){
      if (err) throw err;
      res.json(data);
    })
 });

};