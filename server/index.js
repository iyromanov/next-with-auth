const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const User = require('./service/user');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const SESSION_CONF = { 
  name: 'sesid',
  secret: 'woof woof',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: true,
    expires: 10000
  }
};

const nextApp = next({ dev });
const nextAppRequestHandler = nextApp.getRequestHandler();

async function start() {
  await nextApp.prepare();

  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await User.findOne(username, password);
        return done(null, user)
      } catch(err) {
        return done(null, false, err);
      }
    }
  ));

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser(async (id, cb) => {
    const user = await User.findById(id);
    return cb(null, user)
  });

  const app = express();

  app.use([bodyParser.urlencoded({ extended: false })]);
  app.use(session(SESSION_CONF));
  app.use(passport.initialize());
  app.use(passport.session());

  app.post('/auth',
    passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/')
  );

  app.get('/logout', (req, res) => {
    req.logout();
    return res.redirect('/login');
  });
  
  app.get('/user', (req, res) => {
    if (req.user) {
      return res.json(req.user);
    } else {
      return res.status(401).json({});
    }
  });

  app.get('*', (req, res) => {
    return nextAppRequestHandler(req, res);
  });
  
  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
}

start();