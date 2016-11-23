if (window.location.href.indexOf("blainehansenpianostudio") > -1) {
	window.location = "http://blainehansenpiano.com" + window.location.pathname;
}

// Utility Functions
var tagMaker = function (context, tag) {
	return tag + context._id;
};
var pushEdits = function (collection, template, attributes, optionalData, optionalId, optionalFormatter) {
	var formatter = optionalFormatter || function (obj) {
		return {$set: obj};
	};
	var dataObj = optionalData || template.data;
	var obj = {};
	var input, attribute, callback, data;
	var inputsValid = attributes.every(function (item) {
		input = template.find(item[0]).value.trim();
		attribute = item[1];
		callback = item[2];

		if (!callback(input)) return false;

		data = dataObj[attribute];

		if (input != data) obj[attribute] = input;
		return true;
	});

	if (inputsValid) {
		var id = optionalId || dataObj._id;
		var fullObj = formatter(obj);
		if (!_.isEmpty(obj)) collection.update(id, fullObj);
	}

	return inputsValid;
};
var noopTest = function (input) {
	return true;
};
var existenceTest = function (input) {
	return !!input;
};
var validPriceTest = function (input) {
	input = input.replace(/\$/,'');
	return input && !isNaN(parseFloat(input)) && parseFloat(input) >= 0;
};
var validDateTest = function (input) {
	return /\d{2}\/\d{2}\/\d{4}\s*/.test(input);
};
var validEmailTest = function (input) {
	return /\S+@\S+\.\S+/.test(input);
};
var validPhoneTest = function (input) {
	return /\d{3}[\/\s.-]?\d{3}[\/\s.-]?\d{4}/.test(input);
};
var returnPriceOptions = function (array, data) {
	var result = [];
	array.forEach(function (doc) {
		if (doc.price == data.price)
			result.push(_.extend({selected: 'selected'}, doc));
		else
			result.push(doc);
	});
	return result;
};
var chooseCollection = function (name) {
	switch (name) {
		case 'users':
			return Meteor.users;
		case 'students':
			return Students;
	}
};
var giveArrayFromCollection = function (collection, ids, sortByDate) {
	if (ids) {
		if (sortByDate) return collection.find({_id: {$in: ids}}, {sort: [['date', 'desc']]});
		else return collection.find({_id: {$in: ids}});
	}
	else return false;
};



Template.projectsPost.helpers({
	projects: function () {
		return Stories.find({category: 'projects'});
	}
});
Template.blogTree.helpers({
	blogs: function () {
		return Stories.find({category: 'blog'}, {sort: [['_id', 'asc']]});
	}
})
Template.projectsTiles.helpers({
	tileColumns: function() {
		var arrays = [[], []];
		var a = this.fetch();
		while (a.length > 0) {
			arrays[0].push(a.splice(0, 1)[0]);
			arrays[1].push(a.splice(0, 1)[0]);
		}
		return arrays;
	}
});
Template.teachingSideNav.helpers({
	pages: function () {
		return Stories.find({category: 'teaching'}, {sort: ['_id', 'asc']});
	}
});


Template.vouchers.created = function () {
	VoucherEntries = new Meteor.Collection(null);
	Belt.addCollection('voucherentries', VoucherEntries);
};
Template.vouchers.rendered = function () {
	$('.voucherDatepicker').datepicker(_.extend(datepickerOptions, {
		startDate: moment().format('MM/DD/YYYY')
	}));
	Meteor.subscribe('userVouchers', Meteor.userId());
};
Template.vouchers.helpers({
	claim: function () {
		var claim = VoucherClaims.findOne({user_id: Meteor.userId()});
		if (claim) claim.vouchers = Vouchers.find({claim_id: claim._id});
		return claim;
	},
	voucherEntries: function () {
		return VoucherEntries.find();
	}
});
Template.vouchers.events({
	'click #voucherFormSubmit': function (e, t) {
		Belt.session.erase(['voucherNumberError', 'voucherContactMethodError', 'voucherContactTimeError']);

		var claim_id = Belt.base.insert('voucherclaims', t, [
			// Add an "or" wrap function for Belt.format that would allow multiple cases for success.
			['#voucherContactMethod', 'method', Belt.format.existence, 'voucherContactMethodError'],
			['#voucherContactTime', 'time', Belt.format.existence, 'voucherContactTimeError'],
			['#voucherComments', 'comments']],
			{date: moment().format('MM/DD/YYYY'), user_id: Meteor.userId()});

		VoucherEntries.find().forEach(function (voucherEntry) {
			Vouchers.update(voucherEntry._id, {$set: { claim_id: claim_id }});
		});
	},
	'click #voucherNumberInputAdd': function (e, t) {
		Belt.session.erase(['voucherNumberError', 'voucherContactMethodError', 'voucherContactTimeError']);

		Belt.base.method('checkVoucher', t, [
			['#voucherNumberInput', '_id', Belt.format.existence, 'voucherNumberError']], 'voucherNumberError',
			function (error, result) {
				if (!error) {
					VoucherEntries.insert({_id: result});
				}
			});
	}
});