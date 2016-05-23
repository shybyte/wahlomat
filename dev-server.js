var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./config/webpack.dev');

const bodyParser = require('body-parser');
const db = require('./tmp/server/db');

var app = express();
var compiler = webpack(config);
var port = process.env.PORT || 3000;

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static('.'));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.post('/vote', (req, res) => {
  db.saveVote(req.body);
  res.json({});
});

// "404" page is the main page in order to allow client side routing.
// app.use(function(req, res, next) {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

app.listen(port, 'localhost', err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Listening at http://localhost:${port}`);
});
