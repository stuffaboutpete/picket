module.exports = function(config) {
	config.set({
		basePath: '../..',
		files: ['build/picket.min.js'].concat(require('./support/files-test')),
		frameworks: ['jasmine'],
		browsers: ['PhantomJS']
	});
};
