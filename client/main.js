// TODO break up javascript by helpers, as well as for areas that go with a particular template file.
// TODO make the conversion to autoforms!!!
// TODO make state templates.

if (window.location.href.indexOf("blainehansenpianostudio") > -1) {
	window.location = "http://blainehansenpiano.com" + window.location.pathname;
}

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

// UI.registerHelper('link', function (routeName, text) {
// 	var currentRoute = Router.current();
// 	if (!currentRoute) return '';

// 	// do other stuff with currentRoute here.
// });

// Deps.autorun(function () {
// 	console.log(Router.current());
// });


// Utility Functions
var resetSessionVars = function (variables) {
	variables.forEach(function (item){
		Session.set(item, undefined);
	});
};
var tagMaker = function (context, tag) {
	return tag + context._id;
};
var pushEdits = function (collection, template, attributes, optionalData, optionalId, optionalFormatter) {
	var formatter = optionalFormatter || function (obj) {
		return {$set: obj};
	};
	var dataObj = optionalData || template.data;
	var obj = {};
	var input, attribute, callback, data;
	var inputsValid = attributes.every(function (item) {
		input = template.find(item[0]).value.trim();
		attribute = item[1];
		callback = item[2];

		if (!callback(input)) return false;

		data = dataObj[attribute];

		if (input != data) obj[attribute] = input;
		return true;
	});

	if (inputsValid) {
		var id = optionalId || dataObj._id;
		var fullObj = formatter(obj);
		if (!_.isEmpty(obj)) collection.update(id, fullObj);
	}

	return inputsValid;
};
var noopTest = function (input) {
	return true;
};
var existenceTest = function (input) {
	return !!input;
};
var validPriceTest = function (input) {
	input = input.replace(/\$/,'');
	return input && !isNaN(parseFloat(input)) && parseFloat(input) >= 0;
};
var validDateTest = function (input) {
	return /\d{2}\/\d{2}\/\d{4}\s*/.test(input);
};
var validEmailTest = function (input) {
	return /\S+@\S+\.\S+/.test(input);
};
var validPhoneTest = function (input) {
	return /\d{3}[\/\s.-]?\d{3}[\/\s.-]?\d{4}/.test(input);
};
var priceOptionsArray = [
	{price: 15, description: 'Minor Lesson ($15.00)'},
	{price: 22.50, description: 'Major Lesson ($22.50)'},
	{price: 30, description: 'Augmented Lesson ($30.00)'}
];
var adminPriceOptionsArray = priceOptionsArray.concat([
	{price: 7.5, description: 'Half Price Minor Lesson ($7.50)'},
	{price: 11.25, description: 'Half Price Major Lesson ($11.25)'},
	{price: 15, description: 'Half Price Augmented Lesson ($15.00)'},
	{price: 0, description: 'Free Lesson ($0.00)'}
]);
var returnPriceOptions = function (array, data) {
	var result = [];
	array.forEach(function (doc) {
		if (doc.price == data.price)
			result.push(_.extend({selected: 'selected'}, doc));
		else
			result.push(doc);
	});
	return result;
};
var chooseCollection = function (name) {
	switch (name) {
		case 'users':
			return Meteor.users;
		case 'students':
			return Students;
	}
};
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
var giveArrayFromCollection = function (collection, ids, sortByDate) {
	if (ids) {
		if (sortByDate) return collection.find({_id: {$in: ids}}, {sort: [['date', 'desc']]});
		else return collection.find({_id: {$in: ids}});
	}
	else return false;
};

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
Template.home.news = function () {
	return Stories.find({news: true}, {sort: [['date', 'desc']]});
};
Template.home.contentTemplate = function() {
	return Template[this.contentTemplate];
};
Template.teachingPost.contentTemplate = function() {
	return Template[this.contentTemplate];
};
Template.projectsPost.contentTemplate = function() {
	return Template[this.contentTemplate];
};
Template.projectsPost.projects = function () {
	return Stories.find({category: 'projects'});
};
Template.blogPost.contentTemplate = function() {
	return Template[this.contentTemplate];
};
Template.blogTree.blogs = function () {
	return Stories.find({category: 'blog'}, {sort: [['_id', 'asc']]});
};
Template.projectsTiles.tileColumns = function() {
	var arrays = [[], []];
	var a = this.fetch();
	while (a.length > 0) {
		arrays[0].push(a.splice(0, 1)[0]);
		arrays[1].push(a.splice(0, 1)[0]);
	}
	return arrays;
};
Template.teachingSideNav.pages = function () {
	return Stories.find({category: 'teaching'}, {sort: ['_id', 'asc']});
};
Template.repertoireHome.levels = function () {
	// levels is an array
	// of level objects, which have a level, and composers, an array
	// of composer objects, which have a composer, name, and pieces, an array.
	var levels = [];
	var composers = [];
	var pieces;
	var level, levelObj;
	var composer, composerRecord, composerObj;
	for (level = 0; level <= 10; level++) {
		pieces = _.groupBy(Pieces.find({level: level}).fetch(), 'composer');

		for (composer in pieces) {
			composerRecord = Composers.findOne(composer);
			composerObj = {composer: composer, name: composerRecord.name, pieces: pieces[composer]};
			composers.push(composerObj);
		}

		levelObj = {level: level, composers: composers};
		composers = [];
		levels.push(levelObj);
	}

	return levels;
};


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
Template.backgroundPictures.slides = function () {
	return Stories.find({featured: true});
};


var perfectScrollbarOptions = {
	wheelSpeed: 5,
	suppressScrollX: true
};
var scrollerInitialize = function () {
	var is_xs = window.innerWidth < 768;

	if (!is_xs) {
		$(".scroller").perfectScrollbar(perfectScrollbarOptions);
		$(".scroller").resize(function () {
			$(this).perfectScrollbar('update');
		});
	}
};
Template.home.rendered = function() {
	scrollerInitialize();
};
Template.teachingPost.rendered = function() {
	scrollerInitialize();
};
Template.projects.rendered = function() {
	scrollerInitialize();
};
Template.projectsPost.rendered = function() {
	scrollerInitialize();
};
Template.blogPost.rendered = function() {
	scrollerInitialize();
};
Template.generalLayout.rendered = function() {
	scrollerInitialize();
};
Template.social.rendered = function () {
	scrollerInitialize();
};



/// Login stuff.
Template.login.rendered = function () {
	resetSessionVars(['signinError', 'signupError', 'signinInputsValid', 'signupInputsValid']);
};
Template.login.events({
	'submit form#signin': function (e, t) {
		e.preventDefault();

		var email = t.find('#signinEmail').value;
		var password = t.find('#signinPassword').value;
		Meteor.loginWithPassword({email: email}, password, function (error) {
			if (error) {
				if (error.reason == "User not found") {
					Meteor.loginWithPassword({username: email}, password, function (error) {
						if (error) Session.set('signinError', error.reason);
						else {
							resetSessionVars(['signinError', 'signupError', 'signinInputsValid', 'signupInputsValid']);
							Router.go('userView');	
						}
					});
				}
				else {
					Session.set('signinError', error.reason);
				}
			}
			else {
				resetSessionVars(['signinError', 'signupError', 'signinInputsValid', 'signupInputsValid']);
				Router.go('userView');
			}
		});
	},
	'submit form#signup': function (e, t) {
		e.preventDefault();

		Accounts.createUser({
			email: t.find('#signupEmail').value,
			password: t.find('#signupPassword').value},
			function (error) {
				if (error) {
					console.log(error);
					Session.set('signupError', error.reason);
				}
				else {
					resetSessionVars(['signinError', 'signupError', 'signinInputsValid', 'signupInputsValid']);
					Router.go('userView');
				}
			}
		);
	},
	'keyup form#signin': function (e, t) {
		var valid = (t.find('#signinEmail').value && t.find('#signinPassword').value);
		Session.set('signinInputsValid', valid);
	},
	'keyup form#signup': function (e, t) {
		var valid = (t.find('#signupEmail').value && t.find('#signupPassword').value);
		Session.set('signupInputsValid', valid);
	},
	'click #resetPassword': function (e, t) {
		if (t.find('#signinEmail').value) {
			Router.go('reset');
			Meteor.call('resetUserPassword', t.find('#signinEmail').value, function (error) {
				if (error) {
					Session.set('resetPasswordError', error.reason);
					Router.go('login');
				}
			});
		}
		else {
			alert("You need to type in your email again.");
		}
	}
});
Template.loginAction.helpers({
	signinInputsValid: function () {
		return Session.get('signinInputsValid') ? '' : 'disabled';
	},
	signupInputsValid: function () {
		return Session.get('signupInputsValid') ? '' : 'disabled';
	},
	signinError: function () {
		return Session.get('signinError');
	}
});

Deps.autorun(function () {
	if (!Meteor.user() && Router.current() && (Router.current().route.name == 'userView')) {
		Router.go('login');
	}
	else if (Meteor.user() && Router.current() && (Router.current().route.name == 'login')) {
		Router.go('userView');
	}
});


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
Template.email.emailEditingTag = function () {
	return 'editing' + this.address;
};
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


/// Payment stuff.
Template.paymentModal.rendered = function() {
	Session.set('paymentModalState', this.data.braintree_id ? 'cardlist' : 'nocards');
	resetSessionVars(['paymentFormError', 'paymentFormAmountValidate', 'paymentFormNumberValidate', 'paymentFormCVVValidate', 'paymentFormExpValidate']);
};
Template.paymentModal.events({
	'click #switchEnterCard': function (e, t) {
		t.data.balance = t.find('form#paymentModalForm #amount').value;
		Session.set('paymentModalState', 'newcard');
		resetSessionVars(['paymentFormNumberValidate', 'paymentFormCVVValidate', 'paymentFormExpValidate']);
	},
	'click #switchUseCard': function (e, t) {
		t.data.balance = t.find('form#paymentModalForm #amount').value;
		Session.set('paymentModalState', 'cardlist');
		resetSessionVars(['paymentFormNumberValidate', 'paymentFormCVVValidate', 'paymentFormExpValidate']);
	},
	'click #resetPayment': function (e, t) {
		Session.set('paymentModalState', t.data.braintree_id ? 'cardlist' : 'nocards');
		resetSessionVars(['paymentFormError','paymentFormAmountValidate', 'paymentFormNumberValidate', 'paymentFormCVVValidate', 'paymentFormExpValidate']);
	},
	'submit form#paymentModalForm': function (e, t) {
		e.preventDefault();
		
		var saleObj = {
			amount: parseFloat(t.find('form#paymentModalForm #amount').value),
			options: {
				submitForSettlement: true
			}
		};

		switch (Session.get('paymentModalState')) {
			case 'newcard':
				saleObj.customerId = t.data.braintree_id;
				saleObj.options.failOnDuplicatePaymentMethod = true;
				saleObj.options.makeDefault = t.find('#makeDefault').checked;
				// Fall through!!!
			case 'nocards':
				saleObj.creditCard = {
					cvv: t.find('#cvv').value,
					number: t.find('#number').value,
					expirationMonth: t.find('#expirationMonth').value,
					expirationYear: t.find('#expirationYear').value	
				};
				saleObj.options.storeInVaultOnSuccess = t.find('#storeInVaultOnSuccess').checked;
				break;
			case 'cardlist':
				saleObj.paymentMethodToken = t.find('input:radio.cardChoice:checked').value;
				break;
		}

		Meteor.call('makeBraintreePayment', saleObj, function (error, result) {
			if (error) {
				Session.set('paymentFormError', error.reason);
			}
			else {
				Session.set('paymentModalState', 'successful');
				Meteor.subscribe('currentUser');
			}
		});
	},
	'keyup #amount': function (e, t) {
		var value = parseFloat(t.find('#amount').value.trim());
		if (!value) Session.set('paymentFormAmountValidate', undefined);
		else if (isNaN(value) || value < 0) Session.set('paymentFormAmountValidate', 'has-error');
		else Session.set('paymentFormAmountValidate', 'has-success');
	},
	'keyup #number': function (e, t) {
		var value = t.find('#number').value.trim();
		if (!value) Session.set('paymentFormNumberValidate', undefined);
		else if (/^\d+$/.test(value)) Session.set('paymentFormNumberValidate', 'has-success');
		else Session.set('paymentFormNumberValidate', 'has-error');
	},
	'keyup #cvv': function (e, t) {
		var value = t.find('#cvv').value.trim();
		if (!value) Session.set('paymentFormCVVValidate', undefined);
		else if (/^\d+$/.test(value)) Session.set('paymentFormCVVValidate', 'has-success');
		else Session.set('paymentFormCVVValidate', 'has-error');
	},
	'change #expirationMonth, change #expirationYear': function (e, t) {
		var monthValue = t.find('#expirationMonth').value.trim();
		var yearValue = t.find('#expirationYear').value.trim();
		if (!monthValue || !yearValue) Session.set('paymentFormExpValidate', undefined);
		else Session.set('paymentFormExpValidate', 'has-success');
	},
	'click #storeInVaultOnSuccess': function (e, t) {
		if (t.find('#storeInVaultOnSuccess').checked) t.find('#makeDefault').disabled = false;
		else {
			t.find('#makeDefault').disabled = true;
			t.find('#makeDefault').checked = false;
		}
	}
});
Template.paymentModal.formBody = function() {
	switch (Session.get('paymentModalState')) {
		case 'nocards': return Template.paymentModalNoCards;
		case 'newcard': return Template.paymentModalNewCard;
		case 'cardlist': return Template.paymentModalCardList;
		case 'successful': return Template.paymentModalSuccess;
		default: return Template.paymentModalNewCard;
	}
	return Template[Session.get('paymentModalState')];
}
Template.paymentModalCardList.helpers({
	creditCards: function () {
		if (Session.get('paymentModalCreditCards')) return Session.get('paymentModalCreditCards');
		else {
			Meteor.call('getBraintreeCreditCards', this.braintree_id, function (error, result) {
				if (error) console.log(error);
				else {
					Session.set('paymentModalCreditCards', result);
				}
			});
			return undefined;
		}
	},
	defaultChecked: function (defaultArg) {
		return defaultArg ? 'checked' : '';
	}
});
Template.paymentFormButton.paymentFormInputsValid = function () {
	switch (Session.get('paymentModalState')) {
		case 'nocards':
		case 'newcard':
			var valid = Session.get('paymentFormAmountValidate') == 'has-success';
			valid = valid && (Session.get('paymentFormNumberValidate') == 'has-success');
			valid = valid && (Session.get('paymentFormCVVValidate') == 'has-success');
			valid = valid && (Session.get('paymentFormExpValidate') == 'has-success');
			return valid ? '': 'disabled';
		case 'cardlist': 
			return Session.get('paymentFormAmountValidate') == 'has-success' ? '' : 'disabled';
	}
};



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
		resetSessionVars(['query', 'entryInputsInvalid', 'entryInputsNumberInvalid', 'priceSelectContext', 'queryPopulated']);
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
			resetSessionVars(['query', 'entryInputsInvalid', 'entryInputsNumberInvalid', 'priceSelectContext', 'queryPopulated']);
			Entries.insert(obj);
		}
	},
	'click .result': function (e, t) {
		e.preventDefault();
		var id = $(e.target).attr('data-id');
		var price = $(e.target).attr('data-price');
		if (price !== undefined) {
			Session.set('priceSelectContext', returnPriceOptions(priceOptionsArray, { price: price }));
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
		resetSessionVars(['priceSelectContext', 'queryPopulated']);
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
		resetSessionVars(['query', 'entryInputsInvalid', 'entryInputsNumberInvalid', 'priceSelectContext', 'queryPopulated']);
	}
});
Template.entryStudentInput.priceOptions = priceOptionsArray;
Template.entryLessonInput.priceSelectContext = function () {
	return Session.get('priceSelectContext');
};
Template.admin.entries = function () {
	var curs = Entries.find();
	if (curs.count() > 0) return curs;
	else return false;
};
Template.admin.currentType = function () {
	return Session.get('entryType');
};
Template.admin.entry = function() {
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
};

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

Template.entryStudentInput.queryResults = function () { return collectionQuery('users', Session.get('query')); }; 
Template.entryPaymentInput.queryResults = function () { return collectionQuery('users', Session.get('query')); };
Template.entryStudentExpenseInput.queryResults = function () { return collectionQuery('students', Session.get('query')); };
Template.entryLessonInput.queryResults = function () { return collectionQuery('students', Session.get('query')); };

Template.entryStudentInput.queryPopulatedReadonly = function () {
	return Session.get('queryPopulated') ? 'readonly': '';
};
Template.entryPaymentInput.queryPopulatedReadonly = function () {
	return Session.get('queryPopulated') ? 'readonly': '';
};
Template.entryStudentExpenseInput.queryPopulatedReadonly = function () {
	return Session.get('queryPopulated') ? 'readonly': '';
};
Template.entryLessonInput.queryPopulatedReadonly = function () {
	return Session.get('queryPopulated') ? 'readonly': '';
};

Template.entryStudentInput.queryPopulatedDisabled = function () {
	return Session.get('queryPopulated') ? '': 'disabled';
};
Template.entryPaymentInput.queryPopulatedDisabled = function () {
	return Session.get('queryPopulated') ? '': 'disabled';
};
Template.entryStudentExpenseInput.queryPopulatedDisabled = function () {
	return Session.get('queryPopulated') ? '': 'disabled';
};
Template.entryLessonInput.queryPopulatedDisabled = function () {
	return Session.get('queryPopulated') ? '': 'disabled';
};

Template.entryStudentInput.queryShow = function () {
	return (Session.get('query') && !Session.get('queryPopulated')) ? '' : 'hidden';
};
Template.entryPaymentInput.queryShow = function () {
	return (Session.get('query') && !Session.get('queryPopulated')) ? '' : 'hidden';
};
Template.entryStudentExpenseInput.queryShow = function () {
	return (Session.get('query') && !Session.get('queryPopulated')) ? '' : 'hidden';
};
Template.entryLessonInput.queryShow = function () {
	return (Session.get('query') && !Session.get('queryPopulated')) ? '' : 'hidden';
};


var datepickerOptions = {
	todayBtn: "linked",
	autoclose: true,
	todayHighlight: true
};
Template.entryDatePicker.rendered = function () {
	$('.datepicker').datepicker(datepickerOptions);
};


/// Admin Search
Template.adminSearch.rendered = function () {
	Session.set('adminSearchCategory', 'users');
	resetSessionVars(['adminSearchQueryPopulated', 'adminSearchResult', 'adminSearchQuery']);
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
		resetSessionVars(['adminSearchQueryPopulated', 'adminSearchResult', 'adminSearchQuery']);
	}
});
Template.adminSearch.adminSearchUserShow = function () {
	return Session.get('adminSearchCategory') == 'users' && Session.get('adminSearchResult');
};
Template.adminSearch.adminSearchStudentShow = function () {
	return Session.get('adminSearchCategory') == 'students' && Session.get('adminSearchResult');
};
Template.adminSearch.adminSearchExpenseShow = function () {
	return Session.get('adminSearchCategory') == 'expenses' && Session.get('adminSearchResult');
};
Template.adminSearch.adminSearchQueryShow = function () {
	return (Session.get('adminSearchQuery') && !Session.get('adminSearchQueryPopulated')) ? '' : 'hidden';
};
Template.adminSearch.adminSearchQueryResults = function () {
	if (Session.get('adminSearchCategory'))
		return collectionQuery(Session.get('adminSearchCategory'), Session.get('adminSearchQuery'));
};
Template.adminSearch.adminSearchResult = function () {
	if (Session.get('adminSearchCategory'))
		return chooseCollection(Session.get('adminSearchCategory')).findOne(Session.get('adminSearchResult'));
};
Template.adminSearch.adminSearchQueryPopulatedReadonly = function () {
	return Session.get('adminSearchQueryPopulated') ? 'readonly' : '';
};
Template.adminSearch.adminSearchQueryPopulatedDisabled = function () {
	return Session.get('adminSearchQueryPopulated') ? '' : 'disabled';
};

// Admin Edit Stuff
Template.adminEditUser.editingTag = function () {
	return tagMaker(this, 'adminEditUser');
};
Template.adminEditUser.students = function () {
	return giveArrayFromCollection(Students, this.student_ids);
};
Template.adminEditUser.payments = function () {
	return giveArrayFromCollection(Payments, this.payment_ids, true);
};
Template.adminEditStudent.editingTag = function () {
	return tagMaker(this, 'adminEditStudent');
};
Template.adminEditStudent.lessons = function () {
	return giveArrayFromCollection(Lessons, this.lesson_ids, true);
};
Template.adminEditStudent.expenses = function () {
	return giveArrayFromCollection(StudentExpenses, this.expense_ids, true);
};
Template.adminEditPayment.editingTag = function () {
	return tagMaker(this.payment, 'adminEditPayment');
};
Template.adminEditLesson.editingTag = function () {
	return tagMaker(this.lesson, 'adminEditLesson');
};
Template.adminEditStudentExpense.editingTag = function () {
	return tagMaker(this.expense, 'adminEditStudentExpense');
};

Template.adminEditPaymentDatepicker.rendered = function () {
	$('.datepicker').datepicker(datepickerOptions);
};
Template.adminEditLessonDatepicker.rendered = function () {
	$('.datepicker').datepicker(datepickerOptions);
};
Template.adminEditStudentExpenseDatepicker.rendered = function () {
	$('.datepicker').datepicker(datepickerOptions);
};

Template.adminEditStudent.priceSelectContext = function () {
	return returnPriceOptions(priceOptionsArray, this);
};
Template.adminEditLesson.priceSelectContext = function () {
	return returnPriceOptions(adminPriceOptionsArray, this);
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

Template.vouchers.created = function () {
	VoucherEntries = new Meteor.Collection(null);
	Belt.addCollection('voucherentries', VoucherEntries);
};
Template.vouchers.rendered = function () {
	$('.voucherDatepicker').datepicker(_.extend(datepickerOptions, {
		startDate: moment().format('MM/DD/YYYY')
	}));
	Meteor.subscribe('userVouchers', Meteor.userId());
};
Template.vouchers.helpers({
	claim: function () {
		var claim = VoucherClaims.findOne({user_id: Meteor.userId()});
		if (claim) claim.vouchers = Vouchers.find({claim_id: claim._id});
		return claim;
	},
	voucherEntries: function () {
		return VoucherEntries.find();
	}
});
Template.vouchers.events({
	'click #voucherFormSubmit': function (e, t) {
		Belt.session.erase(['voucherNumberError', 'voucherContactMethodError', 'voucherContactTimeError']);

		var claim_id = Belt.base.insert('voucherclaims', t, [
			// Add an "or" wrap function for Belt.format that would allow multiple cases for success.
			['#voucherContactMethod', 'method', Belt.format.existence, 'voucherContactMethodError'],
			['#voucherContactTime', 'time', Belt.format.existence, 'voucherContactTimeError'],
			['#voucherComments', 'comments']],
			{date: moment().format('MM/DD/YYYY'), user_id: Meteor.userId()});

		VoucherEntries.find().forEach(function (voucherEntry) {
			Vouchers.update(voucherEntry._id, {$set: { claim_id: claim_id }});
		});
	},
	'click #voucherNumberInputAdd': function (e, t) {
		Belt.session.erase(['voucherNumberError', 'voucherContactMethodError', 'voucherContactTimeError']);

		Belt.base.method('checkVoucher', t, [
			['#voucherNumberInput', '_id', Belt.format.existence, 'voucherNumberError']], 'voucherNumberError',
			function (error, result) {
				if (!error) {
					VoucherEntries.insert({_id: result});
				}
			});
	}
});

Template.adminVouchers.helpers({
	unscheduledClaims: function () {
		var cursor = VoucherClaims.find({scheduled: undefined}, {sort: [['queue', 'asc']]});
		cursor.forEach(function (doc) {
			doc.vouchers = Vouchers.find({claim_id: doc._id});
		});
		return cursor;
	},
	scheduledClaims: function () {
		var cursor = VoucherClaims.find({scheduled: true});
		cursor.forEach(function (doc) {
			doc.vouchers = Vouchers.find({claim_id: doc._id});
		});
		return cursor;
	}
});
// Template.adminVouchers.events({
// 	'click #submitScheduleForm': function (e, t) {

// 	},
// 	'click #redeemVoucher': function (e, t) {

// 	}
// });
// Template.unscheduledClaim.events({
// 	'click #voucherBeginSchedule': function (e, t) {

// 	}
// });

Template.editable.created = function () {
	this._editing = new ReactiveVar(false, function (oldvar, newvar) {
		return oldvar == newvar;
	});
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