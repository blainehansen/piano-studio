// Configuration and Display Stuff
Template.headerFooter.events({
	'click :not(#userBox)': function (e, t) {
		if (Session.get('userDropdownActivated') && $(e.target).attr('id') != 'userBox' && $(e.target).attr('id') != 'userBoxText')
			Session.set('userDropdownActivated', false);
	}
});
// Template.footer.events({
// 	'click .social-col .social-col-icon a': function (e, t) {
// 		$('.open').removeClass('open');
// 		$(e.target).parent().parent().addClass('open');
// 	}
// });
Template.header.events({
	'click #userBox': function (e, t) {
		Session.set('userDropdownActivated', !Session.get('userDropdownActivated'));
	},
	'click #headerSignOut': function (e, t) {
		Meteor.logout();
	},
	'click #userDropdown a': function (e, t) {
		Session.set('userDropdownActivated', false);
	}
});

Template.backgroundPictures.rendered = function () {
	var handle = Meteor.setInterval(function () {
		var currentSlide = $('.background-slide.top');
		var nextSlide = currentSlide.next('.background-slide');
		if (!nextSlide || nextSlide.length === 0) nextSlide = $('.background-slide').first();

		var currentText = $('.features.top');
		var nextText = currentText.next('.features');
		if (!nextText || nextText.length === 0) nextText = $('.features').first();

		currentSlide.removeClass('top');
		nextSlide.addClass('top');

		currentText.removeClass('top');
		nextText.addClass('top');

	}, 9000);
	Session.set('slideshowIntervalHandle', handle);
};
Template.backgroundPictures.destroyed = function () {
	Meteor.clearTimeout(Session.get('slideshowIntervalHandle'));
};
Template.backgroundPictures.helpers({
	slides: function () {
		return Stories.find({featured: true});
	}
});

Template.home.created = function () {
	TestThings = new Meteor.Collection(null);
	Schema.TestThings = new SimpleSchema({
		testattr: {
			type: String,
			label: "Test Attribute",
			trim: true,
			max: 5
		}
	});
	TestThings.attachSchema(Schema.TestThings);
};
Template.home.helpers({
	news: function () {
		return Stories.find({news: true}, {sort: [['date', 'desc']]});
	},
	testthings: function () {
		return TestThings.find({});
	}
});