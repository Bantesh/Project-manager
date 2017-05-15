var path = require('path')
var filePath = path.join(__dirname, 'all.pdf')
var extract = require('pdf-text-extract')
/*extract(filePath, function (err, pages) {
  if (err) {
    console.dir(err)
    return
  }
  console.dir(pages)
}) */
extract(filePath, { splitPages: false }, function (err, text) {
  if (err) {
    console.dir(err)
    return
  }
  console.dir(text)
})