Constants = {};
Constants.priceOptionsArray = [
	{price: 15, description: 'Minor Lesson ($15.00)'},
	{price: 22.50, description: 'Major Lesson ($22.50)'},
	{price: 30, description: 'Augmented Lesson ($30.00)'}
];
Constants.adminPriceOptionsArray = Constants.priceOptionsArray.concat([
	{price: 7.5, description: 'Half Price Minor Lesson ($7.50)'},
	{price: 11.25, description: 'Half Price Major Lesson ($11.25)'},
	{price: 15, description: 'Half Price Augmented Lesson ($15.00)'},
	{price: 0, description: 'Free Lesson ($0.00)'}
]);