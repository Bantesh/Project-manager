var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Feedback = require('../global-module/feedback-module');

var contactSchema = new mongoose.Schema({
  who:String,
  age:Number,
  contactEmail:String
});
var Contact = mongoose.model('contact', contactSchema);

var jiitUser = require('../global-module/jiitUser-module');



var urlencodedParser = bodyParser.urlencoded({ extended: false });
 


module.exports=function(app){ 

    app.get('/about', urlencodedParser, function(req, res){
      jiitUser.count({},function(err, data){ 
    if(err) throw err;
    res.render('about', { users: data, data:'' });
  });
  
    });

 app.get('/feedback',function(req, res){
   //res.end('OOps!  Error: 404');
   res.render('404');
 });

  app.post('/feedback', function(req, res){
   var newFeedback = Feedback(req.body).save(function(err, data){
      if (err) throw err;
      //res.json(data);
      res.render('feedback-success',{data:req.session.user});
    });
 });


   app.get('/contact',function(req, res){
   //res.render('contact', {errors:'Welcome! moolchand'});
    if(!req.session.user){
    console.log('out of session');
    res.render('contact', {data:'', errors: req.flash('errors') });
    }
    
     else if(req.session.user){
      console.log('login-session for ' + req.session.user.email);
           jiitUser.find({Enrollment:req.session.user.Enrollment}, function(err, data){ 
          if(err) throw err; 
          req.flash('errors','Contact our team here!');
          res.render('contact', { data:data, errors: req.flash('errors')});
  });
     }
 });

     app.post('/contact', function(req, res){
         if(!req.session.user){
        var newContact = Contact(req.body).save(function(err, newData){
       if (err) throw err; 
          res.render('contact-success',{data:'', newData:newData});
      
    });
    }
    
     else if(req.session.user){
         var newContact = Contact(req.body).save(function(err, newData){
       if (err) throw err;
         jiitUser.findOne({Enrollment:req.session.user.Enrollment}, function(err, data){ 
          if(err) throw err; 
          res.render('contact-success',{data:data, newData:newData});
         });
      
    });
    
     }

 });

     


};