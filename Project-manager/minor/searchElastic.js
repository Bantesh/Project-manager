var router=require('express').Router();
var Project = require('../controllers/elasticsearch');


Project.createMapping(function(err, mapping){
  if(err){
    console.log("error creating mapping");
    console.log(err);
  } else{
    console.log("Mapping created");
    console.log(mapping);
  }
});

var stream = Project.synchronize();
var count = 0;

stream.on('data', function(){
   count++;
});

stream.on('close', function(){
   console.log("Indexed " + count + " documents");
});

stream.on('error', function(err ){
   console.log(err);
});

router.post('/results', function(req, res, next){
  res.redirect('/results?q=' + req.body.q);
});

router.get('/results', function(req, res, next){
  if(req.query.q){
    Project.search({
      query_string: { query: req.query.q}
    }, function(err, results) {
      if(err) return next(err);
      var data = results.hits.hits.map(function(hit){
        return hit;
      });
      res.render('results', {
        query: req.query.q,
        projects: data
      });
    });
  }
});

 router.get('/project', function(req, res){
  
  if(!req.query.id){ 
      res.redirect('/add-project')
       }
  Project.find({ _id:req.query.id}, function(err, data){  //Mool.find({}, function(err, data) =>will find all values
    if(err) throw err;
    res.render('project', {qs: req.query, projects:data});
  });
   
 });


 router.post('/search', function(req, res, next){
  console.log(req.body.search_term);
   Project.search({
    query_string: { query: req.body.search_term }
   }, function(err, results){
    if(err) return next(err);
    res.json(results);
   });
 });



module.exports = router;
