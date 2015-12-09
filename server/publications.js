Meteor.publishComposite(null, {
	find: function () {
		return Meteor.users.find(
			{_id: this.userId},
			{limit: 1, fields: { firstname: true, lastname: true, phones: true, braintree_id: true, roles: true }});
	},
	children: [{
		find: function (user) {
			return Payments.find({user_id: user._id});
		}
	}, {
		find: function (user) {
			return Students.find({user_id: user._id});
		},
		children: [{
			find: function (student, user) {
				return Lessons.find({student_id: student._id});
			}
		}, {
			find: function (student, user) {
				return StudentExpenses.find({student_id: student._id});
			}
		}]
	}]
});

Meteor.publish('adminAll', function () {
	if (Roles.userIsInRole(this.userId, 'admin')) {
		return [
			Meteor.users.find({}, { fields: { firstname: true, lastname: true }}),
			Students.find({}, { fields: { firstname: true, lastname: true, price: true }})
		];
	}
	else {
		return [];
	}
});

Meteor.publishComposite('adminSpecific', function (id, category) {
	if (Roles.userIsInRole(this.userId, 'admin')) {
		switch (category) {
			case 'users':
				return {
					find: function () {
						return Meteor.users.find(
							{_id: id},
							{limit: 1, fields: { firstname: true, lastname: true, phones: true, braintree_id: true, roles: true }});
					},
					children: [{
						find: function (user) {
							console.log(user)
							return Payments.find({user_id: user._id});
						}
					}, {
						find: function (user) {
							console.log(user)
							return Students.find({user_id: user._id});
						},
						children: [{
							find: function (student, user) {
								return Lessons.find({student_id: student._id});
							}
						}, {
							find: function (student, user) {
								return StudentExpenses.find({student_id: student._id});
							}
						}]
					}]
				}
			case 'students':
				return {
					find: function () {
						return Students.find({_id: id}, {limit: 1});
					},
					children: [{
						find: function (student) {
							return Lessons.find({student_id: student._id});
						},
					}, {
						find: function (student) {
							return StudentExpenses.find({student_id: student._id});
						}
					}]
				};
			case 'expenses':
				return {
					find: function () {
						return Expenses.find({_id: id}, {limit: 1});
					}
				};
		};
	}
	else {
		return [];
	}
});

Meteor.publishComposite('userVouchers', {
	find: function () {
		return VoucherClaims.find(
			{user_id: this.userId}
			// {fields: { _id: true, user_id: true, scheduled: true, date: true, method: true, time: true, comments: true }}
			);
	},
	children: [{
		find: function (claim) {
			return Vouchers.find(
				{claim_id: claim._id},
				{fields: { _id: true, scheduledDate: true, scheduledTime: true, redeemed: true }});
		}
	}]
});

Meteor.publish('adminVouchers', function () {
	if (Roles.userIsInRole(this.userId, 'admin')) {
		return [
			Vouchers.find(),
			VoucherClaims.find()
		]
	}
	else {
		return [];
	}
});