var mongoose = require('mongoose');
var User = require('../models/user-model');
var express = require('express');
var router = express.Router();
var Trip = require('../models/trip-model');
module.exports = function(passport){
    router.post('/register',function(req, res, next){
        passport.authenticate('local-signup', function(err, user, info){
        var token;

        // If Passport throws/catches an error
        if (err) {
          res.status(504).json(err);
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
                res.status(504).json(err);
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
        var trip = new Trip({
            _id:mongoose.Types.ObjectId(),
            coords:req.body.coords,
            popups:req.body.popups,
            user_id:req.body.user_id,
            user_email:req.body.user_email,
            distance:req.body.distance
        });
        trip.save().then(function(){
            res.json('saved')
        }).catch(function(err){
            res.status(504).json(err)
        });
    });
    router.get('/trips/:id',function(req, res){
        var id = req.params.id;
        Trip.find({user_id:id}).exec().then(function(data){
            res.json(data)
        }).catch(function(err){
            res.status(504).json(err);
        })
    });
    router.get('/edit/:trip_id', function(req, res){
        var trip_id = req.params.trip_id;
        Trip.find({_id:trip_id}).exec().then(function(data){
            res.json(data)
        }).catch(function(err){
            res.status(504).json(err)
        });
    })
    router.post('/edit/:trip_id', function(req, res){
        var trip_id = req.params.trip_id;
        var data = req.body
        Trip.findOneAndUpdate({_id:trip_id},{
            popups:req.body.popups,
            coords:req.body.coords,
            distance:req.body.distance
        }).exec().then(function(data){
            res.json(data)
        }).catch(function(err){
            res.status(504).json(err)
        })
    });
    router.get('/delete/:delete_id', function(req, res){

        var delete_id = req.params.delete_id;
        console.log(delete_id)
        Trip.remove({_id:delete_id}).exec().then(function(){
            res.json('deleted')
        }).catch(function(err){
            res.status(504).json(err)
        })
    })
    return router;
}
