/*fs = require('fs'),
        
PDFParser = require("pdf2json");

  fs.readFile('all.pdf', (err, pdfBuffer) => {
      if (!err) {
       // pdfParser.parseBuffer(pdfBuffer);
       console.log(pdfBuffer);
      }
    });

*/
var fs = require('fs');
var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var mongoosastic = require('mongoosastic');
var ejs = require('ejs');
var engine = require('ejs-mate');


var app=express();

app.use(express.static('./minor'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.engine('ejs', engine);
app.set('view engine', 'ejs');


app.get('/', function(req, res){
  //res.sednfile('all.pdf')
  fs.readFile('all.pdf',function(error,data){
    if(error){
       res.json(error);
    }else{
       res.sendfile('all.pdf')
    }
});
});



app.listen(3000);
console.log('yo, bro! it is working');