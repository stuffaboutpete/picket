var gulp = require('gulp'),
	concat = require('gulp-concat'),
	watch = require('gulp-watch'),
	uglify = require('gulp-uglify'),
	gzip = require('gulp-gzip'),
	rename = require('gulp-rename'),
	karma = require('gulp-karma'),
	bump = require('gulp-bump'),
	args = require('yargs').argv;

gulp.task('default', ['test'], function(){
	gulp.watch(['./src/**/*.js', '!./src/**/*Test.js'], ['build']);
});

gulp.task('build', function(){
	gulp.src([
		'Shim.js',
			'./src/Inheritance.js',
			'./src/Fatal.js',
			'./src/NamespaceManager.js',
			'./src/NamespaceManager/Fatal.js',
			'./src/TypeChecker.js',
			'./src/TypeChecker/Fatal.js',
			'./src/Access/Type.js',
			'./src/Access/Type/Fatal.js',
			'./src/Access/Controller.js',
			'./src/Type/Class.js',
			'./src/Type/Class/Constructor.js',
			'./src/Type/Class/Constructor/Fatal.js',
			'./src/Type/Class/Definition.js',
			'./src/Type/Class/Definition/Fatal.js',
			'./src/Type/Class/Definition/Factory.js',
			'./src/Type/Class/Factory.js',
			'./src/Type/Class/Fatal.js',
			'./src/Type/Interface.js',
			'./src/Type/Interface/Definition.js',
			'./src/Type/Interface/Definition/Fatal.js',
			'./src/Type/Interface/Definition/Factory.js',
			'./src/Type/Interface/Factory.js',
			'./src/Type/Factory.js',
			'./src/Type/Factory/Fatal.js',
			'./src/Type/DefinitionFactory.js',
			'./src/Type/DefinitionFactory/Fatal.js',
			'./src/Member/Property.js',
			'./src/Member/Property/Definition.js',
			'./src/Member/Property/Definition/Fatal.js',
			'./src/Member/Property/Definition/Factory.js',
			'./src/Member/Property/Factory.js',
			'./src/Member/Property/Fatal.js',
			'./src/Member/Method.js',
			'./src/Member/Method/Definition.js',
			'./src/Member/Method/Definition/Fatal.js',
			'./src/Member/Method/Definition/Factory.js',
			'./src/Member/Method/Factory.js',
			'./src/Member/Method/Fatal.js',
			'./src/Member/Event.js',
			'./src/Member/Event/Definition.js',
			'./src/Member/Event/Definition/Fatal.js',
			'./src/Member/Event/Definition/Factory.js',
			'./src/Member/Event/Factory.js',
			'./src/Member/Event/Fatal.js',
			'./src/Member/Constant.js',
			'./src/Member/Constant/Definition.js',
			'./src/Member/Constant/Definition/Fatal.js',
			'./src/Member/Constant/Definition/Factory.js',
			'./src/Member/Constant/Factory.js',
			'./src/Member/Constant/Fatal.js',
			'./src/Member/Factory.js',
			'./src/Member/Factory/Fatal.js',
			'./src/Member/DefinitionFactory.js',
			'./src/Member/DefinitionFactory/Fatal.js',
			'./src/Registry/Type.js',
			'./src/Registry/Type/Fatal.js',
			'./src/Registry/Member.js',
			'./src/Registry/Member/Fatal.js',
			'./src/Instantiator.js',
			'./src/AutoLoader.js',
			'./src/AutoLoader/Fatal.js',
			'./src/AutoLoader/Instantiator.js',
			'./src/AutoLoader/Includer/Script.js',
			'./src/AutoLoader/Includer/Script/Fatal.js',
			'./src/Reflection/Type.js',
			'./src/Reflection/Type/Class.js',
			'./src/Reflection/Member.js',
			'./src/Reflection/Member/Method.js',
			'./src/Reflection/Member/Method/Argument.js',
			'./src/Reflection/Member/Property.js',
			'./src/Main.js',
			'./src/Main/Fatal.js'
	])
		.pipe(concat('classy.js'))
		.pipe(gulp.dest('./build/'))
		.pipe(uglify())
		.pipe(rename('classy.min.js'))
		.pipe(gulp.dest('./build/'))
		.pipe(gzip())
		.pipe(gulp.dest('./build/'));
});

gulp.task('test', function(){
	return gulp.src(['**/*invalid']).pipe(karma({
		configFile: 'karma.conf.js',
		action: 'watch'
	})).on('error', function(error) { console.error(error); });
});

gulp.task('bump', function(){
	var argsHolder = [];
	if (args.major) argsHolder.push('major');
	if (args.minor) argsHolder.push('minor');
	if (args.patch) argsHolder.push('patch');
	if (argsHolder.length == 0) {
		console.log('Please provide either --major, --minor or --patch');
		return;
	}
	if (argsHolder.length > 1) {
		console.log('Please only provide one bump type');
		return;
	}
	return gulp.src('./bower.json')
		.pipe(bump({type: argsHolder[0]}))
		.pipe(gulp.dest('./'));
});
