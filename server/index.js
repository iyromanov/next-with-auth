const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

const USER = { id: 1, name: 'Igor' };

async function start() {
  await app.prepare();

  passport.use(new LocalStrategy(
    (username, password, done) => {
      if (username === password) {
        return done(null, USER)
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    }
  ));

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {
    if (id === 1) {
      return cb(null, USER)
    }
  });

  const server = express();
  server.use([bodyParser.urlencoded({ extended: true }), cookieParser()]);
  server.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
  server.use(passport.initialize());
  server.use(passport.session());

  server.post('/auth',
    passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/')
  );
  
  server.get('/me', (req, res) => {
    if (req.user) {
      return res.json(req.user);
    } else {
      return res.status(401).send({});
    }
  });

  server.get('/logout', (req, res) => {
    req.logout();
    return res.redirect('/login');
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