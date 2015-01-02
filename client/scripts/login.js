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