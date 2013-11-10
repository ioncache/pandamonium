var mongoose = require('mongoose');
var _ = require('underscore');

var Question = null; 

function questions() {
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var questionSchema = mongoose.Schema({
        query: String,
        date: { type: Date, default: Date.now },
        questionLoc: [Number],
        askedLoc: [Number],
        answeredDistance: Number, // Distance in m from question location that answerer can be
        expires: Date,
        userID: ObjectId,
        username: String,
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
        id: String
    });

    questionSchema.index({ "questionLoc" : "2dsphere"});

    questionSchema.methods.answer = function(body, loc) {
        this.answers.push({
            body: body,
            answeredLoc: loc
        });
    }

    Question = mongoose.model('Question', questionSchema);
    console.log('Question model created');
}

function add() {
  var params = this.req.body;
  var question = new Question({
      query: params.q,
      questionLoc: [ params.qlat, params.qlong],
      askedLoc: [ params.alat, params.along],
      answeredDistance: params.dist,
      expires: Date.now() + (60*60*1000)
  });
  if (params.userid != null) {
      question.userId = params.userid;
  }
  question.save(function (err, question) {
    if (err) { // TODO handle the error
        console.log(err);
    }
    console.log('Saved: ' + question);
  });
  this.res.writeHead(201, { 'Location': 'http://' + this.req.headers.host + this.req.url + '/' + question._id }); this.res.end();
}

function vote(id, amount, model) {
  model.findById(id, function (err, item) {
    if (err) // TODO handle err
    item.meta.votes += amount;
    item.save(function (err, question) {
      if (err) // TODO handle the error
      console.log('Saved upvote on ' + id);
    });
  });
}

function voteAnswer(id, answerId, amount) {
  Question.findOne({_id: id, 'answers._id': answerId}, {'answers.$': 1}, function(err, question) {
    question.answers[0].meta.votes += amount;
    question.save(function (err, question) {
      if (err) // TODO handle the error
      console.log('Saved upvote on answer ' + id);
    });
  });
}

function redirect(id, res, req) {
  res.writeHead(201, { 'Location': 'http://' + req.headers.host + req.url + '/' + id });
  res.end();
}

function answerUpvote(id, answerId) {
  voteAnswer(id, answerId, 1);
  redirect(id, this.res, this.req);
}

function answerDownvote(id, answerId) {
  voteAnswer(id, answerId, -1);
  redirect(id, this.res, this.req);
}

function upvote(id) {
  vote(id, 1, Question);
  redirect(id, this.res, this.req);
}

function downvote(id) {
  vote(id, -1, Question);
  redirect(id, this.res, this.req);
}

function savingLog(err, question, msg) {
  if (err) // TODO handle the error
  console.log('Adding answer for ' + question);
}

function addAnswer(id) {
  var res = this.res;
  var req = this.req;
  var params = req.body
  Question.findById(id, function (err, question) {
    if (err) // TODO handle err
    question.answer(params.answer, [params.alat, params.along])
    question.save(savingLog);
    redirect(id, res, req);
  });
}

function geoList(res, lat, long) {
  Question.geoNear({ type : "Point", coordinates : [lat, long] }, { limit: 20, spherical : true, maxDistance : 5 }, function(err, questions, stats) {
    if (err) // TODO handle err
    console.log('Listing questions near ' + lat + ' ' + long);
    res.end(JSON.stringify(questions));
  });
}

function simpleList(res) {
  Question.find(function (err, questions) {
    if (err) { // TODO handle err
        console.log(err);
    }

    _.each(questions, function(e, i) {
        e.id = e._id;
    });

    console.log('Listing questions');
    res.end(JSON.stringify(questions));
  }).limit(20);
}

function list() {
  var res = this.res;
  var url = require('url');
  var query = url.parse(this.req.url, true).query;

  res.writeHead(200, { 'Content-Type': 'application/json' })
  if (query.lat != null && query.long != null) {
    geoList(res, Number(query.lat), Number(query.long));
  } else {
    simpleList(res);
  }
}

function listByUser(id) {
  Question.find({ userId: id}, function (err, questions) {
    if (err) { // TODO handle err
        console.log(err);
    }

    _.each(questions, function(e, i) {
        e.id = e._id;
    });

    console.log('Listing questions for userid ' + id);
    res.end(JSON.stringify(questions));
  }).limit(20);
}

function get(id) {
  res = this.res;
  res.writeHead(200, { 'Content-Type': 'application/json' })
  Question.findById(id, function (err, questions) {
    if (err) // TODO handle err
    questions = _.map(questions, function(v, k, l) {
        v.id = v._id;
        return v;
    });
    console.log('Getting question ' + id);
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
module.exports.addAnswer = addAnswer;
module.exports.upvote = upvote;
module.exports.downvote = downvote;
module.exports.answerUpvote = answerUpvote;
module.exports.answerDownvote = answerDownvote;
