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

var isProduction = (process.env.NODE_ENV === 'production');
var port = (isProduction ? 80 : 8000);

var staticContent = function(req, res) {
    //console.log(url.parse(req.url));

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
    .root('dist')
    .on('error', staticError)
    .on('directory', staticRedirect)
    .pipe(res);
}

var router = new director.http.Router({
    '/api/v1': {
        '/question': {
            '/(\\w+)': {
                get: function (id) { question.get(this.res, id); }
            },
            get: question.list,
            put: question.add
        }
    },
    '/.*': {
        get: function() {
            console.log(this.req.url);
            staticContent(this.req, this.res);
        }
    }
});

function onRequest(request, response) {
    router.dispatch(request, response, function (err) {
        console.log(request.url);
        if (err) {
            console.log(err);
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
