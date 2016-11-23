Students = new Meteor.Collection('students');
Belt.addCollection('students', Students);

Lessons = new Meteor.Collection('lessons');
Belt.addCollection('lessons', Lessons);

Payments = new Meteor.Collection('payments');
Belt.addCollection('payments', Payments);

Expenses = new Meteor.Collection('expenses');
Belt.addCollection('expenses', Expenses);

StudentExpenses = new Meteor.Collection('studentexpenses');
Belt.addCollection('studentexpenses', StudentExpenses);