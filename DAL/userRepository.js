/**
 * Created by moranm on 3/4/14.
 */

var User = require("../models/user");

module.exports = {
    getAll: getAllUsers,
    get: get,
    add: add
}

function get(userName, callback) {
    User.findOne({name: userName}, function (err, user) {
        if (err) {
            return reportError(callback, err, "unable to read from DB");
        }

        if(!user){
            return reportError(callback, err, "unable to find user with name = " + userName);
        }

        callback(false,user);
    });
}

function getAllUsers(callback) {
    User.find({}, function (err, users) {
        if (err) {
            return reportError(callback, err, "unable to read from DB");
        }
        callback(false, users);
    })
}

function add(_newUser, callback) {
    User.findOne({name: _newUser.name}, function (err, user) {
        if (err) {
            return reportError(callback, err, "unable to read from DB");
        }
        if (!user) {
            var newUser = new User();
            newUser.name = _newUser.name;
            newUser.connectionMapping = _newUser.mappingUrl;

            newUser.save(function (err) {
                if (err) {
                    return reportError(callback, err, "unable to save new user");
                }

                callback(false, newUser);
            });
        } else {
            reportError(callback, err, "user name exist");
        }
    })
}

function reportError(callback, err, message) {
    callback({
        err: err,
        message: message
    });
}