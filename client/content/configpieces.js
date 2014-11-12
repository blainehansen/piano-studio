Pieces = new Meteor.Collection(null);
Composers = new Meteor.Collection(null);

[
{_id: 'attwood', name: 'Thomas Attwood'},
{_id: 'bach', name: 'Johann Sebastian Bach'},
{_id: 'beethoven', name: 'Ludwig van Beethoven'},
{_id: 'bartok', name: 'Bela Bartok'},
{_id: 'berens', name: 'Hermann Berens'},
{_id: 'beyer', name: 'Ferdinand Beyer'},
{_id: 'bolck', name: 'Oscar Bolck'},
{_id: 'czerny', name: 'Carl Czerny'},
{_id: 'diabelli', name: 'Anton Diabelli'},
{_id: 'duvernoy', name: 'J. B. Duvernoy'},
{_id: 'goedicke', name: 'Alexander Goedicke'},
{_id: 'gurlitt', name: 'Cornelius Gurlitt'},
{_id: 'hainhofer', name: 'Philipp Hainhofer'},
{_id: 'hassler', name: 'Johann William Hassler'},
{_id: 'haydn', name: 'Franz Joseph Haydn'},
{_id: 'hofe', name: 'Joachim von der Hofe'},
{_id: 'hook', name: 'James Hook'},
{_id: 'horvath', name: 'Geza Horvath'},
{_id: 'jcbach', name: 'Johann Christian Bach'},
{_id: 'kabalevsky', name: 'Dmitri Kabalevsky'},
{_id: 'kohler', name: 'Louis Kohler'},
{_id: 'kunz', name: 'Konrad Kunz'},
{_id: 'leomozart', name: 'Leopold Mozart'},
{_id: 'praetorius', name: 'Micheal Praetorius'},
{_id: 'rameau', name: 'Jean-Philippe Rameau'},
{_id: 'ravel', name: 'Maurice Ravel'},
{_id: 'reichardt', name: 'Johann Friedrich Reichardt'},
{_id: 'reinagle', name: 'Alexander Reinagle'},
{_id: 'rousseau', name: 'Jean Jacques Rousseau'},
{_id: 'salutrinskaya', name: 'Tat\'iana Salutrinskaya'},
{_id: 'schein', name: 'Johann Hermann Schein'},
{_id: 'schytte', name: 'Ludwig Schytte'},
{_id: 'telemann', name: 'Georg Philipp Telemann'},
{_id: 'turk', name: 'Daniel Gottlob Turk'},
{_id: 'vogel', name: 'Moritz Vogel'},
{_id: 'wilton', name: 'C. H. Wilton'},

].forEach(function (composer) {
	Composers.insert(composer);
});

[
{composer: 'attwood', level: 0, title: 'Tuneful Dialogue', score: 'Attwood-TunefulDialogue.pdf'},

{composer: 'bach', level: 1, title: 'Minuet', score: 'Bach-Minuet.pdf'},

{composer: 'bartok', level: 0, title: 'Folk Dance', score: 'Bartok-FolkDance.pdf'},
{composer: 'bartok', level: 0, title: 'Little Invention', score: 'Bartok-LittleInvention.pdf'},
{composer: 'bartok', level: 0, title: 'Walking', score: 'Bartok-Walking.pdf'},
{composer: 'bartok', level: 1, title: 'Folk Dance', score: 'Bartok-FolkDance2.pdf'},
{composer: 'bartok', level: 1, title: 'Hungarian Folk Song', score: 'Bartok-HungarianFolkSong.pdf'},

{composer: 'beethoven', level: 1, title: 'Village Dance', score: 'Beethoven-VillageDance.pdf'},

{composer: 'beyer', level: 0, title: 'A Short Story', score: 'Beyer-AShortStory.pdf'},
{composer: 'beyer', level: 0, title: 'Evening Song', score: 'Beyer-EveningSong.pdf'},
{composer: 'beyer', level: 0, title: 'Lyrical Piece', score: 'Beyer-LyricalPiece.pdf'},
{composer: 'beyer', level: 0, title: 'Melody', score: 'Beyer-Melody.pdf'},
{composer: 'beyer', level: 1, title: 'Round Dance', score: 'Beyer-RoundDance.pdf'},
{composer: 'beyer', level: 1, title: 'Two In One', score: 'Beyer-TwoInOne.pdf'},

{composer: 'bolck', level: 0, title: 'Five Note Sonatina', score: 'Bolck-FiveNoteSonatina.pdf'},

{composer: 'czerny', level: 0, title: 'Dance', score: 'Czerny-Dance.pdf'},
{composer: 'czerny', level: 0, title: 'Going Downtown', score: 'Czerny-GoingDowntown.pdf'},
{composer: 'czerny', level: 0, title: 'Lullaby', score: 'Czerny-Lullaby.pdf'},
{composer: 'czerny', level: 0, title: 'March', score: 'Czerny-March.pdf'},
{composer: 'czerny', level: 0, title: 'Waltz', score: 'Czerny-Waltz.pdf'},
{composer: 'czerny', level: 1, title: 'Etude In C', score: 'Czerny-EtudeInC.pdf'},
{composer: 'czerny', level: 1, title: 'Etude In F', score: 'Czerny-EtudeInF.pdf'},
{composer: 'czerny', level: 1, title: 'Whistling Song', score: 'Czerny-WhistlingSong.pdf'},

{composer: 'diabelli', level: 1, title: 'Bagatelle 2', score: 'Diabelli-Bagatelle2.pdf'},
{composer: 'diabelli', level: 1, title: 'Bagatelle', score: 'Diabelli-Bagatelle.pdf'},
{composer: 'diabelli', level: 1, title: 'Morning Song', score: 'Diabelli-MorningSong.pdf'},

{composer: 'duvernoy', level: 1, title: 'Song Without Words', score: 'Duvernoy-SongWithoutWords.pdf'},

{composer: 'goedicke', level: 0, title: 'Russian Dance', score: 'Goedicke-RussianDance.pdf'},

{composer: 'gurlitt', level: 0, title: 'Minuet', score: 'Gurlitt-Minuet.pdf'},
{composer: 'gurlitt', level: 0, title: 'Relay Race', score: 'Gurlitt-RelayRace.pdf'},
{composer: 'gurlitt', level: 0, title: 'Trumpet Tune', score: 'Gurlitt-TrumpetTune.pdf'},
{composer: 'gurlitt', level: 0, title: 'Waltz Op. 82 No. 18', score: 'Gurlitt-WaltzO82N18.pdf'},
{composer: 'gurlitt', level: 1, title: 'Invention Etude', score: 'Gurlitt-InventionEtude.pdf'},
{composer: 'gurlitt', level: 1, title: 'Sonatina In C', score: 'Gurlitt-SonatinaInC.pdf'},
{composer: 'gurlitt', level: 1, title: 'The Hunt', score: 'Gurlitt-TheHunt.pdf'},

{composer: 'hainhofer', level: 0, title: 'Echo Dance', score: 'Hainhofer-EchoDance.pdf'},

{composer: 'hassler', level: 1, title: 'Minuetto', score: 'Hassler-Minuetto.pdf'},

{composer: 'haydn', level: 1, title: 'Quadrille', score: 'Haydn-Quadrille.pdf'},

{composer: 'hofe', level: 0, title: 'Canario', score: 'Hofe-Canario.pdf'},

{composer: 'horvath', level: 0, title: 'Canzonetta', score: 'Horvath-Canzonetta.pdf'},

{composer: 'hook', level: 1, title: 'Minuet', score: 'Hook-Minuet.pdf'},

{composer: 'jcbach', level: 0, title: 'Minuet', score: 'ChristianBach-Minuet.pdf'},

{composer: 'kabalevsky', level: 0, title: 'Marching', score: 'Kabalevsky-Marching.pdf'},
{composer: 'kabalevsky', level: 0, title: 'Melody', score: 'Kabalevsky-Melody.pdf'},
{composer: 'kabalevsky', level: 0, title: 'Polka', score: 'Kabalevsky-Polka.pdf'},
{composer: 'kabalevsky', level: 0, title: 'Song Op. 39 No. 8', score: 'Kabalevsky-SongO39N8.pdf'},
{composer: 'kabalevsky', level: 1, title: 'A Game', score: 'Kabalevsky-AGame.pdf'},
{composer: 'kabalevsky', level: 1, title: 'Cradle Song', score: 'Kabalevsky-CradleSong.pdf'},
{composer: 'kabalevsky', level: 1, title: 'Dance', score: 'Kabalevsky-Dance.pdf'},
{composer: 'kabalevsky', level: 1, title: 'Funny Event', score: 'Kabalevsky-FunnyEvent.pdf'},
{composer: 'kabalevsky', level: 1, title: 'Little Scherzo', score: 'Kabalevsky-LittleScherzo.pdf'},
{composer: 'kabalevsky', level: 1, title: 'Scherzo', score: 'Kabalevsky-Scherzo.pdf'},

{composer: 'kohler', level: 0, title: 'A Pleasant Day', score: 'Kohler-APleasantDay.pdf'},
{composer: 'kohler', level: 0, title: 'Duet', score: 'Kohler-Duet.pdf'},
{composer: 'kohler', level: 0, title: 'Song Without Words', score: 'Kohler-SongWithoutWords.pdf'},
{composer: 'kohler', level: 0, title: 'Twinkle Twinkle Little Star', score: 'Kohler-TwinkleTwinkleLittleStar.pdf'},
{composer: 'kohler', level: 1, title: 'Carefree Stroll', score: 'Kohler-CarefreeStroll.pdf'},
{composer: 'kohler', level: 1, title: 'Etude In A Minor', score: 'Kohler-EtudeInAMinor.pdf'},

{composer: 'kunz', level: 0, title: 'A Serious Event', score: 'Kunz-ASeriousEvent.pdf'},

{composer: 'leomozart', level: 1, title: 'Minuet', score: 'Mozart-Minuet.pdf'},

{composer: 'praetorius', level: 0, title: 'Old German Dance', score: 'Praetorius-OldGermanDance.pdf'},

{composer: 'rameau', level: 1, title: 'Minuet', score: 'Rameau-Minuet.pdf'},

{composer: 'reichardt', level: 0, title: 'Duet In Contrary Motion', score: 'Reichardt-DuetInContraryMotion.pdf'},

{composer: 'reinagle', level: 0, title: 'Minuet', score: 'Reinagle-Minuet.pdf'},
{composer: 'reinagle', level: 0, title: 'Procession', score: 'Reinagle-Procession.pdf'},
{composer: 'reinagle', level: 0, title: 'Promenade', score: 'Reinagle-Promenade.pdf'},
{composer: 'reinagle', level: 0, title: 'Simple Song', score: 'Reinagle-SimpleSong.pdf'},
{composer: 'reinagle', level: 1, title: 'Minuet', score: 'Reinagle-Minuet2.pdf'},

{composer: 'rousseau', level: 1, title: 'The Village Prophet', score: 'Rousseau-TheVillageProphet.pdf'},

{composer: 'salutrinskaya', level: 1, title: 'The Shepard\'s Flute', score: 'Salutrinskaya-TheShepardsFlute.pdf'},

{composer: 'schein', level: 1, title: 'Allemande', score: 'Schein-Allemande.pdf'},

{composer: 'schytte', level: 1, title: 'Bagatelle', score: 'Schytte-Bagatelle.pdf'},
{composer: 'schytte', level: 1, title: 'In Church', score: 'Schytte-InChurch.pdf'},
{composer: 'schytte', level: 1, title: 'Melody For The Left Hand', score: 'Schytte-MelodyForTheLeftHand.pdf'},
{composer: 'schytte', level: 1, title: 'Minuetto', score: 'Schytte-Minuetto.pdf'},
{composer: 'schytte', level: 1, title: 'Scherzo', score: 'Schytte-Scherzo.pdf'},
{composer: 'schytte', level: 1, title: 'TheHarp', score: 'Schytte-TheHarp.pdf'},

{composer: 'telemann', level: 1, title: 'Gavotte', score: 'Telemann-Gavotte.pdf'},
{composer: 'telemann', level: 1, title: 'Minuet', score: 'Telemann-Minuet.pdf'},

{composer: 'turk', level: 0, title: 'Carefree', score: 'Turk-Carefree.pdf'},
{composer: 'turk', level: 0, title: 'Childrens Song', score: 'Turk-ChildrensSong.pdf'},
{composer: 'turk', level: 0, title: 'Lament', score: 'Turk-Lament.pdf'},
{composer: 'turk', level: 0, title: 'March In C', score: 'Turk-MarchInC.pdf'},
{composer: 'turk', level: 0, title: 'March In F', score: 'Turk-MarchInF.pdf'},
{composer: 'turk', level: 0, title: 'March In G 2', score: 'Turk-MarchInG2.pdf'},
{composer: 'turk', level: 0, title: 'March In G', score: 'Turk-MarchInG.pdf'},
{composer: 'turk', level: 0, title: 'Minuet', score: 'Turk-Minuet.pdf'},
{composer: 'turk', level: 1, title: 'Dance', score: 'Turk-Dance.pdf'},

{composer: 'vogel', level: 0, title: 'The Brave Knight', score: 'Vogel-TheBraveKnight.pdf'},

{composer: 'wilton', level: 0, title: 'Minuet', score: 'Wilton-Minuet.pdf'},
{composer: 'wilton', level: 0, title: 'Sonatina', score: 'Wilton-Sonatina.pdf'},

].forEach(function (piece) {
	Pieces.insert(piece);
});
