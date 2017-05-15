var path = require('path')
fs = require('fs');
var mool = "cd152a1643e6e921b66e9eff207ee0ea";
var filePath = path.join(__dirname, 'assets/uploads/'+mool)
var extract = require('pdf-text-extract')
extract(filePath, { splitPages: false }, function (err, text) {
  if (err) {
    console.dir(err)
    return
  }
  console.log(text);

  fs.writeFile('minor/assets/textFile/all.txt', text, function (err) {
    if (err) 
        return console.log(err);
    console.log('Hello World > helloworld.txt');
});
});

