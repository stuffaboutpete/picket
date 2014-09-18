var gulp = require('gulp'),
	concat = require('gulp-concat'),
	watch = require('gulp-watch'),
	uglify = require('gulp-uglify')
	rename = require('gulp-rename');

gulp.task('build', function(){
	gulp.src([
		'Shim.js',
		'Fatal/InvalidSyntax.js',
		'Fatal/AbstractClass.js',
		'Fatal/AbstractMethodNotImplemented.js',
		'Fatal/AbstractEventNotImplemented.js',
		'Fatal/InvalidClassDeclaration.js',
		'Fatal/Runtime.js',
		'Fatal/Scope.js',
		'Fatal/UnknownProperty.js',
		'Fatal/UnknownMethod.js',
		'Fatal/UnknownEvent.js',
		'Fatal/CannotInstantiateInterface.js',
		'Fatal/InterfaceMethodNotImplemented.js',
		'Fatal/InterfaceEventNotImplemented.js',
		'Fatal/InterfaceIncorrectlyDefined.js',
		'Fatal/InvalidReturnType.js',
		'Fatal/InvalidArgumentType.js',
		'Fatal/Clone.js',
		'Class.js',
		'Interface.js',
		'Scope.js',
		'Property.js',
		'Method.js'
	])
		.pipe(concat('classy.js'))
		.pipe(gulp.dest('.'))
		.pipe(uglify())
		.pipe(rename('classy.min.js'))
		.pipe(gulp.dest('.'));
});

gulp.task('default', function(){
	gulp.watch('**/*', ['build']);
});
