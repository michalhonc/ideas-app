const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const methodOveride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

// Load Router
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOveride('_method'));

// Express session
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global var
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	const title = 'Hello app';
	res.render('index', {
		title: title
	});
});

app.get('/about', (req, res) => {
	res.render('about')
});
// Use routes
app.use('/ideas', ideas);
app.use('/users', users); 

app.listen(5000, () => {
	console.log('Server started on port 5000')
});