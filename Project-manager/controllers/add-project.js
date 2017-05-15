var express=require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var passport = require('passport');
var fs = require('fs');
var path = require('path');
var SummaryTool = require('node-summary');

var app = express();

app.set('view engine', 'ejs');  

//var Project = mongoose.model('project',{ pType: String, projectSubject: String, projectTitle: String, attachFile: String });
var Project = require('../global-module/Project-module');
var User = mongoose.model('user'); 
var Invite = require('../global-module/Invite-module');
var Review = require('../global-module/Review-module');
var Rating = require('../global-module/Rating-module');

var urlencodedParser = bodyParser.urlencoded({ extended: false });



var multer = require('multer');
var upload = multer({dest: 'minor/assets/uploads'});
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, sid");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  next();
})


module.exports=function(app){ 


   app.get('/add-project', function(req, res, next){

     if(!req.session.user){
    console.log('out of session YOU NEED TO LOGIN FIRST!');
    return res.redirect('/login');
    }

     else if(req.session.user){
      console.log('login-session for ' + req.session.user.Enrollment);
         
           Project.find({addedBy:req.session.user.Enrollment}, function(err, data){
           if(err) throw err;
           res.render('add-project', { qs:req.query, projects:data , data:req.session.user, errors:req.flash('errors')});
          });

     }
 
   
  });

    


   app.post('/add-project', upload.any(), urlencodedParser, function(req, res){

      if(req.files){  
        req.files.forEach(function(file){
          console.log(file);
        //  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){console.log('it is not an image file!')}
         if (file.originalname.match(/\.(pdf)$/)){

          var project = new Project({
            addedBy:req.session.user.Enrollment,
          	pType: req.body.pType, 
            pId: req.body.pId,
            tech: req.body.tech,
            dbUsed: req.body.dbUsed,
          	projectSubject: req.body.projectSubject, 
          	projectTitle: req.body.projectTitle,
            book: req.body.book,
            attachFile: file.filename   //myfile: (new Date).valueOf()+"-"+file.originalname
             //attachFile: file.originalname
          });
                       var mool = file.filename
             var filePath = path.join(__dirname, '../minor/assets/uploads/'+mool)
var extract = require('pdf-text-extract')
extract(filePath, { splitPages: false }, function (err, text) {
  if (err) {
    console.dir(err)
    return
  }
  fs.writeFile('minor/assets/textFile/'+mool+'.txt', text, function (err) {
    if (err) 
        return console.log(err);
    console.log('Hello World > helloworld.txt');
});
});


        Project.findOne({pId: req.body.pId}, function(err, existingId){
    if(existingId){
      console.log(req.body.pId + "is already exist!");
      req.flash('errors','Project with id: ' + req.body.pId + " is already exist!");
     // return res.redirect('/add-project');
      Project.find({addedBy:req.session.user.Enrollment}, function(err, data){
           if(err) throw err;
           res.render('add-project', { qs:'', projects:data , data:req.session.user, errors:req.flash('errors')});
          });
    } else{
     project.save(function(err, result){
      if (err) throw err;
       console.log('New Project with ID: ' + req.body.pId + " has been added!");
       req.flash('errors','New Project ' + req.body.projectTitle+'( ID: ' +req.body.pId+ ')' + " has been added!");
      //return res.redirect('/add-project');
       Project.find({addedBy:req.session.user.Enrollment}, function(err, data){
           if(err) throw err;
           res.render('add-project', { qs:'', projects:data , data:req.session.user, errors:req.flash('errors')});
          });
    });

   /*  Simple project addition
   project.save(function(err,result){
            if(err){     }
           // res.json(result);  //to show the data in the browser
          });
        }); */

    }
  
  });
       } else{ console.log('Only pdf file allowed!'); console.log('sorry this is an ' + file.mimetype) ;
          req.flash('errors','sorry! this is an ' + file.mimetype + ' file,', " Only pdf files are allowed! ");  
          Project.find({addedBy:req.session.user.Enrollment}, function(err, data){
           if(err) throw err;
           res.render('add-project', { qs:'', projects:data , data:req.session.user, errors:req.flash('errors')});
          });
        }

      });

      } 
    

  });


    app.get('/project1', function(req, res){
     if(!req.session.user){
    console.log('out of session YOU NEED TO LOGIN FIRST!');
    return res.redirect('/login');
    }

     else if(req.session.user){
      console.log('login-session for ' + req.session.user.Enrollment);
         
       if(!req.query.id){ 
      res.redirect('/add-project')
       }

  Project.findOne({ pId:req.query.id}, function(err, data){  
    if(err) throw err;
     Invite.find({response:'accept'},function(err, data1){ 
      Review.find({rvId:req.query.id}, function(err, data2){
        Rating.aggregate([
                     { $match: { pId: req.query.id } },
                     { $group: { _id: null, total: { $avg:"$star"} } }
                   ], function(err,rating){

                       // var readme = fs.readFileSync('./minor/assets/textFile/'+data.attachFile+'.txt','utf8');
                        var readme = fs.readFileSync('./minor/assets/textFile/all.txt','utf8');
var title = "Group Members PROJECT DESCRIPTION PROBLEM STATEMENT TECHNOLOGY USED";
SummaryTool.summarize(title, readme, function(err, summary) {
    if(err) console.log("Something went wrong man!");
    console.log(summary);
     res.render('project', {qs:req.query,projects:data,group:data1,review:data2,data:req.session.user,rating:rating,summary:summary});
});

        // res.render('project', {qs:req.query,projects:data,group:data1,review:data2,data:req.session.user,rating:rating});
        });
      })
     });
    //res.render('project', {qs:req.query, projects:data, data:req.session.user});
  });

     }

   
 });

      app.get('/project2', function(req, res){
     if(!req.session.user){
    console.log('out of session YOU NEED TO LOGIN FIRST!');
    return res.redirect('/login');
    }

     else if(req.session.user){
      console.log('login-session for ' + req.session.user.Enrollment);
         
       if(!req.query.id){ 
      res.redirect('/networks')
       }

  Project.findOne({ pId:req.query.id}, function(err, data){  //Mool.find({}, function(err, data) =>will find all values
    if(err) throw err;
     Invite.find({rId:req.query.id, response:'accept'},function(err, data1){
      Review.find({rvId:req.query.id}, function(err, data2){
             Rating.aggregate([
                     { $match: { pId: req.query.id } },
                     { $group: { _id: null, total: { $avg:"$star"} } }
                   ], function(err,rating){


                              var readme = fs.readFileSync('./minor/assets/textFile/all.txt','utf8');
var title = "Group Members PROJECT DESCRIPTION PROBLEM STATEMENT TECHNOLOGY USED";
SummaryTool.summarize(title, readme, function(err, summary) {
    if(err) console.log("Something went wrong man!");
    console.log(summary);
     res.render('project', {qs:req.query,projects:data,group:data1,review:data2,data:req.session.user,rating:rating,summary:summary});
});
        
        });
      })
     });
   // res.render('project', {qs:req.query, projects:data, data:req.session.user});
  });

     }

   
 });



     app.get('/results1', function(req, res){
     // console.log(req.query.q);

        if(!req.session.user){
    console.log('out of session YOU NEED TO LOGIN FIRST!');
    return res.redirect('/login');
    }

     else if(req.session.user){
      console.log('login-session for ' + req.session.user.Enrollment);
         
       if(!req.query.q){ 
      res.redirect('/')
       }
       else if(req.query.q && req.query.sot){
            Project.find({ pType:req.query.q, tech:req.query.sot }, function(err, data){  
           if(err) throw err;
           console.log(err,data);
           res.render('results', {qs: req.query, projects:data, data:req.session.user});
          });
       }
       else{
             Project.find({ pType:req.query.q }, function(err, data){  
            if(err) throw err;
            console.log(err,data);
           res.render('results', {qs: req.query, projects:data, data:req.session.user});
         });

           }
     }

 });



  app.post('/delete-project', function(req, res){
   if(!req.session.user){
   return res.redirect('/login');
   }
       console.log(req.body.dId);
       Project.findOne({addedBy:req.session.user.Enrollment, pId:req.body.dId}).remove().exec();
     /*  Project.find({pId:req.body.pId}, function(err, data){
        if(err) throw err;
        console.log(data);
       }) 
      req.flash('errors','Project with id: ' + req.body.dId + " has beed deleted!"); */
      return res.redirect('/add-project'); 

    });

   app.post('/rating', function(req, res){
   if(!req.session.user){
   return res.redirect('/login');
   }
      Rating.findOne({Enrollment:req.body.Enrollment, pId:req.body.pId}, function(err, yes){
           if(!yes){
            var newRating = Rating(req.body).save(function(err, newData){
            if (err) throw err; 
            return res.redirect('/add-project');
           });
          }
         else{
          Rating.findOne({Enrollment:req.body.Enrollment, pId:req.body.pId})
          .exec()
          .then((Rating) => {
          Rating.star = req.body.star
          Rating.save((err,data) => {
          console.log(err,data);
          return res.redirect('/add-project');
      });

  });
      
        }
      }) 
   
    });

};