SimpleSchema.messages({
	"invalidRelation": "The [label] you tried to insert doesn't line up with a real object: [value]",
	"feedback": "[value]",
	"passwordMismatch": "Your passwords don't match!",
	"phoneProvider": "That type of phone number shouldn't have a provider"
});

Schema = {};
Schema.User = new SimpleSchema({
	firstname: {
		type: String,
		label: "First Name",
		max: 15,
		trim: true,
		optional: true,
		custom: function () {
			var student = Students.findOne({user_id: this.fields('_id').value, reflectsUser: true});
			if (student) Students.update(student, {$set: {firstname: this.value}});
		}
	},
	lastname: {
		type: String,
		label: "Last Name",
		max: 15,
		trim: true,
		optional: true,
		custom: function () {
			var student = Students.findOne({user_id: this.fields('_id').value, reflectsUser: true});
			if (student) Students.update(student, {$set: {lastname: this.value}});
		}
	},
	phones: {
		type: [String],
		label: "Your phone numbers",
		optional: true
	},
	// "phones.$.number": {
	// 	type: String,
	// 	label: "Number",
	// 	regEx: /\d{3}[.-\/\\]\d{3}[.-\/\\]\d{4}/,
	// 	autoValue: function () {
	// 		return this.value.replace(/[.-\/\\]/, '-');
	// 	}
	// },
	// "phones.$.type": {
	// 	type: String,
	// 	label: "Type",
	// 	optional: true,
	// 	allowedValues: ['cell', 'home', 'office']
	// },
	// "phones.$.provider": {
	// 	type: String,
	// 	label: "Cell Provider",
	// 	optional: true,
	// 	allowedValues: ['t-mobile', 'verizon'],
	// 	custom: function () {
	// 		var type = this.fields('phones.$.type');
	// 		if (type.isSet && type.value != 'cell' && this.isSet) return "phoneProvider";
	// 	}
	// },
	braintree_id: {
		type: String,
		optional: true,
		blackbox: true,
		autoform: {
			omit: true
		}
	},
	username: {
		type: String,
		optional: true,
		regEx: /^[a-z0-9A-Z_]{3,15}$/
	},
	emails: {
		type: [Object],
		label: "Your email addresses",
		optional: true
	},
	"emails.$": {
		type: Object
	},
	"emails.$.address": {
		type: String,
		regEx: SimpleSchema.RegEx.Email
	},
	"emails.$.verified": {
		type: Boolean,
		autoform: {
			omit: true
		}
	},
	createdAt: {
		type: Date,
		autoform: {
			omit: true
		}
	},
	profile: {
		type: Object,
		optional: true,
		blackbox: true
	},
	services: {
		type: Object,
		optional: true,
		blackbox: true,
		autoform: {
			omit: true
		}
	},
	roles: {
		type: Object,
		optional: true,
		blackbox: true,
		autoform: {
			omit: true
		}
	}
});
Meteor.users.attachSchema(Schema.User);

Schema.Date = new SimpleSchema({
	date: {
		type: Date,
		label: "Lesson Date"
	}
});
Schema.Price = new SimpleSchema({
	price: {
		type: Number,
		label: "Price",
		min: 0,
		decimal: true
	}
});
Schema.Amount = new SimpleSchema({
	amount: {
		type: Number,
		label: "Amount",
		min: 0,
		decimal: true
	}
});
Schema.Comment = new SimpleSchema({
	comments: {
		type: String,
		label: "Comments",
		optional: true
	}
});

Schema.Student = new SimpleSchema([{
	user_id: {
		type: String,
		label: "id of the User who manages this student",
		custom: function () {
			if (!Meteor.users.findOne(this.value)) return "invalidRelation";
		},
		autoform: {
			omit: true
		}
	},
	firstname: {
		type: String,
		label: "First Name",
		max: 15,
		trim: true
	},
	lastname: {
		type: String,
		label: "Last Name",
		max: 15,
		trim: true
	},
	reflectsUser: {
		type: Boolean,
		optional: true,
		allowedValues: [true],
		autoform: {
			omit: true
		}
	}
}, Schema.Price]);
Students.attachSchema(Schema.Student);


Schema.Lesson = new SimpleSchema([{
	student_id: {
		type: String,
		label: "id of the Student who took this lesson",
		custom: function () {
			if (!Students.findOne(this.value)) return "invalidRelation";
		},
		autoform: {
			omit: true
		}
	}
}, Schema.Date, Schema.Price, Schema.Comment]);
Lessons.attachSchema(Schema.Lesson);

Schema.Payment = new SimpleSchema([{
	user_id: {
		type: String,
		label: "id of the User who made this payment",
		custom: function () {
			if (!Meteor.users.findOne(this.value)) return "invalidRelation";
		},
		autoform: {
			omit: true
		}
	},
	method: {
		type: String,
		label: "Payment Method",
		trim: true
	}
}, Schema.Date, Schema.Amount, Schema.Comment]);
Payments.attachSchema(Schema.Payment);

Schema.Expense = new SimpleSchema([Schema.Date, Schema.Amount, Schema.Comment]);
Expenses.attachSchema(Schema.Expense);

Schema.StudentExpenses = new SimpleSchema([{
	student_id: {
		type: String,
		label: "id of the Student who incurred this expense",
		custom: function () {
			if (!Students.findOne(this.value)) return "invalidRelation";
		},
		autoform: {
			omit: true
		}
	}
}, Schema.Expense])
StudentExpenses.attachSchema(Schema.Expense);

Schema.Voucher = new SimpleSchema({
	claim_id: {
		type: String,
		label: "Voucher Claim Id",
		optional: true,
		custom: function () {
			if (!VoucherClaims.findOne(this.value)) return "invalidRelation";
		},
		autoform: {
			omit: true
		}
	}
});
Vouchers.attachSchema(Schema.Voucher);

Schema.VoucherClaim = new SimpleSchema([{
	user_id: {
		type: String,
		label: 'User who made this claim',
		custom: function () {
			if (!Meteor.users.findOne(this.value)) return "invalidRelation";
		},
		autoform: {
			omit: true
		}
	},
	method: {
		type: String,
		label: 'Preferred Contact Method',
		defaultValue: function () {
			return Meteor.user().email[0].address;
		}
	},
	time: {
		type: String,
		optional: true,
		allowedValues: ['morning9-11', 'midday11-1', 'afternoon1-3', 'lateafternoon3-5', 'evening5-8']
	}
}, Schema.Date, Schema.Comment]);
VoucherClaims.attachSchema(Schema.VoucherClaim);