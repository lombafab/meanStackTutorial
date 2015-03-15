var express = require('express');
var stylus = require('stylus');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'development';

var app = express();

function compile(str, path) {
    return stylus(str).set('filename', path);
}


app.set('view engine', 'jade');
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.set('views', __dirname + '/server/views');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(stylus.middleware (
    {
        src: __dirname + '/public',
        compile: compile
    }
));
app.use(express.static(__dirname + '/public'));

// MongoDB connect
if (env === 'development') {
    mongoose.connect('mongodb://localhost/multivision');
} else {
    mongoose.connect('mongodb://fabio:multivision@ds035280.mongolab.com:35280/multivision');
}


var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error..."));
db.once('open', function callback() {
    console.log('multivision db opened');
});

//Creating a message schema
var messageSchema = mongoose.Schema({message: String});
var Message = mongoose.model('Message', messageSchema);
var mongoMessage;
Message.findOne().exec(function(err, messageDoc) {
   mongoMessage = messageDoc.message;
});

app.get('/partials/:partialPath', function(req, res) {
    res.render('partials/' + req.params.partialPath);
});

app.get('*', function (req, res) {
    res.render('index', {
       mongoMessage: mongoMessage
    });
});

var port = process.env.PORT || 3030;

var server = app.listen(port, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)

})