// Global Helpers
Template.registerHelper('session', function (input) {
	return Session.get(input);
});

Template.registerHelper('dollars', function (number) {
	return '$' + parseFloat(number).toFixed(2);
});

Template.registerHelper('equals', function(first, second) {
	return first == second;
});

Template.registerHelper('colonHighlight', function (input) {
	var arr = input.split(':');
	return Spacebars.SafeString('<span class="important">' + arr[0] + ':</span> ' + arr[1]);
});

Template.registerHelper('important', function (input) {
	return Spacebars.SafeString('<span class="important">' + input + '</span>');
});

Template.registerHelper('youtubeLink', function (input) {
	return Spacebars.SafeString('http://www.youtube.com/watch?v=' + input);
});

Template.registerHelper('youtubeEmbed', function (input, ratio, classes) {	
	ratio = ratio || '16by9';
	classes = classes || '';
	var give = '<div class="embed-responsive embed-responsive-' + ratio + ' ' + classes + '">'
	+ '<iframe src="http://www.youtube.com/embed/' + input + '" allowfullscreen></iframe>'
	+ '</div>';
	return Spacebars.SafeString(give);
});

Template.registerHelper('today', function () {
	return moment().format('MM/DD/YYYY');
});

Template.registerHelper('showDate', function (date) {
	return moment(date).format('MM/DD/YYYY');
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
	'click .open-area': function (e, t) {
		t._editing.set(true);
	},
	'click .close-area': function (e, t) {
		t._editing.set(false);
	},
	'submit form': function (e, t) {
		if (t.data.contextSchema || t.data.contextCollection) {
			var schema = window[t.data.contextSchema] || window[t.data.contextCollection]._c2._simpleSchema;
			var schemaContext = schema.namedContext(t.data.contextId);
			if (schemaContext.isValid())
				t._editing.set(false);
		}
		else t._editing.set(false);
	}
});
Template.clickToEdit.helpers({
	editing: function () {
		return Template.instance()._editing.get();
	}
});


Template.openClose.created = function () {
	this._open = new ReactiveVar(false);
};
Template.openClose.events({
	'click .open-area': function (e, t) {
		t._open.set(true);
	},
	'click .close-area': function (e, t) {
		t._open.set(false);
	}
});
Template.openClose.helpers({
	open: function () {
		return Template.instance()._open.get();
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