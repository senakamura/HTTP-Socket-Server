var net = require('net');
var fs = require('fs');

var home = fs.readFileSync('index.html', 'utf8');
var hydrogen = fs.readFileSync('hydrogen.html', 'utf8');
var helium = fs.readFileSync('helium.html', 'utf8');
var error = fs.readFileSync('404.html', 'utf8');

var css = fs.readFileSync('css/styles.css', 'utf8');

var server = net.createServer(function (sock){
  sock.setEncoding('utf8');

  console.log('client connected');

  sock.on('data', function (data){
    console.log('GET request received');

    var splitData = data.split('\n');
    var headData = splitData[0].split(' ');
    var requestType = headData[0];
    var URIrequest = headData[1];

    if (requestType === 'GET'){
      switch (URIrequest){
        case '/':
          sock.write(genHead(requestType, home.length));
          sock.write('\n\n' + home);
          sock.end();
          break;
        case '/hydrogen.html':
          sock.write(genHead(requestType, hydrogen.length));
          sock.write('\n\n' + hydrogen);
          sock.end();
          break;
        case '/helium.html':
          sock.write(genHead(requestType, helium.length));
          sock.write('\n\n' + helium);
          sock.end();
          break;
        case '/css/styles.css':
          sock.write('\n\n' + css);
          sock.end();
          break;
        default:
          sock.write(genHead('ERROR', error.length));
          sock.write('\n\n' + error);
          sock.end();
      }
    }

    if (requestType === 'HEAD'){
      switch (URIrequest){
        case '/':
          sock.write(genHead(requestType, home.length));
          sock.end();
          break;
        case '/hydrogen.html':
          sock.write(genHead(requestType, hydrogen.length));
          sock.end();
          break;
        case '/helium.html':
          sock.write(genHead(requestType, helium.lenght));
          sock.end();
          break;
        case '/css/styles.css':
          sock.write(genHead(requestType, css.length));
          sock.end();
          break;
        default:
          sock.write(genHead('ERROR', error.length));
          sock.end();
          break;
      }
    }
    sock.end();
  });

  sock.on('end', function (){
    console.log('client disconnect');
  });


});

server.listen(8080, function (){
  console.log('connected to ', server.address());
});

function genHead (requestType, contentLength){
  var response = '';
  switch (requestType){
    case 'GET':
      response += 'HTTP/1.1 200 OK' + '\n';
      break;
    case 'ERROR':
      response += 'HTTP/1.1 404 Not Found' + '\n';
      break;
  }
  response += 'Server: Nakaz Server' + '\n';
  response += 'Date: ' + new Date() + '\n';
  response += 'Content-Length: ' + contentLength + '\n';
  response += 'Content-Type: text/html' + '\n';
  response += 'charset=utf-8' + '\n';
  response += 'Connection: keep-alive';
  return response;
}