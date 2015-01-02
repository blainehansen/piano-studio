// Global Helpers
UI.registerHelper('session', function (input) {
	return Session.get(input);
});

UI.registerHelper('dollars', function (number) {
	return '$' + parseFloat(number).toFixed(2);
});

UI.registerHelper('equals', function(first, second) {
	return first == second;
});

UI.registerHelper('colonHighlight', function (input) {
	var arr = input.split(':');
	return Spacebars.SafeString('<span class="important">' + arr[0] + ':</span> ' + arr[1]);
});

UI.registerHelper('important', function (input) {
	return Spacebars.SafeString('<span class="important">' + input + '</span>');
});

UI.registerHelper('youtubeLink', function (input) {
	return Spacebars.SafeString('http://www.youtube.com/watch?v=' + input);
});

UI.registerHelper('youtubeEmbed', function (input, ratio, classes) {	
	ratio = ratio || '16by9';
	classes = classes || '';
	var give = '<div class="embed-responsive embed-responsive-' + ratio + ' ' + classes + '">'
	+ '<iframe src="http://www.youtube.com/embed/' + input + '" allowfullscreen></iframe>'
	+ '</div>';
	return Spacebars.SafeString(give);
});

UI.registerHelper('today', function () {
	return moment().format('MM/DD/YYYY');
});

UI.registerHelper('outLink', function (href) {
	return "<a href=" + href + "></a>"
});

Template.editable.created = function () {
	this._editing = new ReactiveVar(false);
};
Template.editable.events({
	'click #editToggle': function (e, t) {
		var old = t._editing.get();
		t._editing.set(!old);
	}
});
Template.editable.helpers({
	editing: function () {
		return Template.instance()._editing.get();
	}
});

Template.clickToEdit.created = function () {
	this._editing = new ReactiveVar(false);
};
Template.clickToEdit.events({
	'click #clickArea': function (e, t) {
		t._editing.set(true);
	},
	'submit form': function (e, t) {
		t._editing.set(false);
	}
});
Template.clickToEdit.helpers({
	editing: function () {
		return Template.instance()._editing.get();
	}
});

var perfectScrollbarOptions = {
	wheelSpeed: 5,
	suppressScrollX: true
};
Template.scroller.rendered = function() {
	if (window.innerWidth >= 768) {
		$(".scroller").perfectScrollbar(perfectScrollbarOptions);
		$(".scroller").resize(function () {
			$(this).perfectScrollbar('update');
		});
	}
};