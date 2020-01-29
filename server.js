const config=require('./config');
const express=require('express');
const bodyParser=require('body-parser');
const morgan=require('morgan');
const app=express();
const http=require('http').Server(app);
const passport = require('passport');
const TwitterStrategy  = require('passport-twitter').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require("cors");


/*view engine*/
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/*twitter credetials configuration*/
passport.use(new TwitterStrategy({

        consumerKey     : config.twitter_api_key,
        consumerSecret  : config.twitter_api_secret,
        callbackURL     : config.twitter_callback_url

    },
    function(token, tokenSecret, profile, callback) {
		return callback(null, profile);
    }));

    // used to set id session id cookie
    passport.serializeUser(function(user, callback) {
    	console.log("serialize" + user);
        return callback(null, user.id);
    });

    // used to get  session id from cookie
    passport.deserializeUser(function(user, callback) {
    	console.log("deserialize" + user);
       return callback(null, user);
    });

    app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(morgan('dev'));
	app.use(cors());
	app.use(cookieParser());
	app.use(session({ secret: config.session_secret, resave: false, saveUninitialized: true }));
	app.use(passport.initialize());
	app.use(passport.session());

app.use(express.static(__dirname + '/assets'));

/*api requests*/
const api=require('./routes/requestHandler')(app,express,passport);
app.use('/',api);


http.listen(config.port,function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log(http.address());
		

	}
});
