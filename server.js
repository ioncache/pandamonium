// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('QMLS8jPgYcA-HloS');

// npm modules
var async          = require('async'),
    director       = require('director'),
    http           = require('http'),
    qs             = require('querystring'),
    rest           = require('restler'),
    send           = require('send'),
    socketio       = require('socket.io'),
    url            = require('url');

// our modules
var question       = require('./backend/question');
var venue          = require('./backend/venue');

var isProduction = (process.env.NODE_ENV === 'production');
var port         = isProduction ? 80 : 8000;
var staticFolder = isProduction ? '/home/deploy/current/dist' : 'app';

var staticContent = function(req, res) {

    var staticError = function(err) {
        res.statusCode = err.status || 500;
        res.end(err.message);
    }
    
    var staticRedirect = function() {
        res.statusCode = 301;
        res.setHeader('Location', req.url + '/');
        res.end('Redirecting to ' + req.url + '/');
    }

    send(req, url.parse(req.url).pathname)
    .root(staticFolder)
    .on('error', staticError)
    .on('directory', staticRedirect)
    .pipe(res);
}

var router = new director.http.Router({

    '/api/v1': {
        '/question': {
            '/:id': {
                '/answer': {
                    '/:answerId': {
                        '/downvote': {
                            get: question.answerDownvote,
                        },
                        '/upvote': {
                            get: question.answerUpvote,
                        },
                    },
                    put: question.addAnswer,
                    post: question.addAnswer
                },
                '/downvote': {
                    get: question.downvote,
                },
                '/upvote': {
                    get: question.upvote,
                },
                get: question.get
            },
            get: question.list,
            put: question.add,
            post: question.add,
        },
        '/user': {
            '/:id': {
                get: question.listByUser
            },
            get: question.listByUser
        },
        '/venues/explore': {
          '/:lat': {
            '/:lng': {
              get: venue.list,
              '/:query': {
                get: venue.list,
              }          
            }
          }
        }
    },
    '/.*': {
        get: function() {
            staticContent(this.req, this.res);
        }
    }
});

function onRequest(request, response) {
    this.request = request;
    this.response = response;
    request.chunks = [];
    request.on('data', function (chunk) {
        request.chunks.push(chunk.toString());
    });
  
    router.dispatch(request, response, function (err) {
        if (err) {
            response.writeHead(err.status, { 'Content-Type': 'text/plain' });
            response.end(err.message);
        }
    });
}

function serverError(err) {
    if (err) { console.error(err); process.exit(-1); }

    console.log('Server running at http://0.0.0.0:' + port + '/');
}

http.createServer(onRequest).listen(port, serverError);
