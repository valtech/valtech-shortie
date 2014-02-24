var http = require('http');

var port = process.env.PORT || 1337;

var server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("Hello");
    res.end();
});

server.listen(port);		
