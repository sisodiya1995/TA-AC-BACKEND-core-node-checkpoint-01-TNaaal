var http = require('http');
var fs = require('fs');
var path = require('path')
var qs = require('querystring')
var url = require('url')
var server = http.createServer(handleRequest)


const userDir = path.join(__dirname, "contacts/");
function handleRequest(req, res) {

    if (req.method === "GET" && req.url === "/") {
        res.setHeader('content-type', 'text/html')
        fs.readFile('./index.html' ,(err ,content) =>{
          if(err) return console.log(err);
          res.end(content)
        })
    }
    if (req.method === "GET" && req.url === "/about") {
        res.setHeader('content-type', 'text/html')
       // fs.createReadStream('./about.html').pipe(res)
       fs.readFile('./about.html' ,(err ,content) =>{
        if(err) return console.log(err);
        res.end(content)
      })
    }

    if (req.url.split(".").pop() === "css") {
        res.setHeader("Content-Type", "text/css");
        fs.createReadStream('./stylesheet/style.css').pipe(res)
    }

    if (req.url.split(".").pop() === "png") {
        res.setHeader("Content-Type", "image/png");
        fs.createReadStream('./assets/21104.png').pipe(res)
    }
    
    var parsedUrl = url.parse(req.url, true)
    var store = '';
    req.on('data', (chunk) => {
        store = store + chunk
    })
    req.on('end', () => {

        if (req.method === "GET" && req.url === "/contact") {
           // fs.createReadStream('./form.html').pipe(res)
           fs.readFile('./form.html' ,(err ,content) =>{
            if(err) return console.log(err);
            res.end(content)
          })
        }

        if (req.method === "POST" && req.url === "/contac") {
            console.log(store);
            var userName = qs.parse(store).username;
            console.log(userName);
            var jsonData = JSON.stringify(qs.parse(store))
            console.log(jsonData);
            // fs.readFile('./form.html' ,(err ,content) =>{
            //     if(err) return console.log(err);
            //     res.end(content)
            //   })
            fs.open(userDir + userName + ".json", "wx", (err, fd) => {
                fs.writeFile(fd, jsonData, (err) => {
                    if (err) return console.log(err);
                    fs.close(fd, (err) => {
                        if(err)return console.log(err)
                        res.end(`${userName} successfully created`);
                    });
                });
            });

        }
        if (parsedUrl.pathname === "/contacts" && req.method === "GET") {
            var username = parsedUrl.query.username
            fs.readFile(userDir + username + '.json', (err, content) => {
                if (err) return console.log(err);
                let userData = (JSON.parse(content.toString()));
                console.log(userData);
                res.setHeader('Content-Type', 'text/html');
                res.end(`<p>${userData.username}<p> <p>${userData.name}<p> <p>${userData.email}<p> <p>${userData.age}<p>`)

            });
        }
    })
}
server.listen(7000, () => {
    console.log(`liston on port 7k`)
})