module.exports = function(grunt) {

	// project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		// concurrent tasks
		concurrent:  {
			dev: {
				tasks: ["shell", "watch:scss", "watch:clientJs", "watch:styles", "watch:serverJs", "nodemon"],
				options: {
					logConcurrentOutput: true
				}
			},
			clientWatcher: {
				tasks: ["watch:scss", "watch:clientJs", "watch:styles"],
				options: {
					logConcurrentOutput: true
				}
			},
			serverWatcher: {
				tasks: ["watch:serverJs", "nodemon"],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		// --------------------- server setup ---------------------
		// start mongod with a project specific path
		shell: {
			mongodb: {
				command: 'mongod --dbpath ./src/server/data/db',
				options: {
					async: true,
					stdout: true,
					stderr: true,
					failOnError: true,
					execOptions: {
						cwd: '.'
					}
				}
			}
		},
		// start and watch node server app
		nodemon: {
			devel: {
				script: "./src/server/server.js",
				options: {
					watch: ["src/server"]
				}
			}
		},

		// --------------------- client setup ---------------------
		// client watcher
		watch: {
			// watch and process scss files, run auto prefixer
			scss: {
				files: ["src/client/scss/**/*.scss"],
				tasks: ["sass:dev", "autoprefixer:dev"]
			},

			// lint js files
			clientJs: {
				files: ["src/client/js/**/*.js"],
				tasks: ["jshint:clientHint"]
			},

			// livereload on html, js or css file changes
			styles: {
				files: ["src/client/css/styles.css", "src/client/**/*.html", "src/client/js/**/*.js"],
				options : {
					livereload: true
				}
			},

			serverJs:  {
				files: ["src/server/**/*js"],
				tasks: ["jshint:serverHint"]
			}
		},

		// rename css
		sass: {
			dev: {
				files: {
					"src/client/css/styles-unprefixed.css": "src/client/scss/styles.scss"
				}
			}
		},
		// prefix all css attributes that need browser prefixes
		autoprefixer: {
			dev: {
				src: "src/client/css/styles-unprefixed.css",
				dest: "src/client/css/styles.css"
			}
		},

		clean: {
			dist: {
				src: ["dist"]
			},
			stuff: {
				src: ["dist/client/scss", "dist/client/js", "dist/client/css/styles.css", "dist/client/css/styles-unprefixed.css"]
			}
		},

		copy: {
			options: {
				noProcess: ["src/client/scss"]
			},
			client: {
				files: [
					{expand: true, cwd: "src/client/", src: ["**"], dest: "dist/client/"}
				]
			},
			server: {
				files: [
					{expand: true, cwd: "src/server/", src: ["server.js", "package.json", "app/**/*", "data/db"], dest: "dist/server/"}
				]
			}
		},
		// process index.html to clean up files needed for development
		usemin: {
			html: "dist/client/index.html"
		},
		// minify css
		cssmin: {
			dist: {
				files: {
					"dist/client/css/styles.min.css": ["src/client/css/styles.css"]
				}
			}
		},
		// minify and compress js files
		uglify: {
			dist: {
				src: [
					"src/client/js/*.js",
					"src/client/js/factories/*.js",
					"src/client/js/controllers/*.js"
				],
				dest: "dist/client/js/app.min.js"
			}
		},
		// lint all javascript files
		jshint: {
			clientHint: ["src/client/js/**/*.js", "!src/client/js/angular/*.js"],
			serverHint: ["src/server/**/*.js"]
		}

	});

	// load plugins
	grunt.loadNpmTasks("grunt-concurrent");
	grunt.loadNpmTasks("grunt-shell");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-sass");
	grunt.loadNpmTasks("grunt-autoprefixer");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-usemin");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-nodemon");

	// define tasks
	grunt.registerTask("all", ["concurrent:dev"]);
	grunt.registerTask("1 - db", ["shell"]);
	grunt.registerTask("2 - server", ["concurrent:serverWatcher"]);
	grunt.registerTask("3 - client", ["concurrent:clientWatcher"]);
	grunt.registerTask("build", [
		"clean:dist",
		"jshint:clientHint",
		"jshint:serverHint",
		"sass:dev",
		"autoprefixer:dev",
		"cssmin:dist",
		"copy:client",
		"copy:server",
		"clean:stuff",
		"usemin",
		"uglify:dist"
	]);
};