var mongoose = require('mongoose');
var User = require('../models/user-model');
var localStrategy = require('passport-local').Strategy;

module.exports = function(passport){
    passport.use('local-signup', new localStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    },
        function(req, email, password, done){
            User.findOne({email:email}).exec()
            .then(function(user){
                if(user){
                    return done(null,false,{message:'this email is taken'});
                }else{
                    var user = new User({
                        _id:mongoose.Types.ObjectId(),
                        name:req.body.name,
                        username:req.body.username,
                        email:email
                    });
                    user.setPassword(password);
                    user.save().then(function(){
                        return done(null, user)
                    })
                    .catch(function(err){
                        done(err)
                    })
                }
            })
            .catch(function(err){
                done(err)
            })


        }

    ));
    passport.use('local-login', new localStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    },
        function(req, email, password, done){
            User.findOne({email:email}).exec()
            .then(function(user){

                if(!user){
                    return done(null, false, {message:'User not found'})
                }
                if(!user.checkValid(password)){
                    return done(null, false, {message:'Wrong password'})
                }
                return done(null, user)
            })
            .catch(function(err){
                done(err)
            })
    }
    ))
}
