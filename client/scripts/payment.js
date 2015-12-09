
/// Payment stuff.
Template.paymentModal.rendered = function() {
	Session.set('paymentModalState', this.data.braintree_id ? 'cardlist' : 'nocards');
	Belt.session.erase(['paymentFormError', 'paymentFormAmountValidate', 'paymentFormNumberValidate', 'paymentFormCVVValidate', 'paymentFormExpValidate']);
};
Template.paymentModal.events({
	'click #switchEnterCard': function (e, t) {
		t.data.balance = t.find('form#paymentModalForm #amount').value;
		Session.set('paymentModalState', 'newcard');
		Belt.session.erase(['paymentFormNumberValidate', 'paymentFormCVVValidate', 'paymentFormExpValidate']);
	},
	'click #switchUseCard': function (e, t) {
		t.data.balance = t.find('form#paymentModalForm #amount').value;
		Session.set('paymentModalState', 'cardlist');
		Belt.session.erase(['paymentFormNumberValidate', 'paymentFormCVVValidate', 'paymentFormExpValidate']);
	},
	'click #resetPayment': function (e, t) {
		Session.set('paymentModalState', t.data.braintree_id ? 'cardlist' : 'nocards');
		Belt.session.erase(['paymentFormError','paymentFormAmountValidate', 'paymentFormNumberValidate', 'paymentFormCVVValidate', 'paymentFormExpValidate']);
	},
	'submit form#paymentModalForm': function (e, t) {
		e.preventDefault();
		
		var saleObj = {
			amount: parseFloat(t.find('form#paymentModalForm #amount').value),
			options: {
				submitForSettlement: true
			}
		};

		switch (Session.get('paymentModalState')) {
			case 'newcard':
				saleObj.customerId = t.data.braintree_id;
				saleObj.options.failOnDuplicatePaymentMethod = true;
				saleObj.options.makeDefault = t.find('#makeDefault').checked;
				// Fall through!!!
			case 'nocards':
				saleObj.creditCard = {
					cvv: t.find('#cvv').value,
					number: t.find('#number').value,
					expirationMonth: t.find('#expirationMonth').value,
					expirationYear: t.find('#expirationYear').value	
				};
				saleObj.options.storeInVaultOnSuccess = t.find('#storeInVaultOnSuccess').checked;
				break;
			case 'cardlist':
				saleObj.paymentMethodToken = t.find('input:radio.cardChoice:checked').value;
				break;
		}

		Meteor.call('makeBraintreePayment', saleObj, function (error, result) {
			if (error) {
				Session.set('paymentFormError', error.reason);
			}
			else {
				Session.set('paymentModalState', 'successful');
				Meteor.subscribe('currentUser');
			}
		});
	},
	'keyup #amount': function (e, t) {
		var value = parseFloat(t.find('#amount').value.trim());
		if (!value) Session.set('paymentFormAmountValidate', undefined);
		else if (isNaN(value) || value < 0) Session.set('paymentFormAmountValidate', 'has-error');
		else Session.set('paymentFormAmountValidate', 'has-success');
	},
	'keyup #number': function (e, t) {
		var value = t.find('#number').value.trim();
		if (!value) Session.set('paymentFormNumberValidate', undefined);
		else if (/^\d+$/.test(value)) Session.set('paymentFormNumberValidate', 'has-success');
		else Session.set('paymentFormNumberValidate', 'has-error');
	},
	'keyup #cvv': function (e, t) {
		var value = t.find('#cvv').value.trim();
		if (!value) Session.set('paymentFormCVVValidate', undefined);
		else if (/^\d+$/.test(value)) Session.set('paymentFormCVVValidate', 'has-success');
		else Session.set('paymentFormCVVValidate', 'has-error');
	},
	'change #expirationMonth, change #expirationYear': function (e, t) {
		var monthValue = t.find('#expirationMonth').value.trim();
		var yearValue = t.find('#expirationYear').value.trim();
		if (!monthValue || !yearValue) Session.set('paymentFormExpValidate', undefined);
		else Session.set('paymentFormExpValidate', 'has-success');
	},
	'click #storeInVaultOnSuccess': function (e, t) {
		if (t.find('#storeInVaultOnSuccess').checked) t.find('#makeDefault').disabled = false;
		else {
			t.find('#makeDefault').disabled = true;
			t.find('#makeDefault').checked = false;
		}
	}
});
Template.paymentModal.helpers({
	formBody: function() {
		switch (Session.get('paymentModalState')) {
			case 'nocards': return Template.paymentModalNoCards;
			case 'newcard': return Template.paymentModalNewCard;
			case 'cardlist': return Template.paymentModalCardList;
			case 'successful': return Template.paymentModalSuccess;
			default: return Template.paymentModalNewCard;
		}
		return Template[Session.get('paymentModalState')];
	}
});
Template.paymentModalCardList.helpers({
	creditCards: function () {
		if (Session.get('paymentModalCreditCards')) return Session.get('paymentModalCreditCards');
		else {
			Meteor.call('getBraintreeCreditCards', this.braintree_id, function (error, result) {
				if (error) console.log(error);
				else {
					Session.set('paymentModalCreditCards', result);
				}
			});
			return undefined;
		}
	},
	defaultChecked: function (defaultArg) {
		return defaultArg ? 'checked' : '';
	}
});
Template.paymentFormButton.helpers({
	paymentFormInputsValid: function () {
		switch (Session.get('paymentModalState')) {
			case 'nocards':
			case 'newcard':
				var valid = Session.get('paymentFormAmountValidate') == 'has-success';
				valid = valid && (Session.get('paymentFormNumberValidate') == 'has-success');
				valid = valid && (Session.get('paymentFormCVVValidate') == 'has-success');
				valid = valid && (Session.get('paymentFormExpValidate') == 'has-success');
				return valid ? '': 'disabled';
			case 'cardlist': 
				return Session.get('paymentFormAmountValidate') == 'has-success' ? '' : 'disabled';
		}
	}
});