/// Admin stuff.
Template.admin.created = function () {
	Session.set('entryType', "user");
	Session.set('query', '');
	Entries = new Meteor.Collection(null);
	Belt.addCollection('entries', Entries);
};
Template.admin.events({
	'change #entryType': function (e, t) {
		Session.set('entryType', t.find('#entryType').value);
		Belt.session.erase(['query', 'entryInputsInvalid', 'entryInputsNumberInvalid', 'priceSelectContext', 'queryPopulated']);
	},
	'keyup #entryZone #query': function (e, t) {
		Session.set('query', t.find('#query').value);
	},
	'keypress #entryZone': function (e, t) {
		if (e.which == 13) {
			var obj = {type: Session.get('entryType')};
			var inputs = t.findAll('.entryInput');
			var valid = inputs.every(function (item) {
				var value = item.value.trim();
				if (!value && !(item.name == 'email' || item.name == 'comments')) {
					Session.set('entryInputsInvalid', true);
					return false;
				}
				if (item.name == 'price' || item.name == 'amount') {
					value = parseFloat(value);
					if (isNaN(value)) {
						Session.set('entryInputsNumberInvalid', true);
						return false;
					}
					else {
						Session.set('entryInputsNumberInvalid', false);
					}
				}
				if (item.name == 'query' && value && !Session.get('queryPopulated')) {
					Session.set('entryInputsInvalid', true);
					return false;
				}
				obj[item.name] = value;
				return true;
			});

			t.find('#entryType').focus();
			if (!valid) return;

			inputs.forEach(function (item) {
				if (item.name != 'price' && item.name != 'date') {
					item.value = '';
				}
			});
			Belt.session.erase(['query', 'entryInputsInvalid', 'entryInputsNumberInvalid', 'priceSelectContext', 'queryPopulated']);
			Entries.insert(obj);
		}
	},
	'click .result': function (e, t) {
		e.preventDefault();
		var id = $(e.target).attr('data-id');
		var price = $(e.target).attr('data-price');
		if (price !== undefined) {
			Session.set('priceSelectContext', returnPriceOptions(Constants.priceOptionsArray, { price: price }));
		}
		var fullName = $(e.target).text();
		$('[name=attach_id]').attr('value', id);
		$('#query').val(fullName);
		Session.set('query', '');
		Session.set('queryPopulated', true);
		t.find('#afterQuery').focus();
	},
	'click #cancelQuery': function (e, t) {
		$('#query').val('');
		Belt.session.erase(['priceSelectContext', 'queryPopulated']);
	},
	'click #saveEntries': function (e, t) {
		Entries.find().forEach(function (doc) {
			delete doc['_id'];
			var type = doc.type;
			delete doc['type'];
			var attachId = doc.attach_id;
			delete doc['attach_id'];
			delete doc['query'];

			var errorCallback = function (error) { if (error) console.log(error.reason); };

			switch (type) {
				case "user":
					Meteor.call('adminCreateUser', doc, errorCallback);
					return;
				case "student":
					Meteor.call('createStudent', doc, attachId, errorCallback);
					return;
				case "lesson":
					Meteor.call('createLesson', doc, attachId, errorCallback);
					return;
				case "payment":
					Meteor.call('createPayment', doc, attachId, errorCallback);
					return;
				case "studentexpense":
					Meteor.call('createStudentExpense', doc, attachId, errorCallback);
					return;
				case "expense":
					Meteor.call('createExpense', doc, errorCallback);
					return;
			}
		});
		Entries.remove({});
		Belt.session.erase(['query', 'entryInputsInvalid', 'entryInputsNumberInvalid', 'priceSelectContext', 'queryPopulated']);
	}
});
Template.entryStudentInput.helpers({
	priceOptions: Constants.priceOptionsArray
});
Template.entryLessonInput.helpers({
	priceSelectContext: function () {
		return Session.get('priceSelectContext');
	}
});
Template.admin.helpers({
	entries: function () {
		var curs = Entries.find();
		if (curs.count() > 0) return curs;
		else return false;
	},
	currentType: function () {
		return Session.get('entryType');
	},
	entry: function () {
		switch (this.type) {
			case "user":
				return this.data ? Template.entryUser : Template.entryUserInput;
			case "student":
				return this.data ? Template.entryStudent : Template.entryStudentInput;
			case "lesson":
				return this.data ? Template.entryLesson : Template.entryLessonInput;
			case "payment":
				return this.data ? Template.entryPayment : Template.entryPaymentInput;
			case "studentexpense":
				return this.data ? Template.entryStudentExpense : Template.entryStudentExpenseInput;
			case "expense":
				return this.data ? Template.entryExpense : Template.entryExpenseInput;
		}
	}
});

var entryDisplayEvents = {
	'click .removeEntry': function (e, t) {
		Entries.remove(this._id);
	}
};
Template.entryUser.events(entryDisplayEvents);
Template.entryStudent.events(entryDisplayEvents);
Template.entryLesson.events(entryDisplayEvents);
Template.entryPayment.events(entryDisplayEvents);
Template.entryStudentExpense.events(entryDisplayEvents);
Template.entryExpense.events(entryDisplayEvents);

var collectionQuery = function (collection, query) {
	collection = chooseCollection(collection);
	var splitArray = _.compact((query || '').split(" "));
	if (splitArray.length == 1) {
		var re = splitArray[0];
		return collection.find({$or: [{firstname: { $regex: re, $options: 'i' }}, {lastname: { $regex: re, $options: 'i' }}]},
			{limit: 6});
	}
	else if (splitArray.length >= 2) {
		var re1 = splitArray[0];
		var re2 = splitArray[1];
		return collection.find({$or: [{firstname: { $regex: re1, $options: 'i' }}, {lastname: { $regex: re2, $options: 'i' }}]},
			{limit: 6});
	}
};
UI.registerHelper('queryResults', function (collection) {
	return collectionQuery(collection, Session.get('query'));
});
UI.registerHelper('queryPopulatedReadonly', function () {
	return Session.get('queryPopulated') ? 'readonly': '';
});
UI.registerHelper('queryPopulatedDisabled', function () {
	return Session.get('queryPopulated') ? '': 'disabled';
});
UI.registerHelper('queryShow', function () {
	return (Session.get('query') && !Session.get('queryPopulated')) ? '' : 'hidden';
});

var datepickerOptions = {
	todayBtn: "linked",
	autoclose: true,
	todayHighlight: true
};
Template.entryDatePicker.rendered = function () {
	$('.datepicker').datepicker(datepickerOptions);
};