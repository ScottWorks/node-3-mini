require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const createInitialSession = require('./middleware/session');
const filter = require('./middleware/filter');
const mc = require(`./controllers/messages_controller`);
const session = require('express-session');

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../build`));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 10000
    }
  })
);

app.use((req, res, next) => createInitialSession(req, res, next));
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    filter(req, res, next);
  } else {
    next();
  }
});

app.post('/api/messages', mc.create);
app.get('/api/messages', mc.read);
app.get('/api/messages/history', mc.delete);
app.put('/api/messages', mc.update);
app.delete('/api/messages', mc.delete);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
