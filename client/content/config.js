Stories = new Meteor.Collection(null);

[
{ category: 'announcements', news: true, date: '10/27/2014', title: 'Repertoire Page', contentTemplate: 'new-repertoire-page' },

{ category: 'announcements', news: true, date: '10/07/2014', title: 'New Studio Website', contentTemplate: 'new-studio-website'},

{ category: 'announcements', news: true, featured: true, date: '11/23/2016', picture: '/handsplaying.jpg', top: 'top',
title: 'Many New Repertoire Pieces', contentTemplate: 'new-pieces',
banner: 'New Scores Added', subtitle: 'Take a look at the repoertoire page in the teaching section, many new pieces have been added at many different levels.'},


{ featured: true, picture: 'piano.jpg', 
banner: 'Creative Projects', subtitle: 'Visit the projects page to see new performances.' },
{ featured: true, picture: 'the-rock.jpg',
banner: 'Thoughts on Music', subtitle: 'Articles about Classical Music, music in general, and teaching.' },

{ category: 'teaching', contentTemplate: 'teachingHome', title: 'Teaching Home'},
// { category: 'teaching', contentTemplate: 'vouchers', title: 'Voucher Sign Up List' },
{ category: 'teaching', contentTemplate: 'pricing', title: 'Lesson Types and Pricing' },
{ category: 'teaching', contentTemplate: 'policy', title: 'Studio Policies' },
{ category: 'teaching', contentTemplate: 'benefits', title: 'The Practical Benefits of Piano Lessons' },
// { category: 'teaching', contentTemplate: 'methods', title: 'My Methods' },
// { category: 'teaching', contentTemplate: 'web-lessons', title: 'Web Lessons' },
// { category: 'teaching', contentTemplate: 'masterworks', title: 'The Masterwork Guidebook' },
{ category: 'teaching', contentTemplate: 'exercises', title: 'Student Exercises' },
{ category: 'teaching', contentTemplate: 'repertoireHome', title: 'Student Repertoire' },
{ category: 'teaching', contentTemplate: 'contact', title: 'Studio Location and Contact' },
{ category: 'teaching', contentTemplate: 'bio', title: 'About Me' },

{ category: 'blog', contentTemplate: 'blogHome', title: 'What is this Blog About?' },

{ category: 'projects', type: 'interpretations', title: 'Rachmaninoff: Etude Tableaux, Op. 33, No. 9',
contentTemplate: 'rachmaninoff-etude-33-9', media: "et9Uyv_aXcg"},
{ category: 'projects', type: 'interpretations', title: 'Debussy: The Snow is Dancing',
contentTemplate: 'debussy-snow-is-dancing', media: "l9wyJuyWdNg"},
{ category: 'projects', type: 'interpretations', title: 'Rachmaninoff: Fragments',
contentTemplate: 'rachmaninoff-fragments', media: "0P-JfB6W35I"},
{ category: 'projects', type: 'interpretations', title: 'Liszt: Gnomenreigen',
contentTemplate: 'liszt-gnomenreigen', media: "aQ5u7DD8nbU"},

].forEach(function (story, index) {
	story._id = index < 10 ? '0' + index : '' + index;
	Stories.insert(story);
});