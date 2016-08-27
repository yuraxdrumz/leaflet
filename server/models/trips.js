var mongoose = require('mongoose');

var tripSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    markers:{type:Array, default:[]},
    created:{type:Date, default:Date.now}
})

module.exports = mongoose.model('Trip', tripSchema);
