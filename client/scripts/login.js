/// Login stuff.
LoginSchema = new SimpleSchema({
	email: {
		type: String,
		label: "Email or Username",
		min: 3
	},
	password: {
		type: String,
		label: "Password",
		min: 6
	},
	feedback: {
		type: String,
		optional: true
	}
});

AutoForm.addHooks('signin', {
	onSubmit: function (insertDoc) {
		var hook = this;
		var email = insertDoc.email;
		var password = insertDoc.password;
		Meteor.loginWithPassword({email: email}, password, function (error) {
			if (error) {
				if (error.reason == "User not found") {
					Meteor.loginWithPassword({username: email}, password, function (error) {
						if (error) hook.done(error);
						else hook.done();
					});
				}
				else hook.done(error);
			}
			else hook.done();
		});
		return false;
	},
	onError: function (operation, error) {
		if (error.reason)
			LoginSchema.namedContext('signin').addInvalidKeys([{name: 'feedback', type: 'feedback', value: error.reason}]);
		return true;
	},
	onSuccess: function () {
		Router.go('user');
	}
});

Template.login.events({
	'click #resetPassword': function (e, t) {
		var email = AutoForm.getFieldValue('signin', 'email');
		console.log(email);
		if (email) {
			Router.go('reset');
			Meteor.call('resetUserPassword', email, function (error) {
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

Deps.autorun(function () {
	if (!Meteor.user() && Router.current() && (Router.current().route.name == 'user')) {
		Router.go('login');
	}
	else if (Meteor.user() && Router.current() && (Router.current().route.name == 'login')) {
		Router.go('user');
	}
});