var mongoose = require('mongoose');
var User = require('../models/user-model');
var express = require('express');
var router = express.Router();

module.exports = function(passport){
    router.post('/register',function(req, res, next){
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
    });

    router.post('/login',function(req, res, next){
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
    router.post('/newtrip', function(req,res){
        console.log(req.body)
    })
    return router;
}
