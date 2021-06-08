var fs = require('fs');
const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');

const server = express();

server.use(
  '/',
  express.static(path.join(__dirname, './apihub-jar'))
);

server.on('error', err => {
    console.error(err)
    if (!server.listening) {
      return reject(err);
    }
  throw err;
});

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 443;
const privateKey  = fs.readFileSync('sslcert/selfsigned.key', 'utf8');
const certificate = fs.readFileSync('sslcert/selfsigned.crt', 'utf8');
https.createServer({ key: privateKey, cert: certificate }, server).listen(port);
