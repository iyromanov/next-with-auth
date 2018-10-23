const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

async function start() {
  await app.prepare();

  const server = express();
  server.use([bodyParser.urlencoded(), cookieParser()]);
  
  server.post('/auth', (req, res) => {
    if (isUser(req.body)) {
      res.cookie('foo', 'bar', { httpOnly: true });
    }
    return res.redirect('/user');
  });
  
  server.get('/me', (req, res) => {
    if (isAuthorized(req.cookies)) {
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify({ name: 'Igor' }));
    } else {
      return res.status(401).send({});
    }
  });
  
  server.get('*', (req, res) => {
    return handle(req, res);
  });
  
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
}

start();

function isUser({ login, password }) {
  return login === password;
}

function isAuthorized({ foo }) {
  return foo === 'bar';
}