define([
	'require',
	'app/models/user',
	'app/models/analytics',
	'app/controllers/sidebar',
	'app/controllers/lightbox',
	'app/controllers/single'
	], function (
		require,
		User,
		Analytics,
		Sidebar,
		Lightbox,
		Single
	) {

	$ = window.jQuery;

	// jQuery should be in as a WP dependency already
	$(document).ready(function() {

		// Initialise the user and load stuff
		User.init(function() {
			Sidebar.load(User.user, User.site);
		}, function() {
			Lightbox.load(User.user, User.site);
			Single.load(User.user, User.activity);
			Analytics.init(User.user, User.site);
		});

	});

});