/**
 * Created by moranm on 3/4/14.
 */

var userRepository = require("../DAL/userRepository");
var request = require("request");

module.exports = function (app) {
    app.get('/', function (req, res) {
        userRepository.getAll(function (err, users) {
            if (err) {
                req.flash('errors', {msg: err.message})
            } else {
                res.render("index", {
                    users: users
                });
            }
        })
    });

    app.post('/add-user', function (req, res) {
        var newUserName = req.body.name;
        if (!newUserName) {
            req.flash('errors', {msg: "please enter user name."})
            return res.redirect("/");
        }

        var url = req.body.url;
        if(!url){
            req.flash('errors', {msg: "please enter mapping url."});
            return res.redirect("/");
        }

        userRepository.add({name: newUserName, mappingUrl:url}, function (err, user) {
            if(err){

            }else{
                var users = [];
                users.push(user);
                res.render("index", {users:users});
            }

        })
    });

    app.get("/map/:name/*",function(req, res){
        var userName = req.params.name;
        if (!userName) {
            req.flash('errors', {msg: "please enter user name."});
            return res.redirect("/");
        }

        userRepository.get(userName, function(err,user){
            if(err){
                req.flash('errors', {msg: err.message});
                return res.redirect("/");
            }

            var redirectTo = req.protocol + "://" + req.originalUrl.replace("/map/" + userName,user.connectionMapping);
            request(redirectTo,function(error, response, html){
                if (!error && response.statusCode == 200) {
                    res.send(html);
                }
            })
        })
    });
}
