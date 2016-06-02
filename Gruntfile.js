"use strict";


module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		copy: {
			client: {
				options: {},
				files: [
				    {expand: true, cwd: '.', dest: './dist',	src: './index.html'},
                    {expand: true, cwd: '.', dest: './dist', src: './src/css/breakout.css', flatten: true},
                    {expand: true, cwd: './src/css', dest: './dist', src: './images/**', flatten: false}
				]
			}
		},
		clean: {
			dist: ['dist/*'],
		},
        exec: {
			buildev: {
				command: 'webpack --debug --devtool source-map --output-pathinfo --config webpack.config.js'
			},
			buildprod: {
				command: 'webpack --optimize-minimize --optimize-occurence-order --optimize-dedupe --config webpack.config-prod.js'
			}
        },
        mochaTest: {
			test: {
				options: {
					reporter: 'spec',
                    require: 'babel-core/register',
				},
				src: ['test/**/*-test.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['build-dev']);

	grunt.registerTask(
		'build-dev',
		'dev build',
		['clean:dist', 'exec:buildev', 'copy:client']
	);
    grunt.registerTask(
		'build-prod',
		'dev build',
		['clean:dist', 'exec:buildprod', 'copy:client']
	);
    // grunt.registerTask('unittest', 'run unit tests', function() {
    //     var exec = require('child_process').exec;
	// 	var cb = this.async();
	// 	//exec(" ./node_modules/.bin/mocha --color --timeout 10000 --compilers js:babel-core/register -r mock-local-storage client/test/components/*-test.js", function(err, stdout,stderr){
    //     exec("npm run test", function(err, stdout,stderr){
	// 		if(err){
	// 			console.error(err);
	// 			console.error(stderr);
	// 			console.log(stdout);
	// 			cb();
	// 			return;
	// 		}
	// 		console.log(stdout);
	// 		cb();
	// 	})
    // }
    // )
    grunt.registerTask('unittest', 'run unit tests', 'mochaTest');
}
