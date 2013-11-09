// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('QMLS8jPgYcA-HloS');

var isProduction = (process.env.NODE_ENV === 'production');
var http = require('http');
var question = require('./backend/question');
var director = require('director');
var staticContent  = require('send');
var port = (isProduction ? 80 : 8000);

function staticContent() {
  staticContent(this.req, this.req.url).root('dist').pipe(response);
}

var router = new director.http.Router({
  '/api/v1': {
    '/question': {
      '/(\\w+)': {
        get: function (id) { question.get(this.res, id); }
      },
      get: question.list,
      put: question.add,
      post: question.add,
    }
  },
  get: staticContent
});


function onRequest(request, response) {
  request.chunks = [];
  request.on('data', function (chunk) {
    request.chunks.push(chunk.toString());
  });

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

http.createServer(onRequest).listen(port, serverError);
