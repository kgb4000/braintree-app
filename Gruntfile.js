module.exports = function(grunt) {
	'use strict';

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-ngmin');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-bower-install');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-rev');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-script-inject');
	grunt.loadNpmTasks('grunt-protractor-runner');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-mocha-test');


	grunt.initConfig({

		// Project settings
		filepaths : {
			// configuarble paths
			app: require('./bower.json').appPath || 'client',
			test: 'test',
			dist: 'dist',
			server: 'server'
		},
		
		shell: {
			watch: {
				options: {stdout:true},
				command: 'grunt connect:server & grunt dev & grunt karma:watch'
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				keepalive: true,
				hostname: 'localhost'
			},
			dev: {
				options: {
					base: '<%= filepaths.app %>'
				}
			},
			dist: {
				options: {
					base: '<%= filepaths.dist %>'
				}
			},
			server: {
				options: {
					keepalive: true
				}
			}
		},

		watch: {
			js:{
				files: [
					'<%= filepaths.app %>/js/{,*/}*.js', 
					'<%= filepaths.app %>/css/{,*/}*.css', 
					'<%= filepaths.app %>/index.html'
				],
				tasks: ['newer:jshint:all'],
				options: { livereload: true }
			},
			tests: {
				files: [
					'<%= filepaths.app %>/js/{,*/}*.js', 
					'<%= filepaths.app %>/css/{,*/}*.css', 
					'<%= filepaths.app %>/index.html',
					'<%= filepaths.test %>/e2e/{,*/}*.js',
					'<%= filepaths.test %>/unit/{,*/}*.js',
					'Gruntfile.js'
				],
				tasks: ['newer:jshint:test']
			},
			server: {
				options: {
					spawn: false
				},
				files: [
					'<%= filepaths.server %>/**/*.js'
				],
				tasks: ['mochaTest']
			},
			gruntfile: {
				files: ['Gruntfile.js'],
				options: { livereload: true }
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options:{
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'<%= filepaths.app %>/js/{,*/}*.js'
			],
			test: {
				src: [
					'<%= filepaths.app %>/js/{,*/}*.js',
					'<%= filepaths.test %>/unit/{,*/}*.js',
					'<%= filepaths.test %>/e2e/{,*/}*.js'
				]
			}, 
			
			dist: [
				'<%= filepaths.dist %>/js/{,*/}*.js'
			]
		},

		protractor: {
			e2e: {
				configFile: "<%= filepaths.test %>/protractor.conf.js"
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= filepaths.dist %>/*',
						'!<%= filepaths.dist %>/.git*',
						'<%= filepaths.app %>/indexDev.html'
					]
				}]
			},
			server: '.tmp'
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			html: '<%= filepaths.app %>/index.html',
			options: {
				dest: '<%= filepaths.dist %>'
			}
		},

		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			html: ['<%= filepaths.dist %>/{,*/}*.html'],
			css: ['<%= filepaths.dist %>/css/{,*/}*.css'],
			options: {
				assetsDirs: ['<%= filepaths.dist %>']
			}
		},

		// Allow the use of non-minsafe AngularJS files. Automatically makes it
		// minsafe compatible so Uglify does not destroy the ng references
		ngmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/concat/js',
					src: '*.js',
					dest: '.tmp/concat/js'
				}]
			}
		},

		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= filepaths.app %>',
						dest: '<%= filepaths.dist %>',
						src: [
							'*.{ico,png,txt}',
							'*.html',
							'partials/{,*/}*.html',
							'font/**/*',
							'images/{,*/}*.{gif,png,jpg,jpeg}',
							'fonts/*',
							'data/*'
						]
					}, 
					{
						expand: true,
						cwd: '.tmp/images',
						dest: '<%= filepaths.dist %>/images',
						src: ['generated/*']
					}
				]
			},
			mocks: {
				files: [
					{
						expand:true,
						cwd: '<%= filepaths.app %>',
						src: ['mock/*'],
						dest: '<%= filepaths.dist %>'
						
					}
				]
			}
		},

		// Renames files for browser caching purposes
		rev: {
			dist: {
				files: {
					src: [
						'<%= filepaths.dist %>/js/{,*/}*.js',
						'<%= filepaths.dist %>/styles/{,*/}*.css',
						'<%= filepaths.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
						'<%= filepaths.dist %>/styles/fonts/*'
					]
				}
			}
		},
		
		replace: {
			mocks: {
				options: {
					patterns: [
						{
							match: /\"filepathsModule\"/g,
							replacement: '"MockModule"',
							expression: true
						}
					],
					force: true
				},
				files: [
					{
						src: '<%= filepaths.app %>/index.html', 
						dest: '<%= filepaths.app %>/indexDev.html'
					}
				]
			}
			
		},
		
		scriptinject: {
			dev: {
				srcs: [
					'<%= filepaths.app %>/js/**/*.js',
					'<%= filepaths.app %>/bower_components/angular-mocks/angular-mocks.js',
					'<%= filepaths.app %>/js/**/*Mock*.js'
				], //order is important if this script will be concated and minified
				html: '<%= filepaths.app %>/index.html', //file that as the block comment to look for a place to insert the script tags
				without: '<%= filepaths.app %>/' //this strips 'src/' off the path in the script tags that are placed in the html
			},
			prod: {
				srcs: [
					'<%= filepaths.app %>/js/**/**/*Module.js',
					'<%= filepaths.app %>/js/**/**/*.js'
				], //order is important if this script will be concated and minified
				html: '<%= filepaths.app %>/index.html', //file that as the block comment to look for a place to insert the script tags
				without: '<%= filepaths.app %>/' //this strips 'src/' off the path in the script tags that are placed in the html
			}
		},

		// Automatically inject Bower components into the app
		bowerInstall: {
			app: {
				expand: true,
				src: '<%= filepaths.app %>/index.html',
				ignorePath: '<%= filepaths.app %>/',
				fileTypes: {
					html: {
						replace: {
							js: '<script src="{{filePath}}"></script>',
							css: '<link rel="stylesheet" href="{{filePath}}" />'
						}
					}
				}
			}
		},
		
		karma: {
			unit: {
				configFile: '<%= filepaths.test %>/karma.conf.js'
			}
		},
		
		mochaTest: {
			test: {
				options:{
					reporter: 'spec',
					clearRequireCache: true
				},
				src: '<%= filepaths.server %>/'
			}
		}

	});

	//default
	grunt.registerTask('default', ['setup']);

	grunt.registerTask('setup', ['clean:dist', 'bowerInstall', 'scriptinject:dev']);

	

	grunt.registerTask('build', [
					'clean:dist',
					'bowerInstall',
					'scriptinject:prod',
					'useminPrepare',
					'concat',
					'ngmin',
					'copy:dist',
					'cssmin',
					'uglify',
					'rev',
					'usemin'
					]);

	grunt.registerTask('serve', [
					'clean:server',
					'bowerInstall',
					'connect:livereload',
					'watch'
					]);
};