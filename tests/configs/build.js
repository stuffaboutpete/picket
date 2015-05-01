module.exports = function(config) {
	config.set({
		basePath: '../..',
		files: ['build/classy.js'].concat(require('./support/files-test')),
		frameworks: ['jasmine'],
		browsers: ['PhantomJS']
	});
};
