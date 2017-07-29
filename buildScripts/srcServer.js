var express = require('express');
var path = require('path');
var open = require('open');
var webpack = require('webpack');
var config = require('../webpack.config.js');

/*eslint-disable no-console*/

const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

// Landing Page
app.get('/', function(req, res) {
  res.sendFile(path.resolve('src/index.html'));
});

// Map
app.get('/main.js', function(req, res) {
  res.sendFile(path.resolve('src/main.js'));
});

// Data
app.get('/stations_2014', function(req, res) {
  res.sendFile(path.resolve('data/stations_2014.json'));
});

// Styles
app.get('/index.css', function(req, res) {
  res.sendFile(path.resolve('styles/index.css'));
});

app.get('/styles/js/packs/light.js', function(req, res) {
  res.sendFile(path.resolve('styles/js/packs/light.js'));
});

app.get('/styles/js/fontawesome.js', function(req, res) {
  res.sendFile(path.resolve('styles/js/fontawesome.js'));
});


app.listen(port, function(err){
  if(err) {
    console.log(err);
  } else {
    open('http://localhost:' + port);
  }
});
