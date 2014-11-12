Security.defineMethod('ownsDocument', {
	deny: function (type, arg, userId, doc, fieldNames, modifier) {
		arg = arg || '_id';
		return userId !== doc[arg];
	}
});

Security.defineMethod('ifHasGroupRole', {
	deny: function (type, arg, userId) {
		return !Roles.userIsInRole(userId, arg.role, arg.group);
	}
});

Security.defineMethod('admin', {
	deny: function (type, arg, userId) {
		return !Roles.userIsInRole(userId, 'admin');
	}
});

Meteor.users.permit('remove').never().apply();
Meteor.users.permit('insert').admin().apply();
Meteor.users.permit('update').admin().apply();
Meteor.users.permit('update').ifLoggedIn().ownsDocument() .apply();

Meteor.users.allow({
	update: function (userId, doc, fields, modifier) {
		// Only people that are logged in.
		if (!userId) return false;

		// Admins can do whatever they want. Maybe throw in a few sanity checks here.
		if (Meteor.user().admin) return true;

		// Users can only modify their own user document.
		if (doc._id === userId) {
			// Furthermore, they can only change their first and last name...
			if (!_.isEmpty(_.omit(modifier.$set, 'firstname', 'lastname'))) return false;

			// push to student and payment id's, phones, and emails...
			if (!_.isEmpty(_.omit(modifier.$push, 'student_ids', 'payment_ids', 'phones', 'emails'))) return false;

			// and pull from phones and emails.
			if (!_.isEmpty(_.omit(modifier.$pull, 'phones', 'emails'))) return false;

			if (modifier.$set && (_.contains(fields, 'firstname') || _.contains(fields, 'lastname'))) {
				var user = Meteor.users.findOne(doc._id);
				var obj = {};
				if (modifier.$set.firstname) obj.firstname = modifier.$set.firstname;
				if (modifier.$set.lastname) obj.lastname = modifier.$set.lastname;
				if (obj) {
					var student_ids = user.student_ids || [];
					Students.update({_id: {$in: student_ids}, reflectsUser: true}, {$set: obj});
				}
			}

			return true;
		}
		else return false;
	}
});

Students.allow({
	update: function (userId, doc, fields, modifier) {
		// Only people that are logged in.
		if (!userId) return false;

		// Admins can do whatever they want. Maybe throw in a few sanity checks here.
		if (Meteor.user().admin) return true;

		if (!doc.reflectsUser && _.without(fields, 'firstname', 'lastname').length == 0) {
			if (!_.contains(Meteor.user().student_ids, doc._id)) return false;

			if (!_.isEmpty(_.omit(modifier, '$set'))) return false;

			return true;
		}
		else return false;
	}
});

Lessons.allow({
	update: function (userId, doc, fields, modifier) {
		return userId && Meteor.user().admin;
	},
	remove: function (userId, doc) {
		return userId && Meteor.user().admin;
	}
});

Payments.allow({
	update: function (userId, doc, fields, modifier) {
		return userId && Meteor.user().admin;
	},
	remove: function (userId, doc) {
		return userId && Meteor.user().admin && !doc.braintree_id;
	}
});

StudentExpenses.allow({
	update: function (userId, doc, fields, modifier) {
		return userId && Meteor.user().admin;
	},
	remove: function (userId, doc) {
		return userId && Meteor.user().admin;
	}
});

Vouchers.allow({
	update: function (userId, doc, fields, modifier) {
		if (userId && Meteor.user().admin) return true;

		if (!userId) return false;

		if (doc.claim_id) return false;

		if (!_.isEmpty(_.omit(modifier, '$set'))) return false;

		if (_.without(fields, 'claim_id').length != 0) return false;

		if (!VoucherClaims.findOne(modifier['$set'].claim_id)) return false;

		return true;
	}
});
VoucherClaims.allow({
	insert: function (userId, doc) {
		if (userId && Meteor.user().admin) return true;

		if (!userId) return false;
		if (!_.has(doc, 'user_id')) return false;
		if (!_.has(doc, 'date')) return false;
		if (!_.has(doc, 'method')) return false;
		if (!_.has(doc, 'time')) return false;
		_.pick(doc, 'user_id', 'date', 'method', 'time', 'comments');

		if (userId != doc.user_id) return false;

		if (VoucherClaims.findOne({user_id: doc.user_id})) return false;

		if (doc.date != moment().format('MM/DD/YYYY')) return false;

		doc.queue = VoucherClaims.find().count() + 1;

		return true;
	},
	update: function (userId, doc, fields, modifier) {
		if (userId && Meteor.user().admin) return true;

		if (!userId) return false;

		if (userId != doc.user_id) return false;

		if (_.without(fields, 'method', 'time', 'comments') != 0) return false;

		return true;
	}
});