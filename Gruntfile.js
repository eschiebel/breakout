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
        }
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-contrib-clean');

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

}
