/**
 * Created by moranm on 3/3/14.
 */

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


var userSchema = mongoose.Schema({
    name: String,
    connectionMapping: String
});


module.exports = mongoose.model('User', userSchema);