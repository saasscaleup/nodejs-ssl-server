const express = require('express');
const app = express();
const rateLimitMiddleware = require('./middlewares/ratelimit.js');
const vrmApiModule = require('./middlewares/vrmApiModule.js');
const hostname = '127.0.0.1'; // Your server ip address
const port = 3000;

app.use(rateLimitMiddleware)

const version = '1.0.0';

app.get('/', (req, res) => {
    // set response content    
        res.send(`<html>
                    <body>
                        <h1 style="color:blue;text-align: center;margin-top: 100px;"> [Version ${version}]: This is AMAZING!!! JRE</h1>
                        <div style="position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%)">
                            <img src="https://picsum.photos/400/400?random=1">
                        </div>
                    </body>
                   </html>`, vrmApiModule.fetchData());
 
  console.log(`[Version ${version}]: New request => http://${hostname}:${port}`+req.url);

})

app.listen(port, () => {
    console.log(`[Version ${version}]: Server running at http://${hostname}:${port}/`);
})
