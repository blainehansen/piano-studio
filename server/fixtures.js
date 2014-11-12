if (Meteor.users.find().count() < 2) {
	var record_id = '';
	record_id = Accounts.createUser({email: 'faichenshing@gmail.com', password: "nameless"});
	Meteor.users.update(record_id, 
		{$set: {firstname: 'Blaine' , lastname: 'Hansen' , phones: [{number: '801-512-4844'}], admin: true}});
	record_id = Accounts.createUser({email: 'dude@gmail.com', password: "password"});
	Meteor.users.update(record_id, {$set: {firstname: 'Dude' , lastname: 'Archer' , phones: [{number: '801-333-3333'}]}});
	record_id = Accounts.createUser({email: 'guy@gmail.com', password: "password"});
	Meteor.users.update(record_id, {$set: {firstname: 'Guy' , lastname: 'Archer' , phones: [{number: '801-333-3333'}]}});
	record_id = Accounts.createUser({email: 'man@gmail.com', password: "password"});
	Meteor.users.update(record_id, {$set: {firstname: 'Man' , lastname: 'Archer' , phones: [{number: '801-333-3333'}]}});
	record_id = Accounts.createUser({email: 'bro@gmail.com', password: "password"});
	Meteor.users.update(record_id, {$set: {firstname: 'Bro' , lastname: 'Archer' , phones: [{number: '801-333-3333'}]}});
}

var blaine = Meteor.users.findOne({firstname: "Blaine", lastname: "Hansen", admin: true});
if (blaine) {
	Roles.addUsersToRoles(blaine._id, 'admin', Roles.GLOBAL_GROUP);
	Meteor.users.update(blaine._id, {$unset: {admin: ''}});
}

if (Vouchers.find().count() == 0) {
	Vouchers.insert({_id: "1"});
	Vouchers.insert({_id: "2"});
	Vouchers.insert({_id: "3"});
	Vouchers.insert({_id: "4"});
}

if (Students.find().count() == 0) {
	Students.insert({firstname: 'Lana', lastname: 'Kane', price: 22.5});
}

Meteor.startup(function() {
	process.env.MAIL_URL = 'smtp://postmaster%40sandbox83338.mailgun.org:9zggvz4f10-9@smtp.mailgun.org:587';
});

Gateway = Braintree.connect({
	environment: Braintree.Environment.Sandbox,
	merchantId: "vftnkkh6x9rhqzfg",
	publicKey: "jh6pkbjwcmqpdgzs",
	privateKey: "0481cca8fc23aab726c4c4d17ab7b5b1"
});

Accounts.emailTemplates.from = "Blaine Hansen <blainehansenclassicalpiano@gmail.com>";
Accounts.emailTemplates.siteName = "Blaine Hansen Piano";
Accounts.emailTemplates.resetPassword.subject = function (user) {
	return "Blaine Hansen Piano: " + user.firstname + ' ' + user.lastname + " Password Reset";
};
Accounts.emailTemplates.resetPassword.text = function (user, url) {
	return "Hello " + user.firstname + ' ' + user.lastname + "!\nClick on the link below to reset your password.\n\n" + url + "\n\nGood Luck!"; 
};
Accounts.emailTemplates.enrollAccount.subject = function (user) {
	return "Blaine Hansen Piano: " + user.firstname + ' ' + user.lastname + " Account Enrollment";
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
	return "Hello " + user.firstname + ' ' + user.lastname + "!\nClick on the link below to activate your account.\nAfter you've clicked the link, you will be asked to enter a new password, which you'll use to log in to your account.\n\n" + url + "\n\nGood Luck!"; 
};
Accounts.emailTemplates.verifyEmail.subject = function (user) {
	return "Blaine Hansen Piano: " + user.firstname + ' ' + user.lastname + " Email Verification";
};
Accounts.emailTemplates.verifyEmail.text = function (user, url) {
	return "Hello " + user.firstname + ' ' + user.lastname + "!\nClick on the link below to verify this email.\n\n" + url + "\n\nGood Luck!"; 
};