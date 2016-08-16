var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./config/webpack.dev');

const routes = require('./tmp/server/routes');

var app = express();
var compiler = webpack(config);
var port = process.env.PORT || 3000;

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(__dirname + '/public'));

routes.initRoutes(app);

// "404" page is the main page in order to allow client side routing.
// app.use(function(req, res, next) {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

app.listen(port, '0.0.0.0', err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Listening at http://localhost:${port}`);
});
