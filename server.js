// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('QMLS8jPgYcA-HloS');

var isProduction = (process.env.NODE_ENV === 'production');
var http = require('http');
var url = require('url');
var mongoose = require('mongoose');
var director = require('director');
var router = require('./router');
var port = (isProduction ? 80 : 8000);

function helloWorld() {
  this.res.writeHead(200, { 'Content-Type': 'text/plain' })
  var voteko = '<iframe src="http://nodeknockout.com/iframe/pandamonium" frameborder=0 scrolling=no allowtransparency=true width=115 height=25></iframe>';
  // http://blog.nodeknockout.com/post/35364532732/protip-add-the-vote-ko-badge-to-your-app
  this.res.end('hello world');
}

var router = new director.http.Router({
  '/hello': {
    get: helloWorld
  },
  '/v1': {
    '/question': {
      '/(\\w+)': {
        get: function (id) { showQuestion(this.res, id); }
      },
      get: listQuestions,
      put: addQuestion
    }
  }
});

function onRequest(request, response) {
  router.dispatch(request, response, function (err) {
    if (err) {
      response.writeHead(404);
      response.end();
    }
  });

}

function serverError(err) {
  if (err) { console.error(err); process.exit(-1); }

  // if run as root, downgrade to the owner of this file
  if (process.getuid() === 0) {
    require('fs').stat(__filename, function(err, stats) {
      if (err) { return console.error(err); }
      process.setuid(stats.uid);
    });
  }

  console.log('Server running at http://0.0.0.0:' + port + '/');
}


function questions() {
    var questionSchema = mongoose.Schema({
        query: String,
        date: { type: Date, default: Date.now },
        questionLoc: { type: [Number], index: '2dsphere' },
        askedLoc: { type: [Number], index: '2dsphere' },
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
            answeredLoc: { type: [Number], index: '2dsphere' },
            meta: {
                votes: { type: Number, default: 0 },
                favs: { type: Number, default: 0 },
            }
        }],
    });

    questionSchema.methods.answer = function (body, loc) {
        this.answers.push({
            body: body,
            answeredLoc: loc
        });
    }

    Question = mongoose.model('Question', questionSchema);
    console.log('Question model created');
}

function addQuestion() {
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

function listQuestions() {
  var res = this.res;
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  console.log('Listing questions');
  Question.find(function (err, questions) {
    if (err) {
      res.end('Error');
    }// TODO handle err
    res.end(JSON.stringify(questions));
  });
}

function showQuestion(res, id) {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  console.log('Listing questions');
  Question.findById(id, function (err, questions) {
    if (err) {
      res.end('Error');
    }// TODO handle err
    res.end(JSON.stringify(questions));
  });
}

http.createServer(onRequest).listen(port, serverError);
mongoose.connect('mongodb://localhost/pandamonium');
var db = mongoose.connection;
var Question = null; 
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', questions);
