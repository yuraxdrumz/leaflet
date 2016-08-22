var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var passport = require('passport');
               require('./server/config/passport')(passport);


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


    app.post('/api/register',function(req, res, next){
        passport.authenticate('local-signup', function(err, user, info){
        var token;

        // If Passport throws/catches an error
        if (err) {
          res.status(401).json(err);
          return;
        }

        // If a user is found
        if(user){
            token = user.generateJwt();
            res.status(200);
            res.json({
            "token" : token
            });

        } else {
          // If user is not found
          res.status(401).json(info);
        }
        })(req, res)
    })

    app.post('/api/login', function(req, res, next){
        passport.authenticate('local-login',function(err, user, info){
            var token;

            if(err){
                res.status(401).json(err);
                return
            }
            if(user){
                token = user.generateJwt();
                res.status(200);
                res.json({"token":token});
            }
            else{
                res.status(401).json(info)
            }
        })(req, res)
    });

    app.listen(port, function(){
        console.log('listening on port' + port);
    });
});
