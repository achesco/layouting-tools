module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-spritesmith');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-contrib-watch');

	var configFiles = {
		'jade': [
			{
				expand: true,
				cwd: 'html/jade/',
				src: ['*.jade', '**/*.jade'],
				dest: 'html/',
				ext: '.html',
				filter: function (src) {
					return src.indexOf('\\_') === -1 && src.indexOf('/_') === -1;
				}
			}
		]
	};

	grunt.initConfig({
		express: {
			dev: {
				options: {
					script: 'server.js'
				}
			}
		},
		sprite: {
			all: {
				engine: 'phantomjs',
				src: 'html/css/less/icons/*.png',
				destImg: 'html/css/icons.png',
				destCSS: 'html/css/less/_icons.less',
				//cssFormat: 'css',
				algorithm: 'binary-tree',
				imgPath: 'icons.png',
				padding: 1
			}
		},
		less: {
			process: {
				options: {
					paths: ['html/css/less'], // directory to scan for '@import' directive
					relativeUrls: true, // modifies urls to be relative
					ieCompat: true,
					compress: false, // remove whitespace
					cleancss: false, // compress using clean-css
					sourceMap: true,
					sourceMapRootpath: 'http://localhost:8080/'
				},
				files: {
					"html/css/main.css": "html/css/less/main.less"
				}
			}
		},
		jade: {
			compile: {
				options: {
					pretty: true,
					data: function(dest, src){
						return {
							config: {
								'baseUrl': '/'
							},
							from: src,
							to: dest
						};
					}
				},
				files: configFiles['jade']
			}
		},
		watch: {
			jade: {
				files: ['html/jade/*.jade', 'html/jade/**/*.jade'],
				tasks: ['jade'],
				options: {
					spawn: false,
					livereload: true
				}
			},
			less: {
				files: ['html/css/less/*.less'],
				tasks: ['less:process'],
				options: {
					spawn: false,
					livereload: true
				}
			},
			html: {
				files: ['html/*.html', 'html/!(css|js|i|fonts|src|jade)/*.html', 'html/css/*.css'],
				options: {
					livereload: true
				}
			},
			sprite: {
				files: "html/css/less/icons/*.png",
				tasks: "sprite",
				options: {
					spawn: false,
					livereload: true
				}
			}
		}
	});

	grunt.event.on('watch', function(action, filepath){
		var i, j, l, k, src,
			fConfig,
			tasks = ['jade'];

		for(i = 0, l = tasks.length; i < l; i++){
			fConfig = configFiles[tasks[i]].slice(0);
			if( grunt.file.isMatch( grunt.config('watch.' + tasks[i] + '.files'), filepath ) ){
				console.log('\n');

				if(filepath.indexOf('\\_') === -1 && filepath.indexOf('/_') === -1){
					for(j = 0, k = fConfig.length; j < k; j++){
						src = filepath.replace(/\\/g, '/');
						src = src.replace(fConfig[j].cwd, '');
						fConfig[j].src = [src];
					}
				}
				switch(tasks[i]){
					case 'jade':
						grunt.config('jade.compile.options.files', fConfig);
						break;
					case 'less':
						grunt.config('less.process.files', fConfig);
						break;
				}
			}
		}
	});

	grunt.registerTask('default', [
		'express:dev'
		, 'sprite'
		, 'less:process'
		, 'jade'
		, 'watch'
	]);
};
