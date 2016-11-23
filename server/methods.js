Meteor.methods({
	email: function (options) {
		if (Roles.userIsInRole(Meteor.userId(), 'admin'))
			throw new Meteor.Error(401, "You aren't authorized to send emails.");
		this.unblock();
		Email.send(options);
	},
	giveEmail: function (address) {
		if (!address) throw new Meteor.Error(400, 'You must supply an address');
		if (!Meteor.userId())
			throw new Meteor.Error(401, "You must login to perform this action.");
		Meteor.users.update(Meteor.userId(), {$push: {'emails': {address: address, verified: false}}});
		Accounts.sendVerificationEmail(Meteor.userId(), address);
	},
	adminCreateUser: function (userObj) {
		if (Roles.userIsInRole(Meteor.userId(), 'admin'))
			throw new Meteor.Error(401, "You aren't authorized to create Users.");
		userObj = _.pick(userObj, 'firstname', 'lastname', 'email')

		if (!userObj.email) {
			delete userObj.email;
			userObj.username = (userObj.firstname + userObj.lastname).toLowerCase() + Random.hexString(4);
		}
		userObj.password = Random.hexString(10);

		var emailContent = {
			to: 'blainehansenclassicalpiano@gmail.com', from: 'postmaster@sandbox83338.mailgun.org',
			subject: "User Created: " + userObj.firstname + ' ' + userObj.lastname,
		};
		if (userObj.email) {
			var id = Accounts.createUser({email: userObj.email, password: userObj.password});
			emailContent.text = "Email: " + userObj.email + "\nPassword: " + userObj.password
		}
		else {
			var id = Accounts.createUser({username: userObj.username, password: userObj.password});
			emailContent.text = "Username: " + userObj.username + "\nPassword: " + userObj.password
		}

		Meteor.users.update(id, {$set: {firstname: userObj.firstname, lastname: userObj.lastname}});
		Email.send(emailContent);
		return id;
	},
	createStudent: function (studentObj, userId) {
		if (Roles.userIsInRole(Meteor.userId(), 'admin'))
			throw new Meteor.Error(401, "You aren't authorized to create Students for this User.");
		studentObj = _.pick(studentObj, 'firstname', 'lastname', 'price');

		var user = Meteor.users.findOne(userId);
		if (user.firstname == studentObj.firstname && user.lastname == studentObj.lastname) {
			studentObj.reflectsUser = true;
		}

		var studentId = Students.insert(studentObj);
		Meteor.users.update(userId, {$push: {'student_ids': studentId}});

		return studentId;
	},
	createLesson: function (lessonObj, studentId) {
		if (Roles.userIsInRole(Meteor.userId(), 'admin'))
			throw new Meteor.Error(401, "You aren't authorized to create Lessons.");
		lessonObj = _.pick(lessonObj, 'date', 'price', 'comments');
		lessonObj.date = moment(lessonObj.date, ['M-D-YYYY', 'MM-DD-YYYY']).format('MM/DD/YYYY');

		if (lessonObj.price < 0)
			throw new Meteor.Error(400, "Price is negative.");

		var lessonId = Lessons.insert(lessonObj);
		Students.update(studentId, {$push: {'lesson_ids': lessonId}});

		return lessonId;
	},
	createPayment: function (paymentObj, userId) {
		if (Roles.userIsInRole(Meteor.userId(), 'admin'))
			throw new Meteor.Error(401, "You aren't authorized to create Payments.");
		paymentObj = _.pick(paymentObj, 'date', 'amount', 'method', 'comments');
		paymentObj.date = moment(paymentObj.date, ['M-D-YYYY', 'MM-DD-YYYY']).format('MM/DD/YYYY');

		if (paymentObj.amount < 0)
			throw new Meteor.Error(400, "Amount is negative.");

		var paymentId = Payments.insert(paymentObj);
		Meteor.users.update(userId, {$push: {'payment_ids': paymentId}});	

		return paymentId;
	},
	createStudentExpense: function (expenseObj, studentId) {
		if (Roles.userIsInRole(Meteor.userId(), 'admin'))
			throw new Meteor.Error(401, "You aren't authorized to create Expenses.");
		expenseObj = _.pick(expenseObj, 'date', 'price', 'comments');
		expenseObj.date = moment(expenseObj.date, ['M-D-YYYY', 'MM-DD-YYYY']).format('MM/DD/YYYY');

		if (expenseObj.price < 0)
			throw new Meteor.Error(400, "Price is negative.");

		var expenseId = StudentExpenses.insert(expenseObj);
		Students.update(studentId, {$push: {'expense_ids': expenseId}});

		return expenseId;
	},
	createExpense: function (expenseObj) {
		if (Roles.userIsInRole(Meteor.userId(), 'admin'))
			throw new Meteor.Error(401, "Only admins can create expenses.");
		expenseObj = _.pick(expenseObj, 'date', 'price', 'comments');
		expenseObj.date = moment(expenseObj.date, ['M-D-YYYY', 'MM-DD-YYYY']).format('MM/DD/YYYY');

		if (expenseObj.price < 0)
			throw new Meteor.Error(400, "Price is negative.");

		return Expenses.insert(expenseObj);
	},
	makeBraintreePayment: function (saleObj) {
		if (Meteor.userId() != Meteor.users.findOne({braintree_id: saleObj.customerId})._id)
			throw new Meteor.Error(401, "You aren't authorized to make charges for this User.");
		saleObj = _.pick(saleObj, 'amount', 'customerId', 'options', 'creditCard', 'paymentMethodToken');

		if (saleObj.amount < 0)
			throw new Meteor.Error(400, "Amount is negative.");

		saleObj.creditCard = _.pick(saleObj.creditCard, 'cvv', 'number', 'expirationMonth', 'expirationYear');

		saleObj.options = _.pick(saleObj.options, 'makeDefault', 'storeInVaultOnSuccess');
		saleObj.options.submitForSettlement = true;
		if (saleObj.customerId && saleObj.creditCard) saleObj.options.failOnDuplicatePaymentMethod = true;

		var now = new Date();
		Gateway.transaction.sale(saleObj, Meteor.bindEnvironment(
			function (err, result) {
				if (result.success) {

					if (result.transaction.customer.id && saleObj.options.storeInVaultOnSuccess) {
						console.log("Success! Transaction ID: " + result.transaction.id
							+ ", Customer ID: " + result.transaction.customer.id);
						console.log(saleObj.customerId);
						if (!saleObj.customerId) {
							console.log("Pushed Customer ID");
							Meteor.users.update(Meteor.userId(), {$set: { braintree_id: result.transaction.customer.id }});
						}
					}
					else {
						console.log("Success! Transaction ID: " + result.transaction.id);
					}

					var paymentId = Payments.insert({
						braintree_transaction_id: result.transaction.id,
						amount: saleObj.amount,
						date: (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear(),
						method: 'Online Payment'
					});
					Meteor.users.update(Meteor.userId(), {$push: { 'payment_ids': paymentId }});

					return result.transaction.id;
				} else {
					console.log("Error:  " + result.message);
					throw new Meteor.Error(500, result.message);
				}
			},
			function (err) {
				console.log('bind failure: ' + err.message);
				throw new Meteor.Error(500, err.message);
			}
		));
	},
	getBraintreeCreditCards: function (braintree_id) {
		if (Meteor.userId() != Meteor.users.findOne({braintree_id: braintree_id})._id)
			throw new Meteor.Error(401, "You aren't authorized to access Credit Cards for this User.");

		var async = function (id, callback) {
			Gateway.customer.find(id, function (err, customer) {
				if (err) callback(err);
				else {
					callback(null, customer.creditCards);
				}
			});
		}
		var sync = Meteor._wrapAsync(async);
		return sync(braintree_id);
	},
	verifyUserAddress: function (address) {
		if (!Meteor.userId())
			throw new Meteor.Error(401, "You must login to perform this action.");
		Accounts.sendVerificationEmail(Meteor.userId(), address);
	},
	resetUserPassword: function (address) {
		if (!address)
			throw new Meteor.Error(400, 'You must supply an address.');

		var user = Meteor.users.findOne({emails: {$elemMatch: {address: address}}});
		if (!user)
			throw new Meteor.Error(400, 'That address is not for a valid user.');

		Accounts.sendResetPasswordEmail(user._id, address);
	},
	checkEmailUnique: function (address) {
		if (!address)
			throw new Meteor.Error(400, 'You must supply an address.');

		var user = Meteor.users.findOne({emails: {$elemMatch: {address: address}}});
		return !user;
	},
	userEditEmail: function (oldAddress, newAddress) {
		if (!Meteor.userId())
			throw new Meteor.Error(401, "You must login to perform this action.");
		
		var user = Meteor.users.findOne({emails: {$elemMatch: {address: oldAddress}}});
		if (!user)
			throw new Meteor.Error(400, "That address is not for a valid user.");

		if (Meteor.userId() != user._id)
			throw new Meteor.Error(401, "You aren't authorized to edit this user's email addresses.");

		if (!oldAddress || !newAddress)
			throw new Meteor.Error(400, 'You must supply addresses.');

		Meteor.users.update({emails: {$elemMatch: {address: oldAddress, verified: false}}},
			{$set: {'emails.$.address': newAddress}});
	},
	checkVoucher: function (voucherId) {
		var voucher = Vouchers.findOne(voucherId);
		if (!voucher)
			throw new Meteor.Error(400, "That isn't a valid voucher number.");
		if (voucher.claim_id)
			throw new Meteor.Error(400, "That voucher has already been signed up.");

		return voucherId;
	}
});