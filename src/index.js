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

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(app.get('port'), function() {
  /*eslint-disable no-console*/
  console.log("Node app is running at localhost:" + app.get('port'));
});
