const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOveride = require('method-override');
const app = express();

// Get Idea DB schema
const IdeaModel = require('./models/Idea');

// Connect to mongoose
mongoose.connect('mongodb://localhost/ideas-dev')
.then(() => console.log('mongodb connected'))
.catch(err => console.log('mongodb err: ' + err));

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOveride('_method'));

app.get('/', (req, res) => {
	const title = 'Hello app';
	res.render('index', {
		title: title
	});
});

app.post('/ideas', (req, res) => {
	let errors = [];
	if (!req.body.title) {
		errors.push({text: 'Please add a title'});
	}
	if (!req.body.details) {
		errors.push({text: 'Please add some details'});
	}
	if (errors.length > 0) {
		res.render('ideas/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	} else {
		const newIdea = {
			title: req.body.title,
			details: req.body.details
		}
		new IdeaModel(newIdea)
			.save()
			.then(idea => {
				res.redirect('/ideas');
			});
	}
});

app.put('/ideas/:id', (req, res) => {
	IdeaModel.findOne({
		_id: req.params.id
	})
	.then(idea => {
		idea.title = req.body.title;
		idea.details = req.body.details;

		idea.save()
			.then(idea => {
				res.redirect('/ideas');
			});
	})
});

app.delete('/ideas/:id', (req, res) => {
	IdeaModel.remove({_id: req.params.id})
		.then(() => {
			res.redirect('/ideas');
		})
})

app.get('/ideas', (req, res) => {
	IdeaModel.find({})
		.sort({date: 'desc'})
		.then(ideas => {
			res.render('ideas/index', {
				ideas: ideas
			})
		})
});

app.get('/ideas/add', (req, res) => {
	res.render('ideas/add');
});

app.get('/ideas/edit/:id', (req, res) => {
	IdeaModel.findOne({
		_id: req.params.id
	})
	.then(idea => {
		res.render('ideas/edit', {
			idea: idea
		})
	})
});

app.get('/about', (req, res) => {
	res.render('about')
});

app.listen(5000, () => {
	console.log('Server started on port 5000')
});