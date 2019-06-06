require('dotenv-safe').load();
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const consign = require('consign');
const helmet = require('helmet');
const cors = require('cors');
global.mongoose = require('mongoose');
const error = require('./middlewares/erros');
const port = process.env.PORT || 3000;
const mongoHost = process.env.DBHOST || 'mongodb://localhost:27017/api-banking';
const app = express();

mongoose.connect(mongoHost);

const options = {
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
  // credentials: true,
  methods: "GET,POST",
  // preflightContinue: false
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors(options));
app.use(helmet());
app.use(bodyparser());
app.use(express.static(path.join(__dirname, 'public')));

consign({ cwd: path.join(__dirname) })
  .include('models')
  .then('middlewares')
  .then('controllers')
  .then('routes')
  .into(app)
;

app.use(error.notFound);

app.listen(port, () => console.log('Server running'))
