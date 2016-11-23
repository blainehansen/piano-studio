Template.repertoireHome.helpers({
	levels: function () {
		// levels is an array
		// of level objects, which have a level, and composers, an array
		// of composer objects, which have a composer, name, and pieces, an array.
		var levels = [];
		var composers = [];
		var pieces;
		var level, levelObj;
		var composer, composerRecord, composerObj;
		for (level = 0; level <= 11; level++) {
			pieces = _.groupBy(Pieces.find({level: level}).fetch(), 'composer');

			for (composer in pieces) {
				composerRecord = Composers.findOne(composer);
				composerObj = {composer: composer, name: composerRecord.name, pieces: pieces[composer]};
				composers.push(composerObj);
			}

			levelObj = {level: level, composers: composers};
			composers = [];
			levels.push(levelObj);
		}

		return levels;
	}
});