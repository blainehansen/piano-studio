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