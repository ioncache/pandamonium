var mongoose = require('mongoose');
var Question = null; 

function questions() {
    var questionSchema = mongoose.Schema({
        query: String,
        date: { type: Date, default: Date.now },
        questionLoc: [Number],
        askedLoc: [Number],
        answeredDistance: Number, // Distance in m from question location that answerer can be
        expires: Date,
        meta: {
            votes: { type: Number, default: 0 },
            favs: { type: Number, default: 0 },
            tags: { type: Array, default: [] },
        },
        answers: [{
            body: String,
            date: { type: Date, default: Date.now },
            answeredLoc: [Number],
            meta: {
                votes: { type: Number, default: 0 },
                favs: { type: Number, default: 0 },
            }
        }],
    });

    questionSchema.index({ "questionLoc" : "2dsphere"});

    questionSchema.methods.answer = function (body, loc) {
        this.answers.push({
            body: body,
            answeredLoc: loc
        });
    }

    Question = mongoose.model('Question', questionSchema);
    console.log('Question model created');
}

function add() {
    var question = new Question({
        query: 'How long is the line at Burger Priest?',
        questionLoc: [43.646036 , -79.409782],
        askedLoc: [43.646228, -79.391853],
        answeredDistance: 5,
        expires: Date.now() + (60*60*1000)
    });
    question.save(function (err, question) {
          if (err) // TODO handle the error
          console.log('Saved' + question);
    });
}

function list() {
  var res = this.res;
  var url = require('url');
  var query = url.parse(this.req.url, true).query;

  res.writeHead(200, { 'Content-Type': 'text/plain' })
  console.log('Listing questions near ' + query.lat + ' ' + query.long);

  var point = { type : "Point", coordinates : [Number(query.lat), Number(query.long)] };
  Question.geoNear(point, { spherical : true, maxDistance : 5 }, function(err, questions, stats) {
    if (err) {
      console.log(err);
      res.end('Error');
    }// TODO handle err
    console.log(stats);
    res.end(JSON.stringify(questions));
  });
}

function get(res, id) {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  console.log('Getting question ' + id);
  Question.findById(id, function (err, questions) {
    if (err) {
      console.log(err);
      res.end('Error');
    }// TODO handle err
    res.end(JSON.stringify(questions));
  });
}

mongoose.connect('mongodb://localhost/pandamonium');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', questions);

module.exports.list = list;
module.exports.add = add;
module.exports.get = get;