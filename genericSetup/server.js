'use strict';

const http = require('http');
const app = require('./middleware.js');


module.exports = (app) => http.createServer(app);

const startServer = () => {
  const server = http.createServer(app); //express()
  server.listen(app.get('port'), () => {
    console.log("Express server listening on port", app.get('port'));
  });
}

startServer();