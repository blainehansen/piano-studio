SimpleSchema.messages({
	"invalidRelation": "The [label] you tried to insert doesn't line up with a real object: [value]"
});

DateSchema = new SimpleSchema({
	date: {
		type: Date,
		label: "Lesson Date"
	}
});
PriceSchema = new SimpleSchema({
	price: {
		type: Number,
		label: "Price",
		min: 0,
		decimal: true
	}
});
CommentSchema = new SimpleSchema({
	comments: {
		type: String,
		label: "Comments",
		optional: true
	}
});

StudentSchema = new SimpleSchema([{
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
	}
	expense_ids: {
		type: [String],
		label: "Expense Id",
		optional: true,
		custom: function () {
			if (!Expenses.findOne(this.value)) return "invalidRelation";
		}
	},
	lesson_ids: {
		type: [String],
		label: "Lesson Id",
		optional: true,
		custom: function () {
			if (!Lessons.findOne(this.value)) return "invalidRelation";
		}
	},
	reflectsUser: {
		type: Boolean,
		optional: true,
		allowedValues: [true]
	}
}, PriceSchema]);
Students.attachSchema(StudentSchema);


LessonSchema = new SimpleSchema([DateSchema, PriceSchema, CommentSchema]);
Lessons.attachSchema(LessonSchema);

PaymentSchema = new SimpleSchema([{
	method: {
		type: String,
		label: "Payment Method",
		trim: true
	}
}, DateSchema, PriceSchema, CommentSchema]);
PaymentSchema.labels({
	price: "Amount"
})
Payments.attachSchema(PaymentSchema);

ExpenseSchema = new SimpleSchema([DateSchema, PriceSchema, CommentSchema]);
Expenses.attachSchema(ExpenseSchema);

StudentExpenses.attachSchema(ExpenseSchema);

VoucherSchema = new SimpleSchema({
	claim_id: {
		type: String,
		label: "Voucher Claim Id",
		optional: true,
		custom: function () {
			if (!VoucherClaims.findOne(this.value)) return "invalidRelation";
		}
	}
});
Vouchers.attachSchema(VoucherSchema);

VoucherClaimSchema = new SimpleSchema([{
	user_id: {
		type: String,
		label: 'User Who Made this Claim',
		custom: function () {
			if (!Meteor.users.findOne(this.value)) return "invalidRelation";
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
}, DateSchema, CommentSchema]);
VoucherClaims.attachSchema(VoucherClaimSchema);