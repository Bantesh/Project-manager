var http = require('http');
var fs = require('fs');
var request = require('request');
var express = require('express');
var qs = require('qs');

var server = http.createServer(function(req,res){
 if(req.method == 'POST'){
     var body='';
               req.on('data', function (data) {
                   body +=data;
               });
               req.on('end',function(){
                   var POST =  qs.parse(body);
                   request({
                       url: 'https://webkiosk.jiit.ac.in/CommonFiles/UserActionn.jsp', //URL to hit
                       form: {
                           'x':"",
                           'txtInst':'institute',
                           'InstCode':"JIIT",
                           'txtuType':"Member Type",
                           "UserType":'S',
                           "txtCode":"Enrollment",
                           'MemberCode':POST.Enrollment,
                           'DOB' :POST.DOB,
                           "DATE1":'DOB',
                           'txtPin':'Password/Pin',
                           'Password':POST.password,
                           'BTNSubmit':'Submit'
                       },
                       method: 'POST',
                       headers: {
                           'User-Agent': 'request'
                       }
                   }, function(error, response, body){
                    console.log(body);  
                       if(!error&& response.statusCode == 302) {
                           res.write("You are now logged in");
                           res.end();
                       } else {
                           res.write("Can not login please try again");
                           res.end();
                       }
                   });
                   console.log(POST);
               });


} else {
    fs.createReadStream(__dirname+'/gupta.ejs').pipe(res);
}

});

server.listen(3000,'localhost');
console.log('shubham is doing well');
