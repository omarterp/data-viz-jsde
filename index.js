// import numeral from 'numeral';
//
// const courseValue = numeral(1000).format('$0,0.00');
// // debugger
// console.log(`I would pay ${courseValue} for this awesome course!`); // eslint-disable-line no-console

var express =  require('express');
var cors = require('cors');

const app = express();
app.use(cors());

app.set('port', (process.env.PORT || 5000));

// Landing Page
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/src/index.html');
});

// Map
app.get('/main.js', function(req, res) {
  res.sendFile(__dirname + '/src/main.js');
});

// Data
app.get('/data/stations_2013', function(req, res) {
  res.sendFile(__dirname + '/data/stations_2013.csv');
});
app.get('/data/stations_2014', function(req, res) {
  res.sendFile(__dirname + '/data/stations_2014.csv');
});
app.get('/data/stations_2015', function(req, res) {
  res.sendFile(__dirname + '/data/stations_2015.csv');
});
app.get('/data/stations_2016', function(req, res) {
  res.sendFile(__dirname + '/data/stations_2016.csv');
});
app.get('/data/stations_all', function(req, res) {
  res.sendFile(__dirname + '/data/stations_all.csv');
});
app.get('/data/stations_all_topo', function(req, res) {
  res.sendFile(__dirname + '/data/stations_all.topojson');
});
app.get('/data/nyc-zip-polys', function(req, res) {
  res.sendFile(__dirname + '/data/nyc.topojson');
});




// Styles
app.get('/index.css', function(req, res) {
  res.sendFile(__dirname + '/styles/index.css');
});

app.get('/styles/js/packs/light.js', function(req, res) {
  res.sendFile(__dirname + '/styles/js/packs/light.js');
});

app.get('/styles/js/packs/regular.js', function(req, res) {
  res.sendFile(__dirname + '/styles/js/packs/regular.js');
});

app.get('/styles/js/fontawesome.js', function(req, res) {
  res.sendFile(__dirname + '/styles/js/fontawesome.js')
});

app.get('/styles/index.css', function(req, res) {
  res.sendFile(__dirname + '/styles/index.css')
});

app.get('/bundle.js', function(req, res) {
  res.sendFile(__dirname + '/src/bundle.js')
});

app.listen(app.get('port'), function() {
  /*eslint-disable no-console*/
  console.log("Node app is running at localhost:" + app.get('port'));
});
