var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var passport = require('passport');
               require('./server/config/passport')(passport);
var apiRouter = require('./server/routes/api-router')(passport);
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/mytrip')

var con = mongoose.connection;

con.on('error',console.error.bind(console,'connectin error'));
con.on('open',function(){
    app.use(morgan('dev'));
    app.use(passport.initialize());
    app.use(express.static(__dirname + '/client'));
    app.use(express.static(__dirname + '/node_modules'));
    app.use(bodyParser.json());




    app.get('/',function(req, res, next){
        res.sendFile(__dirname + '/index.html');
    });

    app.use('/api',apiRouter);

    app.listen(port, function(){
        console.log('listening on port' + port);
    });
});
