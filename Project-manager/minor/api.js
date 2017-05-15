var http = require('http');
var fs = require('fs');
var request = require('request');


var server = http.createServer(function(req,res){
  console.log('Request was made:' + req.url);
if(req.url === '/login'){

              request({
                  url: 'https://webkiosk.jiit.ac.in/CommonFiles/UserActionn.jsp', //URL to hit
                  form: {
                      'x':"",
                      'txtInst':'institute',
                      'InstCode':"JIIT",
                      'txtuType':"Member Type",
                      "UserType":'S',
                      "txtCode":"Enrollment No",
                      'MemberCode': '14103086',
                      'DOB' :'01/10/1996',
                      "DATE1":'DOB',
                      'txtPin':'Password/Pin',
                      'Password':'SHUBH@M32873',
                      'BTNSubmit':'Submit'
                  },
                  method: 'POST',
                  headers: {
                      'User-Agent': 'request'
                  }
              });

}

});

server.listen(3000,'localhost');
console.log('shubham is doing btech from jaypee institute of information technology');
