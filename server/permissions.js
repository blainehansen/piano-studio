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

Meteor.users.permit('remove').never().apply();
Meteor.users.permit(['insert', 'update']).admin().apply();
Meteor.users.permit('update').admin().exceptProps(['username', 'emails', 'createdAt', 'services', 'braintree_id']).apply();
Meteor.users.permit('update').ownsDocument().onlyProps(['firstname', 'lastname']).apply();
Meteor.users.permit('update').ownsDocument().onlyProps(['emails', 'phones']).modifyArray().apply();

Students.permit('remove').never().apply();
Students.permit(['insert', 'update']).admin().apply();
Students.permit('update').ownsDocument().docHas('reflectsUser').onlyProps(['firstname', 'lastname']).apply();

Lessons.permit(['insert', 'update', 'remove']).admin().apply();

Payments.permit(['insert', 'update', 'remove']).admin().docWithout('braintree_id').apply();

StudentExpenses.permit(['insert', 'update', 'remove']).admin().apply();

Vouchers.permit(['insert', 'remove']).never().apply();
Vouchers.permit('update').admin().apply();
Vouchers.permit('update').ifLoggedIn().docWithout('claim_id').onlyProps('claim_id').apply();

VoucherClaims.permit('remove').never().apply();
VoucherClaims.permit(['insert', 'update']).admin().apply();
VoucherClaims.permit('insert').ownsDocument().apply();
VoucherClaims.permit('update').ownsDocument().onlyProps(['method', 'time', 'comments']).apply();