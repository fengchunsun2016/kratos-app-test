/**
 * Created by feng on 2017/12/28.
 */


const http = require('http');
const fs = require('fs');
const url = require('url');




let server = http.createServer(
  (req,res)=>{
    //console.log(req.url,'req.url');

    var urlObj = url.parse(req.url,true);
    let pathName = urlObj.pathname;
    //console.log(urlObj,'urlObj');
    //console.log(pathName,'pathName');

    var suffix = pathName.substr(req.url.length - 4, 4);

    if (suffix === '.css') {
      var filename = pathName.substr(5,pathName.length - 5);
     // console.log(filename,'css-filename');

      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(get_file_content(__dirname + '/css/' + filename));
    } else if (suffix === '.jpg') {
      var filename = pathName.substr(8,pathName.length - 8);
      //console.log(filename,'jpg-filename');

      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.end(get_file_content(__dirname+'/images/'+filename));

    } else if (suffix.indexOf('.js') != '-1'){
      var filename = pathName.substr(4,pathName.length - 4);
      //console.log(filename,'js-filename');

      res.writeHead(200, { 'Content-Type': 'application/x-javascript' });
      res.end(get_file_content(__dirname + '/js/'+ filename));
    } else if(pathName == '/'){

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(get_file_content(__dirname + '/' + 'home.html'));
    } else if(pathName == '/detail.html'){

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(get_file_content(__dirname + '/' + 'detail.html'));
    } else if(pathName == '/popular.html'){
      console.log('pppppppppppppppppp');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(get_file_content(__dirname + '/' + 'popular.html'));
    } else if(pathName == '/order.html'){
      console.log('oooooooooooooooo');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(get_file_content(__dirname + '/' + 'order.html'));
    } else if (suffix == '.ico'){

      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(get_file_content(__dirname+'/images/iphone.jpg'));
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('貌似迷路了，，，');
    }



    /*res.writeHead(200,{"content-type":"text/html"});
    res.end(fs.readFileSync(__dirname+"/"+"home.html","utf8"));*/

  }
).listen(1990,function () {
  console.log('listening 1990 success');
})

function get_file_content(filepath) {
  return fs.readFileSync(filepath);
}



