/// User page stuff.
Template.userView.events({
	'keypress #initialFirstname, keypress #initialLastname': function (e, t) {
		if (e.which == 13) {
			var firstInput = t.find('#initialFirstname').value;
			var lastInput = t.find('#initialLastname').value;
			if (firstInput && lastInput) {
				Session.set('namesInputInvalid', undefined);
				Meteor.users.update(Meteor.userId(), {$set: {firstname: firstInput, lastname: lastInput}});
			}
			else Session.set('namesInputInvalid', true);
		}
	},
	'keypress #initialEmailConfirm': function (e, t) {
		if (e.which == 13) {
			var input = t.find('#initialEmail').value;
			var inputConfirm = t.find('#initialEmailConfirm').value;
			if (input && inputConfirm && (input == inputConfirm)) {
				Session.set('emailInputInvalid', undefined);
				Meteor.call('giveEmail', input, function (error) {
					if (error) console.log(error);
					else alert("Great! You've been sent an email to validate this address.");
				});
			}
			else Session.set('emailInputInvalid', true);
		}
	},
	'keypress #emailsInput': function (e, t) {
		if (e.which == 13) {
			var input = t.find('#emailsInput').value;
			if (validEmailTest(input)) {
				Meteor.call('checkEmailUnique', input, function (error, result) {
					if (error) Session.set('emailNewInputInvalid');
					else if (result) {
						Meteor.users.update(Meteor.userId(), {$push: {'emails': {address: input, verified: false}}});
						resetSessionVars(['emailNewInputInvalid', 'emailNewInputNotUnique']);
						t.find('#emailsInput').value = '';
					}
					else Session.set('emailNewInputNotUnique', true);
				});
			}
			else Session.set('emailNewInputInvalid', true);
		}
	},
	'click #editNames': function (e, t) {
		Session.set('editingNames', true);
	},
	'click #editPassword': function (e, t) {
		Session.set('editingPassword', true);
	},
	'click #cancelEditingPassword': function (e, t) {
		resetSessionVars(['editingPassword']);
	},
	'keypress #editFirstname, keypress #editLastname': function (e, t) {
		if (e.which == 13) {
			var firstInput = t.find('#editFirstname').value;
			var lastInput = t.find('#editLastname').value;
			if (firstInput && lastInput) {
				resetSessionVars(['namesInputInvalid', 'editingNames']);

				var setObject = {};
				if (firstInput != t.data.firstname) setObject.firstname = firstInput;
				if (lastInput != t.data.lastname) setObject.lastname = lastInput;
				if (!setObject) return;

				Meteor.users.update(Meteor.userId(), {$set: setObject});
			}
			else Session.set('namesInputInvalid', true);
		}
	},
	'keypress #editPasswordAuth, keypress #editPasswordNew, keypress #editPasswordConfirm': function (e, t) {
		if (e.which == 13) {
			var authInput = t.find('#editPasswordAuth').value;
			var newInput = t.find('#editPasswordNew').value;
			var confirmInput = t.find('#editPasswordConfirm').value;
			if (newInput == confirmInput) {
				resetSessionVars(['passwordInputInvalid']);
				Accounts.changePassword(authInput, newInput, function (error) {
					if (!error) {
						resetSessionVars(['passwordInputDenied', 'passwordInputInvalid', 'editingPassword']);
						alert('Your password was successfully changed!');
					}
					else Session.set('passwordInputDenied', error.reason);
				});
			}
			else Session.set('passwordInputInvalid', true);

		}
	},
	'keypress #phonesInput': function (e, t) {
		if (e.which == 13) {
			var phoneInput = t.find('#phonesInput').value;
			if (phoneInput) {
				Meteor.users.update(Meteor.userId(), {$push: {'phones': {number: phoneInput}}});
				t.find('#phonesInput').value = '';
			}
			else console.log('Input Empty');
		}
	},
	// 'keypress #studentFirstnameInput, keypress #studentLastnameInput': function (e, t) {
	// 	if (e.which == 13) {
	// 		var firstInput = t.find('#studentFirstnameInput').value;
	// 		var lastInput = t.find('#studentLastnameInput').value;
	// 		var priceInput = t.find('#studentPriceInput').value;
	// 		if (firstInput && lastInput) {
	// 			Meteor.call('createStudent', {firstname: firstInput, lastname: lastInput, price: priceInput}, Meteor.userId(), 
	// 				function () {
	// 					t.find('#studentFirstnameInput').value = '';
	// 					t.find('#studentLastnameInput').value = '';
	// 					Meteor.subscribe('currentUser');
	// 			});
	// 		}
	// 	}
	// }
});
Template.userView.helpers({
	namesEmpty: function () {
		return !this.firstname || !this.lastname;
	},
	students: function () {
		return giveArrayFromCollection(Students, this.student_ids);
	},
	payments: function () {
		return giveArrayFromCollection(Payments, this.payment_ids, true);
	},
	balance: function () {
		var iterator = function (memo, num) { return memo + num; };
		var studentAmount = 0;
		if (this.student_ids) {
			var studentArr = Students.find({_id: {$in: this.student_ids}}).map(function (doc) {

				var lessonAmount = 0;
				if (doc.lesson_ids) {
					var lessonArr = Lessons.find({_id: {$in: doc.lesson_ids}}).map(function (doc) { return doc.price; });
					var lessonAmount = _.reduce(lessonArr, iterator, 0);
				}

				var expenseAmount = 0;
				if (doc.expense_ids) {
					var expenseArr = StudentExpenses.find({_id: {$in: doc.expense_ids}}).map(function (doc) { return doc.price; });
					var expenseAmount = _.reduce(expenseArr, iterator, 0);
				}

				return lessonAmount + expenseAmount;
			});
			var studentAmount = _.reduce(studentArr, iterator, 0);
		}

		var paymentAmount = 0;
		if (this.payment_ids) {
			var paymentArr = Payments.find({_id: {$in: this.payment_ids}}).map(function (doc) { return doc.amount; });
			var paymentAmount = _.reduce(paymentArr, iterator, 0);
		}

		return (studentAmount - paymentAmount).toFixed(2);
	}
});
Template.phone.events({
	'click button': function (e, t) {
		Meteor.users.update(Meteor.userId(), {$pull: {'phones': t.data}});
	}
});
Template.email.helpers({
	emailEditingTag: function () {
		return 'editing' + this.address;
	}
});
Template.email.events({
	'click .verifyEmail': function (e, t) {
		Meteor.call('verifyUserAddress', t.data.address, function (error, result) {
			if (error) {
				console.log(error);
			}
			else {
				alert("Great! You've been sent an email to verify this address.");
			}
		});
	},
	'click .editEmail': function (e, t) {
		Session.set('editing' + t.data.address, true);
	},
	'keypress #editEmailInput': function (e, t) {
		if (e.which == 13) {
			Meteor.call('userEditEmail', t.data.address, t.find('#editEmailInput').value, function (error, result) {
				if (error) {
					Session.set('editEmailError', error);
				}
				else {
					resetSessionVars(['editing' + t.data.address, 'editEmailError']);
				}
			});
		}
	},
	'click .removeEmail': function (e, t) {
		if (Meteor.user().emails.length >= 2) {
			resetSessionVars(['removeEmailQuantityInvalid']);

			var numVerified = _.countBy(Meteor.user().emails, function (email) {
				return email.verified ? 'verified' : 'not';
			}).verified;

			if (!t.data.verified || numVerified >= 2) {
				Meteor.users.update(Meteor.userId(), {$pull: {'emails': t.data}});	
				resetSessionVars(['removeEmailVerificationInvalid']);
			}
			else Session.set('removeEmailVerificationInvalid', true);
		}
		else Session.set('removeEmailQuantityInvalid', true);
	}
});


// Student stuff.
Template.student.events({
	'keypress #studentEditFirstname, keypress #studentEditLastname': function (e, t) {
		if (e.which == 13) {
			if (pushEdits(Students, t, [
				['#studentEditFirstname', 'firstname', existenceTest],
				['#studentEditLastname', 'lastname', existenceTest]
			])) {
				Session.set(tagMaker(t.data, 'editing'), undefined);
				Session.set(tagMaker(t.data, 'invalid'), false);
			}
			else {
				Session.set(tagMaker(t.data, 'invalid'), true);
			}
		}
	},
	'click button#editStudentNames': function (e, t) {
		Session.set(tagMaker(t.data, 'editing'), true);
	}
});
Template.student.helpers({
	lessons: function () {
		return giveArrayFromCollection(Lessons, this.lesson_ids, true);
	},
	expenses: function () {
		return giveArrayFromCollection(StudentExpenses, this.expense_ids, true);
	},
	studentEditingTag: function () {
		return tagMaker(this, 'editing');
	},
	studentInputsInvalidTag: function () {
		return tagMaker(this, 'invalid');
	}
});