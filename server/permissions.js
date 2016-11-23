Security.defineMethod('ownsDocument', {
	deny: function (type, arg, userId, doc) {
		arg = arg || 'user_id';
		return !(userId && userId == doc[arg]);
	}
});

Security.defineMethod('ifHasGroupRole', {
	fetch: [],
	deny: function (type, arg, userId) {
		return !Roles.userIsInRole(userId, arg.role, arg.group);
	}
});

Security.defineMethod('admin', {
	fetch: [],
	deny: function (type, arg, userId) {
		return !Roles.userIsInRole(userId, 'admin');
	}
});

Security.defineMethod('onlyOps', {
	fetch: [],
	deny: function (type, arg, userId, doc, fieldNames, modifier) {
		return !_.isEmpty(_.omit(modifier, arg));
	}
});

Security.defineMethod('modifyArray', {
	fetch: [],
	deny: function (type, arg, userId, doc, fieldNames, modifier) {
		return !_.isEmpty(_.omit(modifier, '$push', '$pull'));
	}
});

Security.defineMethod('docHas', {
	deny: function (type, arg, userId, doc) {
		if (!arg.length) arg = [arg];
		return !_.every(arg, function(value) {
			return doc[value];
		});
	}
});

Security.defineMethod('docWithout', {
	deny: function (type, arg, userId, doc) {
		if (!arg.length) arg = [arg];
		return !_.every(arg, function(value) {
			return !doc[value];
		});
	}
});

Meteor.users.permit('remove').never().allowInClientCode();
Meteor.users.permit(['insert', 'update']).admin().allowInClientCode();
Meteor.users.permit('update').admin().exceptProps(['username', 'emails', 'createdAt', 'services', 'braintree_id']).allowInClientCode();
Meteor.users.permit('update').ownsDocument().onlyProps(['firstname', 'lastname']).allowInClientCode();
Meteor.users.permit('update').ownsDocument().onlyProps(['emails', 'phones']).modifyArray().allowInClientCode();

Students.permit('remove').never().allowInClientCode();
Students.permit(['insert', 'update']).admin().allowInClientCode();
Students.permit('update').ownsDocument().docHas('reflectsUser').onlyProps(['firstname', 'lastname']).allowInClientCode();

Lessons.permit(['insert', 'update', 'remove']).admin().allowInClientCode();

Payments.permit(['insert', 'update', 'remove']).admin().docWithout('braintree_id').allowInClientCode();

StudentExpenses.permit(['insert', 'update', 'remove']).admin().allowInClientCode();