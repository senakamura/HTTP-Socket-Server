var net = require('net');
var stream = require('stream');
var fs = require('fs');

var Transform = stream.Transform;

var server = net.createServer(function (sock){

  sock.setEncoding('utf8');

  console.log('client connected');


  sock.on('data', function (data){
    console.log('GET request received');
    // console.log(data);

    var splitData = data.split('\n');
    var headData = splitData[0].split(' ');
    var requestType = headData[0];
    var URIrequest = headData[1];



    if (requestType === 'GET'){
      switch (URIrequest){
        case '/':
          combineHeadBody('index.html', requestType, sock);
          break;
        case '/hydrogen.html':
          combineHeadBody('hydrogen.html', requestType, sock);
          break;
        case '/helium.html':
          combineHeadBody('helium.html', requestType, sock);
          break;
        case '/css/styles.css':
          var css = fs.createReadStream('css/styles.css', 'utf8');
          css.pipe(sock);
          break;
        default:
          combineHeadBody('404.html', requestType, sock);
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

  });

  sock.on('end', function (){
    console.log('client disconnect');
    console.log('===========================');
  });

  sock.on('error', function (){
    console.log('ERROR ERROR ERROR');
  });

});

server.listen(8080, function (){
  console.log('connected to ', server.address());
});

function combineHeadBody(filename, requestType, sock){
  var addHead = new Transform();

  addHead._transform = function (chunk, enc, done){
    console.log('transforming the data');
    var string = genHead(requestType, chunk.length);
    string += '\n\n' + chunk;
    this.push(string);
    done();
  };

  fs.createReadStream(filename, 'utf8')
    .pipe(addHead)
    .pipe(sock);
}



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
