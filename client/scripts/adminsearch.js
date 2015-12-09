/// Admin Search
Template.adminSearch.rendered = function () {
	Session.set('adminSearchCategory', 'users');
	Belt.session.erase(['adminSearchQueryPopulated', 'adminSearchResult', 'adminSearchQuery']);
};
Template.adminSearch.events({
	'keyup #adminSearchQuery': function (e, t) {
		Session.set('adminSearchQuery', t.find('#adminSearchQuery').value);
	},
	'click .adminSearchCategoryOption': function (e, t) {
		var category = $(e.target).attr('data-option');
		Session.set('adminSearchCategory', category);
	},
	'click .adminSearchResult': function (e, t) {
		var id = $(e.target).attr('data-id');
		t.find('#adminSearchQuery').value = $(e.target).text();
		Meteor.subscribe('adminSpecific', id, Session.get('adminSearchCategory'));
		Session.set('adminSearchQueryPopulated', true);
		Session.set('adminSearchResult', id);
	},
	'click #adminSearchCancelQuery': function (e, t) {
		t.find('#adminSearchQuery').value = '';
		Belt.session.erase(['adminSearchQueryPopulated', 'adminSearchResult', 'adminSearchQuery']);
	}
});
Template.adminSearch.helpers({
	adminSearchUserShow: function () {
		return Session.get('adminSearchCategory') == 'users' && Session.get('adminSearchResult');
	},
	adminSearchStudentShow: function () {
		return Session.get('adminSearchCategory') == 'students' && Session.get('adminSearchResult');
	},
	adminSearchExpenseShow: function () {
		return Session.get('adminSearchCategory') == 'expenses' && Session.get('adminSearchResult');
	},
	adminSearchQueryShow: function () {
		return (Session.get('adminSearchQuery') && !Session.get('adminSearchQueryPopulated')) ? '' : 'hidden';
	},
	adminSearchQueryResults: function () {
		if (Session.get('adminSearchCategory'))
			return collectionQuery(Session.get('adminSearchCategory'), Session.get('adminSearchQuery'));
	},
	adminSearchResult: function () {
		if (Session.get('adminSearchCategory'))
			return chooseCollection(Session.get('adminSearchCategory')).findOne(Session.get('adminSearchResult'));
	},
	adminSearchQueryPopulatedReadonly: function () {
		return Session.get('adminSearchQueryPopulated') ? 'readonly' : '';
	},
	adminSearchQueryPopulatedDisabled: function () {
		return Session.get('adminSearchQueryPopulated') ? '' : 'disabled';
	}
});

// Admin Edit Stuff
Template.adminEditUser.helpers({
	editingTag: function () {
		return tagMaker(this, 'adminEditUser');
	},
	students: function () {
		return giveArrayFromCollection(Students, this.student_ids);
	},
	payments: function () {
		return giveArrayFromCollection(Payments, this.payment_ids, true);
	}
});
Template.adminEditStudent.helpers({
	editingTag: function () {
		return tagMaker(this, 'adminEditStudent');
	},
	lessons: function () {
		return giveArrayFromCollection(Lessons, this.lesson_ids, true);
	},
	expenses: function () {
		return giveArrayFromCollection(StudentExpenses, this.expense_ids, true);
	},
	priceSelectContext: function () {
		return returnPriceOptions(Constants.priceOptionsArray, this);
	}
});
Template.adminEditPayment.helpers({
	editingTag: function () {
		return tagMaker(this.payment, 'adminEditPayment');
	}
});
Template.adminEditLesson.helpers({
	editingTag: function () {
		return tagMaker(this.lesson, 'adminEditLesson');
	},
	priceSelectContext: function () {
		return returnPriceOptions(Constants.adminPriceOptionsArray, this);
	}
});
Template.adminEditStudentExpense.helpers({
	editingTag: function () {
		return tagMaker(this.expense, 'adminEditStudentExpense');
	}
});

Template.adminEditPaymentDatepicker.rendered = function () {
	$('.datepicker').datepicker(datepickerOptions);
};
Template.adminEditLessonDatepicker.rendered = function () {
	$('.datepicker').datepicker(datepickerOptions);
};
Template.adminEditStudentExpenseDatepicker.rendered = function () {
	$('.datepicker').datepicker(datepickerOptions);
};

Template.adminEditUser.events({
	'click #adminEditUser': function (e, t) {
		Session.set(tagMaker(t.data, 'adminEditUser'), true);
	},
	'keypress .adminEditUserInput': function (e, t) {
		if (e.which == 13) {
			if (pushEdits(Meteor.users, t, [
				['#adminEditUserFirstname', 'firstname', existenceTest],
				['#adminEditUserLastname', 'lastname', existenceTest]
			])) {
				Session.set(tagMaker(t.data, 'adminEditUser'), false);
			}
		}
	},
	'keypress #adminEmailsInput': function (e, t) {
		if (e.which == 13) {
			var input = t.find('#adminEmailsInput').value;			
			if (validEmailTest(input)) {
				Meteor.call('checkEmailUnique', input, function (error, result) {
					if (error) console.log(error);
					else if (result) {
						Meteor.users.update(t.data._id, {$push: {'emails': {address: input, verified: false}}});
					}
				});
			}
		}
	},
	'keypress #adminPhonesInput': function (e, t) {
		if (e.which == 13) {
			var input = t.find('#adminPhonesInput').value;
			if (validPhoneTest(input)) {
				var user = Meteor.users.findOne({_id: t.data._id, phones: {$elemMatch: {number: input}}});
				console.log(user);
				if (!user) Meteor.users.update(t.data._id, {$push: {'phones': {number: input}}});
			}
		}
	}
});
Template.adminEditStudent.events({
	'click #adminEditStudent': function (e, t) {
		Session.set(tagMaker(t.data, 'adminEditStudent'), true);
	},
	'keypress .adminEditStudentInput': function (e, t) {
		if (e.which == 13) {
			var attributes = [['#adminEditStudentPrice', 'price', validPriceTest]];
			if (!t.data.reflectsUser) attributes = attributes.concat([
				['#adminEditStudentFirstname', 'firstname', existenceTest],
				['#adminEditStudentLastname', 'lastname', existenceTest],
			]);
			if (pushEdits(Students, t, attributes)) {
				Session.set(tagMaker(t.data, 'adminEditStudent'), false);
			}
		}
	}
});
Template.adminEditEmail.events({
	'click .adminRemove': function (e, t) {
		if (t.data.emails.length >= 2) Meteor.users.update(t.data._use_id, {$pull: {'emails': t.data.email}});
	}
});
Template.adminEditPhone.events({
	'click .adminRemove': function (e, t) {
		if (t.data.phones.length >= 2) Meteor.users.update(t.data._use_id, {$pull: {'phones': t.data.phone}});
	}
});
Template.adminEditPayment.events({
	'click #adminEditPayment': function (e, t) {
		Session.set(tagMaker(t.data.payment, 'adminEditPayment'), true);
	},
	'keypress .adminEditPaymentInput': function (e, t) {
		if (e.which == 13) {
			if (pushEdits(Payments, t, [
				['#adminEditPaymentDate', 'date', validDateTest],
				['#adminEditPaymentAmount', 'amount', validPriceTest],
				['#adminEditPaymentMethod', 'method', existenceTest],
				['#adminEditPaymentComments', 'comments', noopTest]
			], t.data.payment)) {
				Session.set(tagMaker(t.data.payment, 'adminEditPayment'), false);
			}
		}
	},
	'click .adminRemove': function (e, t) {
		Meteor.users.update(t.data._use_id, {$pull: {'payment_ids': t.data.payment._id}});
		Payments.remove(t.data.payment._id);
	}
});
Template.adminEditLesson.events({
	'click #adminEditLesson': function (e, t) {
		Session.set(tagMaker(t.data.lesson, 'adminEditLesson'), true);
	},
	'keypress .adminEditLessonInput': function (e, t) {
		if (e.which == 13) {
			if (pushEdits(Lessons, t, [
				['#adminEditLessonDate', 'date', validDateTest],
				['#adminEditLessonPrice', 'price', validPriceTest],
				['#adminEditLessonComments', 'comments', noopTest]
			], t.data.lesson)) {
				Session.set(tagMaker(t.data.lesson, 'adminEditLesson'), false);
			}
		}
	},
	'click .adminRemove': function (e, t) {
		Students.update(t.data._use_id, {$pull: {'lesson_ids': t.data.lesson._id}});
		Lessons.remove(t.data.lesson._id);
	}
});
Template.adminEditStudentExpense.events({
	'click #adminEditStudentExpense': function (e, t) {
		Session.set(tagMaker(t.data.expense, 'adminEditStudentExpense'), true);
	},
	'keypress .adminEditStudentExpenseInput': function (e, t) {
		if (e.which == 13) {
			if (pushEdits(StudentExpenses, t, [
				['#adminEditStudentExpenseDate', 'date', validDateTest],
				['#adminEditStudentExpensePrice', 'price', validPriceTest],
				['#adminEditStudentExpenseComments', 'comments', noopTest]
			], t.data.expense)) {
				Session.set(tagMaker(t.data.expense, 'adminEditStudentExpense'), false);
			}
		}
	},
	'click .adminRemove': function (e, t) {
		Students.update(t.data._use_id, {$pull: {'expense_ids': t.data.expense._id}});
		StudentExpenses.remove(t.data.expense._id);
	}
});