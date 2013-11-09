// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('QMLS8jPgYcA-HloS');

var async          = require('async'),
    http           = require('http'),
    qs             = require('querystring'),
    rest           = require('restler'),
    socketio       = require('socket.io'),
    staticContent  = require('send');

var isProduction = (process.env.NODE_ENV === 'production');
var port = (isProduction ? 80 : 8000);

var routeHandler = function(request, response) {
    // http://blog.nodeknockout.com/post/35364532732/protip-add-the-vote-ko-badge-to-your-app
    //var voteko = '<iframe src="http://nodeknockout.com/iframe/pandamonium" frameborder=0 scrolling=no allowtransparency=true width=115 height=25></iframe>';

    if (request.url === "/api") {
    } else {
        staticContent(request, request.url).root('dist').pipe(response);
    }
};

var app = http.createServer(routeHandler);
    //io  = socketio.listen(app);

app.listen(port, function(err) {
    if (err) { console.error(err); process.exit(-1); }
  
    // if run as root, downgrade to the owner of this file
    if (process.getuid() === 0) {
        require('fs').stat(__filename, function(err, stats) {
            if (err) { return console.error(err); }
            process.setuid(stats.uid);
        });
    }

    console.log('Server running at http://0.0.0.0:' + port + '/');
});
