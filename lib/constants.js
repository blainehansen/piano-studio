Constants = {};
Constants.priceOptionsArray = [
	{price: 15, description: 'Minor Lesson ($20.00)'},
	{price: 22.50, description: 'Major Lesson ($30.00)'},
	{price: 30, description: 'Augmented Lesson ($40.00)'}
];
Constants.adminPriceOptionsArray = Constants.priceOptionsArray.concat([
	{price: 7.5, description: 'Half Price Minor Lesson ($10.00)'},
	{price: 11.25, description: 'Half Price Major Lesson ($15.00)'},
	{price: 15, description: 'Half Price Augmented Lesson ($20.00)'},
	{price: 0, description: 'Free Lesson ($0.00)'}
]);