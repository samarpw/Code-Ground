fs= require('fs');
cheerio = require('cheerio');
Post = require('../models/models');
path = require('path');
path.join(__dirname, 'template.html')

var show_editor = function(req,res,next){
	console.log(req.params.id);
    res.render('editor');
}


var return_entry = function (req,res,next){
	console.log(req.params.id);
	Post.findById(req.params.id, function (err, doc) {
    if (err) return handleError(err);
	console.log(doc);
	res.render('editor2',{doc});
});

}



var display_frame = function (req,res,next) {
  console.log('----##---')
  console.log('req.params.id');
    Post.findById(req.params.id, function (err, doc) {
    if (err) return handleError(err);
    fs.readFile(path.join(__dirname, 'template.html'), 'utf8',function read(err, data) {
    if (err) {
        throw err;
    }
    const $ = cheerio.load(data);
    $('style').append(doc.css);
    $('.html').append(doc.html);
    $('script').append(doc.js);
    console.log($.html());
    res.status(200).send($.html());



});
});

}






var save_files = function(req,res,next){
var h = req.body.html;
var c= req.body.css;
var j = req.body.js;
console.log(req.body.id);

if (req.body.id===""){
	doc = new Post({html:h,css:c,js:j});
doc.save(function (err, p) {
    if (err) return console.error(err);
    res.send(doc._id);
  });
}
else {
Post.findByIdAndUpdate(req.body.id,{ html: h,css:c,js:j}, { new: true,upsert:true }, function (err, p) {
  if (err) return handleError(err);
  res.end();
});
}
}


module.exports = {show_editor,save_files,return_entry,display_frame};


