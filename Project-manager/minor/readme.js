var SummaryTool = require('node-summary');
var fs=require('fs');

//var readme = fs.readFileSync('moolchand.txt','utf8');
//var title = "moolchand is a good boy virat kohli is a good batsman";

var readme = fs.readFileSync('moolchand2.txt','utf8');
var title = "group members Technologies project theme analyzing the application";

SummaryTool.summarize(title, readme, function(err, summary) {
    if(err) console.log("Something went wrong man!");

    console.log(summary);

});
