var express=require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

app.set('view engine', 'ejs');


//var Project = mongoose.model('project',{ pType: String, projectSubject: String, projectTitle: String, attachFile: String });
var Project = require('../global-module/Project-module');

var urlencodedParser = bodyParser.urlencoded({ extended: false });



var multer = require('multer');
var upload = multer({dest: 'minor/assets/uploads'})
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, sid");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  next();
})


module.exports=function(app){ 


   app.get('/add-project', function(req, res, next){
    
     Project.find({}, function(err, data){
     if(err) throw err;
     res.render('add-project', { qs: req.query, projects: data });
    });
  });

    


   app.post('/add-project', upload.any(), urlencodedParser, function(req, res){

     //res.render('add-project', { data: req.body.projectType});


      if(req.files){
        req.files.forEach(function(file){
          console.log(file); //to show the form-post values in terminal

          var project = new Project({
          	pType: req.body.pType, 
          	projectSubject: req.body.projectSubject, 
          	projectTitle: req.body.projectTitle,
            attachFile: file.filename   //myfile: (new Date).valueOf()+"-"+file.originalname
          });
          project.save(function(err,result){
            if(err){

            }
           // res.json(result);  //to show the data in the browser
          });

        });
      } 

      return res.redirect('/add-project')
    

  });


    app.get('/project', function(req, res){
  
  if(!req.query.id){ 
      res.redirect('/add-project')
       }
  Project.find({ _id:req.query.id}, function(err, data){  //Mool.find({}, function(err, data) =>will find all values
    if(err) throw err;
    res.render('project', {qs: req.query, projects:data});
  });
   
 });



     app.get('/results', function(req, res){

    if(!req.query.search_query){ 
      res.redirect('/')
       }
    Project.find({ pType: req.query.search_query }, function(err, data){  
    if(err) throw err;
    res.render('results', {qs: req.query, projects:data});
  });
 });


};