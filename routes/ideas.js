const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Get Idea DB schema
const IdeaModel = require('../models/Idea');

// Connect to mongoose
mongoose.connect('mongodb://localhost/ideas-dev')
.then(() => console.log('mongodb connected'))
.catch(err => console.log('mongodb err: ' + err));

router.post('/', (req, res) => {
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
				res.redirect('ideas/');
			});
	}
});

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
	IdeaModel.remove({_id: req.params.id})
		.then(() => {
			res.redirect('/ideas');
		})
})

router.get('/', (req, res) => {
	IdeaModel.find({})
		.sort({date: 'desc'})
		.then(ideas => {
			res.render('ideas/index', {
				ideas: ideas
			})
		})
});

router.get('/add', (req, res) => {
	res.render('ideas/add');
});

router.get('/edit/:id', (req, res) => {
	IdeaModel.findOne({
		_id: req.params.id
	})
	.then(idea => {
		res.render('ideas/edit', {
			idea: idea
		})
	})
});

module.exports = router;