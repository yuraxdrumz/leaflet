var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:String,
    email:String,
    username:String,
    salt:String,
    hash:String
});

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.checkValid = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = function(){
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign({
        _id:this._id,
        email:this.email,
        name:this.name,
        username:this.username,
        exp:parseInt(expiry.getTime()/1000)
    },'this is a secret so keep it safe')
}

module.exports = mongoose.model('User',userSchema);
