// Publication for an individual user.
Meteor.publish('currentUser', function () {
	var studentMappings = [{
		key: 'lesson_ids',
		collection: Lessons,
	},{
		key: 'expense_ids',
		collection: StudentExpenses,
	}];

	return Meteor.publishWithRelations({
		handle: this,
		collection: Meteor.users,
		filter: this.userId,
		options: { fields: 
			{ firstname: true, lastname: true, student_ids: true, payment_ids: true, phones: true, braintree_id: true, roles: true }
		},
		mappings: [{
			key: 'student_ids',
			collection: Students,
			mappings: studentMappings
		},{
			key: 'payment_ids',
			collection: Payments,
		}]
	});
});

Meteor.publish('adminAll', function () {
	return [
		Meteor.users.find({}, { fields: { firstname: true, lastname: true }}),
		Students.find({}, { fields: { firstname: true, lastname: true, price: true }})
	];
});

Meteor.publish('adminSpecific', function (id, category) {
	var studentMappings = [{
		key: 'lesson_ids',
		collection: Lessons,
	},{
		key: 'expense_ids',
		collection: StudentExpenses,
	}];

	var options = {
		handle: this,
		filter: id		
	};

	switch (category) {
		case 'users':
			options.collection = Meteor.users;
			options.options = { fields: {firstname: true, lastname: true, student_ids: true, payment_ids: true, phones: true, emails: true }};
			options.mappings = [{
				key: 'student_ids',
				collection: Students,
				mappings: studentMappings
			},{
				key: 'payment_ids',
				collection: Payments,
			}];
			break;
		case 'students':
			options.collection = Students;
			options.options = { fields: {firstname: true, lastname: true, price: true, lesson_ids: true, expense_ids: true, reflectsUser: true }};
			options.mappings = studentMappings;
			break;
		case 'expenses':
			options.collection = Expenses;
			options.options = { fields: {date: true, price: true, comments: true}};
			break;
	}

	return Meteor.publishWithRelations(options);
});

Meteor.publish('userVouchers', function () {
	return Meteor.publishWithRelations({
		handle: this,
		collection: VoucherClaims,
		filter: { user_id: this.userId },
		fields: { _id: true, user_id: true, scheduled: true, date: true, method: true, time: true, comments: true },
		mappings: [{
			reverse: true,
			key: 'claim_id',
			collection: Vouchers,
			fields: { _id: true, scheduledDate: true, scheduledTime: true, redeemed: true }
		}]
	});
});
Meteor.publish('adminVouchers', function () {
	return Meteor.publishWithRelations({
		handle: this,
		collection: VoucherClaims,
		mappings: [{
			reverse: true,
			key: 'claim_id',
			collection: Vouchers
		}]
	});
});