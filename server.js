var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 3002;
var mongoose = require('mongoose');
var flash = require('express-flash');
var connectAssets = require('connect-assets');
var fs = require("fs");
var routesPath = './routes/';

var configDB = require('./config/database.js');

var hour = 3600000;
var day = (hour * 24);
var week = (day * 7);
var month = (day * 30);

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

// require('./config/passport')(passport); // pass passport for configuration

app.configure(function () {

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(connectAssets({
        paths: ['public/css', 'public/js'],
        helperContext: app.locals
    }));

    // set up our express application
    app.use(express.logger('dev')); // log every request to the console
    app.use(express.cookieParser()); // read cookies (needed for auth)
    app.use(express.bodyParser()); // get information from html forms
    app.use(express.json());

    // required for passport
    app.use(express.session({ secret: 'sears-israel-mobile-team-roles' })); // session secret
    app.use(flash()); // use connect-flash for flash messages stored in session

    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));
    app.use(express.errorHandler());

});

// routes ======================================================================


//dynamically load application routes
fs.readdirSync(routesPath).forEach(function (file) {
    var route = routesPath + file;
    require(route)(app);
});


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);