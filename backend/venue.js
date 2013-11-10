var http = require('https');
var Venue = null; 

function list(lat,lng,opts,res) {
  var str = '';
  var options = {
    host: 'api.foursquare.com',
    port: 443,
    path: '/v2/venues/explore?' + 
      '&client_id=' + process.env.FOURSQ_CLIENT_ID + 
      '&client_secret=' + process.env.FOURSQ_CLIENT_SECRET +
      '&v=20131110' +
      '&intent=browse' +
      '&ll=' + lat + "," + lng 
  };
  options.path = opts ? options.path += '&query=' + opts : options.path;
   
  console.log(options)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  
  http.request(options, function(response) {
    response.on('data', function (chunk) {
      str += chunk;
    });
    
    response.on('end', function () {
      res.end(JSON.stringify(str));
    });
  }).end()
}

module.exports.list = list;

