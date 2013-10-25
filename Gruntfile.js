module.exports = function (grunt) {

	grunt.initConfig({

		jade: {
			compile: {
				options: {
					pretty: true
				},
				files: [
					{
						expand: true,
						src: 'html/*.jade',
						ext: '.html',
						filter: function (src) {
							return src.indexOf('/_') === -1;
						}
					}
				]
			}
		},
		less: {
			options: {
				ieCompat: true
			},
			process: {
				options: {
					paths: ["html/css/*.less"]
				},
				files: {
					"html/css/style.css": ["html/css/cover.less", "html/css/style.less"]
				}
			}
		},
		express: {
			dev: {
				options: {
					script: 'server.js'
				}
			}
		},
		watch: {
			jade: {
				files: ['html/*.jade'],
				tasks: ['jade']
			},
			less: {
				files: ['html/css/*.less'],
				tasks: ['less:process']
			},
			html: {
				files: ['html/*.html', 'html/css/*.css'],
				options: {
					livereload: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');

	grunt.registerTask('default', ['express:dev', 'watch']);
};
