// import numeral from 'numeral';
//
// const courseValue = numeral(1000).format('$0,0.00');
// // debugger
// console.log(`I would pay ${courseValue} for this awesome course!`); // eslint-disable-line no-console

import './index.css';
var express =  require('express');
var cors = require('cors');

const app = express();
app.use(cors());

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send('index.html')
});

app.get('/users', function(req, res) {
  // Hard coding for simplicity. Pretend this hits a real database
  res.json([
    {"id": 1,"firstName":"Bob","lastName":"Smith","email":"bob@gmail.com"},
    {"id": 2,"firstName":"Tammy","lastName":"Norton","email":"tnorton@yahoo.com"},
    {"id": 3,"firstName":"Tina","lastName":"Lee","email":"lee.tina@hotmail.com"}
  ]);
});

app.listen(app.get('port'), function() {
  /*eslint-disable no-console*/
  console.log("Node app is running at localhost:" + app.get('port'));
});
