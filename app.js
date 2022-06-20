const server = require('http').createServer();
server.on("request", async function (req, res) {
    try {
        const blacklist = ['/favicon.ico'];
    
        if(blacklist.includes(req.url)) 
        return (res.end()); 
        
        switch (req.url) {
            case '/':
                res.statusCode = 200;
                res.end("Welcome to home route.");
                break;
            case '/getTimeStories':
                try {
                    let getStories = require("./story");
                    let stories = await getStories();
                    res.statusCode = 200;
                    res.end(JSON.stringify(stories));
                    break;
                } catch (e) {
                    res.statusCode = 500;
                    res.end("Error: " + e.message);
                    break;
                }
            default:
            res.statusCode = 404;
            res.write("error : unknown route");
            res.end();
        }
    } catch (e) {
        console.log(e);
    }
})
const PORT = 3000
server.listen(PORT, (err, res) => {
    if(!err) console.log("server listening at http://localhost:" + PORT)
})