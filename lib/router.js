FastController = RouteController.extend();

StoryController = RouteController.extend({
	waitOn: function () {
		var handle = {};
		handle.ready = function () {
			return Stories.find().count() !== 0;
		}
		return handle;
	}
});

RepertoireController = StoryController.extend({
	waitOn: [function () {
		var handle = {};
		handle.ready = function () {
			return Composers.find().count() !== 0;
		}
		return handle;
	}, function () {
		var handle = {};
		handle.ready = function () {
			return Pieces.find().count() !== 0;
		}
		return handle;
	}]
});

Router.plugin('loading', {notFoundTemplate: 'loading'});
Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});



Router.configure({
	layoutTemplate: 'headerFooter',
	controller: 'StoryController',
	// waitOn: function () { return Meteor.subscribe('currentUser'); }
});
Router.setTemplateNameConverter(function (str) { return str; });


Router.route('/', {
	name: 'home'
});

Router.route('/teaching', {
	name: 'teaching',
	template: 'teachingPost',
	data: function () {
		return Stories.findOne({contentTemplate: 'teachingHome', category: 'teaching'});
	}
});

Router.route('/teaching/:contentTemplate', {
	name: 'teachingPost',
	onBeforeAction: function () {
		if (this.params.contentTemplate == 'teachingHome') Router.go('teaching');
		else if (this.params.contentTemplate == 'repertoireHome' || this.params.contentTemplate == 'repertoire') Router.go('repertoire');
		else this.next();
	},
	data: function () {
		return Stories.findOne({contentTemplate: this.params.contentTemplate, category: 'teaching'});
	}
});

Router.route('/repertoire', {
	name: 'repertoire',
	template: 'teachingPost',
	data: function () {
		return {contentTemplate: 'repertoireHome'};
	},
	controller: 'RepertoireController'
});

// this.route('repertoirePost', {
// 	path: '/repertoire/:contentTemplate',
// 	template: 'teachingPost',
// 	onBeforeAction: function () {
		// if (this.params.contentTemplate == 'repertoireHome') Router.go('repertoire');
		// else this.next();
	// },
// 	data: function () {
// 		return Stories.findOne({contentTemplate: this.params.contentTemplate, category: 'repertoire'});
// 	},
// 	controller: 'RepertoireController'
// });

Router.route('/projects', {
	name: 'projects',
	data: function () {
		if (this.params.hash) {
			return Stories.find({category: 'projects', type: this.params.hash})
		}
		else {
			return Stories.find({category: 'projects'});
		}
	}
});

Router.route('/projects/:contentTemplate', {
	name: 'projectsPost',
	data: function () {
		return Stories.findOne({contentTemplate: this.params.contentTemplate, category: 'projects'});
	}
});

Router.route('/blog', {
	name: 'blog',
	template: 'blogPost',
	data: function () {
		return Stories.findOne({contentTemplate: 'blogHome', category: 'blog'});
	}
});

Router.route('/blog/:contentTemplate', {
	name: 'blogPost',
	data: function () {
		return Stories.findOne({contentTemplate: this.params.contentTemplate, category: 'blog'});
	}
});

Router.route('/social', {
	name: 'social'
});

Router.route('/admin', {
	name: 'admin',
	waitOn: function () { return Meteor.subscribe('adminAll'); }
});

Router.route('/login', {
	name: 'login'
});

Router.route('/user', {
	name: 'user',
	template: 'userView',
	data: function () { return Meteor.user(); }
});

Router.route('/reset', {
	name: 'reset'
});

Router.route('/Performances', {
	onBeforeAction: function () { Router.go('teaching'); }
});

Router.route('/Pricing', {
	onBeforeAction: function () { Router.go('teachingPost', { contentTemplate: 'pricing' }); }
});

Router.route('/Policy', {
	onBeforeAction: function () { Router.go('teachingPost', { contentTemplate: 'policy' }); }	
});

Router.route('/Benefits', {
	onBeforeAction: function () { Router.go('teachingPost', { contentTemplate: 'benefits' }); }	
});

Router.route('/Exercises', {
	onBeforeAction: function () { Router.go('teachingPost', { contentTemplate: 'exercises' }); }	
});

Router.route('/Biography', {
	onBeforeAction: function () { Router.go('teachingPost', { contentTemplate: 'bio' }); }	
});

Router.route('/Contact', {
	onBeforeAction: function () { Router.go('teachingPost', { contentTemplate: 'contact'}); }	
});

Router.onBeforeAction(function () {
	if (!Roles.userIsInRole(Meteor.userId(), 'admin')) this.render('notFound');
	else this.next();
}, { only: ['admin'] });

Router.onBeforeAction(function () {
	if (!Meteor.userId()) this.render('login');
	else {
		this.render('userView');
		this.next();
	} 
}, { only: ['user'] });

Router.onBeforeAction(function () {
	if (Meteor.userId()) this.redirect('user');
	else this.next();
}, { only: ['login'] });