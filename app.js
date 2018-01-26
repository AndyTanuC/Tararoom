var express 	= require('express'),
	db 			= require('./db');
	path 		= require('path'),
	bodyParser 	= require('body-parser'),
	cookieParser= require('cookie-parser'),
	exphbs 		= require('express-handlebars'),
	flash 		= require('connect-flash'),
	session 	= require('express-session'),
	passport 	= require('passport'),
	localStrategy 		= require('passport-local').Strategy,
	expressValidator 	= require('express-validator'),
	app 		= express();

// Assign routes
var routes 		= require('./routes/index');
var user 		= require('./routes/user');
var admin 		= require('./routes/admin');

// Set View Engine
app.set('views',path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
	defaultLayout: 'layout',
  	helpers:{
    math: function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    },
    ifvalue: function (conditional, options) { 
    	if (conditional == options.hash.equals) {
	        return options.fn(this);
	    } else {
	        return options.inverse(this);
	    }
    }
}}));
app.set('view engine', 'handlebars');

// Static Path
app.use(express.static(path.join(__dirname,'public')))

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Express Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace 	= param.split('.'),
		root 			= namespace.shift(),
		formParam 		= root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}

		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

// Connect Flash
app.use(flash());

app.use(function(req,res,next) {
	res.locals.success_msg 	= req.flash('success_msg');
	res.locals.error_msg 	= req.flash('error_msg');
	res.locals.error 		= req.flash('error');
	res.locals.user 		= req.user || null;
	res.locals.admin 		= req.admin || null;
	next();
});
//END

// Use routes files
app.use('/',routes);
app.use('/admin',admin);
app.use('/user',user);

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'),function() {
	console.log('Started');
	db.sync({force: false})
    .then(message => {
      	console.log('...and db is synced!');
    })
    .catch(function(err) {
      	throw err;
    });

});