module.exports = function(config) {
	config.set({
		basePath: '../..',
		files: require('./support/files-core').concat(require('./support/files-test')),
		frameworks: ['jasmine'],
		browsers: ['PhantomJS']
	});
};
