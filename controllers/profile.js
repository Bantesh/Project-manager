var bodyParser = require('body-parser');
var mongoose = require('mongoose'); 

var Invite = require('../global-module/Invite-module');
var jiitUser = require('../global-module/jiitUser-module');
var Project = require('../global-module/Project-module');
var Photo = require('../global-module/photo-module');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
 


module.exports=function(app){ 

 app.get('/profile',function(req, res){

      if(!req.session.user){
    console.log('out of session YOU NEED TO LOGIN FIRST!');
    return res.redirect('/login');
    }

     else if(req.session.user){
      console.log('login-session for ' + req.session.user.Enrollment);
      Project.find({addedBy:req.session.user.Enrollment}, function(err, data){
         Photo.findOne({Enrollment:req.session.user.Enrollment}, function(err, photo){
            res.render('userProfile', { data:req.session.user,addedBy:data,photo:photo, errors:req.flash('errors')});
         })
     
      })
    //res.render('userProfile', { data:req.session.user, errors:req.flash('errors')});

     }

 });

     app.post('/profile', function(req, res){

     jiitUser.findOne({Enrollment:req.body.toUser}, function(err, existingUser){
    if(existingUser && req.body.fromUser != req.body.toUser){ 
        var newInvite = Invite(req.body).save(function(err, data){
        if (err) throw err;
         req.flash('errors', "Invited successfully!! " + req.body.toUser);
        return res.redirect('/profile')
        });

    } else if(req.body.fromUser == req.body.toUser){
       req.flash('errors', " you can't invite yourself ");
          return res.redirect('/profile')

    } else{
         console.log(req.body.toUser + " doesn't exists you can't invite");
          req.flash('errors', "doesn't exists you can't invite " + req.body.toUser);
          return res.redirect('/profile')
    }
  });


 });


   app.get('/networks',function(req, res){

      if(!req.session.user){
    console.log('out of session YOU NEED TO LOGIN FIRST!');
    return res.redirect('/login');
    }

     else if(req.session.user){
      console.log('login-session for ' + req.session.user.Enrollment);
         
      Invite.find({toUser:req.session.user.Enrollment}, function(err, data){  
    if(err) throw err;
   
    res.render('myNetworks', { data:req.session.user, inviteUsers:data, errors:req.flash('errors')});
  
  });

     }

 });



    app.post('/networks', function(req, res){
         
     // Invite.updateOne({ fromUser:req.body.fromUser, toUser:req.session.user.email  },{ response : req.body.response   },function(err, data){
       //    if(err) throw err;
         //  console.log(err,data);
     //  return res.redirect('/networks');
        //   });
    Invite.findOne({fromUser : req.body.fromUser, toUser: req.session.user.Enrollment, rId: req.body.rId})
    .exec()
    .then((user) => {
      user.response = req.body.response
      user.save((err,data) => {
        console.log(err,data);
        return res.redirect('/networks');
      });

  });

 });


      app.get('/otherUser', function(req, res){
     if(!req.session.user){
    console.log('out of session YOU NEED TO LOGIN FIRST!');
    return res.redirect('/login');
    } 

     else if(req.session.user){
      console.log('login-session for ' + req.session.user.Enrollment);
         
       if(!req.query.Enrollment){ 
      res.redirect('/networks')
       }

  jiitUser.findOne({Enrollment:req.query.Enrollment}, function(err, data){  //Mool.find({}, function(err, data) =>will find all values
    if(err) throw err;
    console.log(err,data);
     Photo.findOne({Enrollment:req.query.Enrollment}, function(err, photo){
      console.log(photo);
         res.render('otherUser', {qs:req.query, otherUser:data, photo:photo, data:req.session.user});
     })
  });

     }

   
 });


};