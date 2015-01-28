var express  = require('express');
    app      = express();                 // create our app w/ express
    mongoose = require('mongoose');       // mongoose for mongodb
    fs = require('fs');
    expressLoad = require('express-load');
    packageJson = require("./../package.json");

app.configure(function() {
    app.use(express.static(__dirname + '/../client'));
    app.use(express.logger('dev')); // log every request to the console
    app.use(express.cookieParser()); // read cookies (needed for auth)
    app.use(express.bodyParser()); // get information from html forms
});


console.log("Directory name: " + __dirname);
fs = require('fs');

var modelsPath = __dirname+"/models";
var routesPath = __dirname+"/routes";

expressLoad(modelsPath, {
    extlist: /^(?!.*_spec\.).*\.(js$)/
}).then(routesPath, {
    extlist: /(.*)\.(js$)/
}).into(app);



app.listen(5000);
module.exports = app;


//mongoose.connect(config.dbpath + "/" + config.dbname);
//var db = mongoose.connection;
//db.on('error', console.error);
//db.once('open', function() {
//    console.log("Connection to the database is open");
//});
