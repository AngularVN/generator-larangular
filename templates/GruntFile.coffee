"use strict"
LIVERELOAD_PORT = 35728
proxySnippet = require("grunt-connect-proxy/lib/utils").proxyRequest
lrSnippet = require("connect-livereload")(port: LIVERELOAD_PORT)

# var conf = require('./conf.'+process.env.NODE_ENV);
mountFolder = (connect, dir) ->
	connect.static require("path").resolve(dir)


# # Globbing
# for performance reasons we're only matching one level down:
# 'test/spec/{,*}*.js'
# use this if you want to recursively match all subfolders:
# 'test/spec/**/*.js'
module.exports = (grunt) ->
	require("load-grunt-tasks") grunt
	require("time-grunt") grunt

	# configurable paths
	yeomanConfig =
		app: "source"
		dist: "public"

	try
		yeomanConfig.app = require("./bower.json").appPath or yeomanConfig.app
	grunt.initConfig
		yeoman: yeomanConfig
		watch:
			coffee:
				files: ["<%%= yeoman.app %>/scripts/**/*.coffee"]
				tasks: ["coffee:dist"]

			compass:
				files: ["<%%= yeoman.app %>/styles/**/*.{scss,sass}"]
				tasks: ["compass:server"]

			less:
				files: ["<%%= yeoman.app %>/styles-less/**/*.less"]
				tasks: ["less:server"]

			livereload:
				options:
					livereload: LIVERELOAD_PORT

				files: [
					"<%%= yeoman.app %>/index.html"
					"<%%= yeoman.app %>/views/**/*.html"
					"<%%= yeoman.app %>/styles/**/*.scss"
					"<%%= yeoman.app %>/styles-less/**/*.less"
					".tmp/styles/**/*.css"
					"{.tmp,<%%= yeoman.app %>}/scripts/**/*.js"
					"<%%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}"
				]

		connect:
			proxies: [
				context: "/<%= baseName %>"
				host: "localhost"
				port: 8080
				https: false
				changeOrigin: false
			]
			options:
				port: 9000

				# Change this to '0.0.0.0' to access the server from outside.
				hostname: "localhost"

			livereload:
				options:
					base: ["<%%= yeoman.app %>"]
					middleware: (connect) ->
						[
							proxySnippet
							lrSnippet
							mountFolder(connect, ".tmp")
							mountFolder(connect, yeomanConfig.app)
						]

			test:
				options:
					middleware: (connect) ->
						[mountFolder(connect, ".tmp"), mountFolder(connect, "test")]

			dist:
				options:
					middleware: (connect) ->
						[mountFolder(connect, yeomanConfig.dist)]

		open:
			server:
				url: "http://localhost:<%%= connect.options.port %>"

		clean:
			dist:
				files: [
					dot: true
					src: [".tmp", "<%%= yeoman.dist %>/*", "!<%%= yeoman.dist %>/.git*"]
				]

			server: ".tmp"

		jshint:
			options:
				jshintrc: ".jshintrc"

			all: ["Gruntfile.js", "<%%= yeoman.app %>/js/**/*.js"]

		compass:
			options:
				sassDir: "<%%= yeoman.app %>/styles"
				cssDir: ".tmp/styles"
				generatedImagesDir: ".tmp/styles/ui/images/"
				imagesDir: "<%%= yeoman.app %>/styles/ui/images/"
				javascriptsDir: "<%%= yeoman.app %>/scripts"
				fontsDir: "<%%= yeoman.app %>/fonts"
				importPath: "<%%= yeoman.app %>/bower_components"
				httpImagesPath: "styles/ui/images/"
				httpGeneratedImagesPath: "styles/ui/images/"
				httpFontsPath: "fonts"
				relativeAssets: true
			dist:
				options:
					outputStyle: 'compressed'
					debugInfo: false
					noLineComments: true
			server:
				options:
					debugInfo: true
			forvalidation:
				options:
					debugInfo: false
					noLineComments: false
		# if you want to use the compass config.rb file for configuration:
		# compass:
		#   dist:
		#     options:
		#       config: 'config.rb'

		less:
			server:
				options:
					strictMath: true
					dumpLineNumbers: true
					sourceMap: true
					sourceMapRootpath: ""
					outputSourceFiles: true
				files: [
					expand: true
					cwd: "<%%= yeoman.app %>/styles-less"
					src: "app.less"
					dest: ".tmp/styles"
					ext: ".css"
				]
			dist:
				options:
					cleancss: true,
					report: 'min'
				files: [
					expand: true
					cwd: "<%%= yeoman.app %>/styles-less"
					src: "app.less"
					dest: ".tmp/styles"
					ext: ".css"
				]


		coffee:
			server:
				options:
					sourceMap: true
					# join: true,
					sourceRoot: ""
				files: [
					expand: true
					cwd: "<%%= yeoman.app %>/scripts"
					src: "**/*.coffee"
					dest: ".tmp/scripts"
					ext: ".js"
				]
			dist:
				options:
					sourceMap: false
					sourceRoot: ""
				files: [
					expand: true
					cwd: "<%%= yeoman.app %>/scripts"
					src: "**/*.coffee"
					dest: ".tmp/scripts"
					ext: ".js"
				]

		useminPrepare:
			html: "<%%= yeoman.app %>/index.html"
			options:
				dest: "<%%= yeoman.dist %>"
				flow:
					steps:
						js: ["concat"]
						css: ["concat"]
					post: []


		cssmin:
			dist:
				files: [
					expand: false
					cwd: '<%%= yeoman.dist %>/css/'
					src: ['*.css', '!*.min.css']
					dest: '<%%= yeoman.dist %>/css/'
					ext: '.css'
				]

		usemin:
			html: ["<%%= yeoman.dist %>/**/*.html", "!<%%= yeoman.dist %>/bower_components/**"]
			css: ["<%%= yeoman.dist %>/css/*.css"]
			options:
				dirs: ["<%%= yeoman.dist %>"]

		htmlmin:
			dist:
				options: {}

				#removeCommentsFromCDATA: true,
				#                    // https://github.com/yeoman/grunt-usemin/issues/44
				#                    //collapseWhitespace: true,
				#                    collapseBooleanAttributes: true,
				#                    removeAttributeQuotes: true,
				#                    removeRedundantAttributes: true,
				#                    useShortDoctype: true,
				#                    removeEmptyAttributes: true,
				#                    removeOptionalTags: true
				files: [
					expand: true
					cwd: "<%%= yeoman.app %>"
					src: ["*.html", "views/*.html"]
					dest: "<%%= yeoman.dist %>"
				]


		# Put files not handled in other tasks here
		copy:
			dist:
				files: [
					expand: true
					dot: true
					cwd: "<%%= yeoman.app %>"
					dest: "<%%= yeoman.dist %>"
					src: [
						".htaccess"
						"404.html"
						"robots.txt"
						"favicon.ico"
						"index.php"
						# bower components that has image, font dependencies
						"bower_components/font-awesome/css/*"
						"bower_components/font-awesome/fonts/*"
						"bower_components/weather-icons/css/*"
						"bower_components/weather-icons/font/*"

						"fonts/**/*"
						"i18n/**/*"
						"images/**/*"
						"styles/bootstrap/**/*"
						"styles/fonts/**/*"
						"styles/img/**/*"
						"styles/ui/images/**/*"
						"views/**/*"
					]
				,
					expand: true
					cwd: ".tmp"
					src: ["styles/**", "assets/**"]
					dest: "<%%= yeoman.dist %>"
				,
					expand: true
					cwd: ".tmp/images"
					src: ["generated/*"]
					dest: "<%%= yeoman.dist %>/images"
				]

			styles:
				expand: true
				cwd: "<%%= yeoman.app %>/styles"
				dest: ".tmp/styles/"
				src: "**/*.css"

		concurrent:
			sassServer: ["coffee:server", "compass:server", "copy:styles"]
			sassDist: ["coffee:dist", "compass:dist", "copy:styles", "htmlmin"]
			lessServer: ["coffee:server", "less:server", "copy:styles"]
			lessDist: ["coffee:dist", "less:dist", "copy:styles", "htmlmin"]

		concat:
			options:
				separator: grunt.util.linefeed + ';' + grunt.util.linefeed

		uglify:
			options:
				mangle: false
				compress:
					drop_console: true
			dist:
				files:
					"<%%= yeoman.dist %>/js/app.js": [".tmp/**/*.js", "<%%= yeoman.app %>/scripts/**/*.js"]


	grunt.registerTask "sassServer", (target) ->
		return grunt.task.run([
			"buildSass"
			"open"
			"connect:dist:keepalive"])  if target is "dist"
		grunt.task.run [
			"configureProxies"
			"clean:server"
			"concurrent:sassServer"
			"connect:livereload"
			"open"
			"watch"]

	grunt.registerTask "lessServer", (target) ->
		return grunt.task.run([
			"buildLess"
			"open"
			"connect:dist:keepalive"])  if target is "dist"
		grunt.task.run [
			"configureProxies"
			"clean:server"
			"concurrent:lessServer"
			"connect:livereload"
			"open"
			"watch"]

	grunt.registerTask "buildSass", [
		"clean:dist"
		"useminPrepare"
		"concurrent:sassServer"
		"copy:dist"
		"concat"
		"uglify"
		"usemin"]
	grunt.registerTask "buildLess", [
		"clean:dist"
		"useminPrepare"
		"concurrent:lessDist"
		"copy:dist"
		"concat"
		"uglify"
		"cssmin"
		"usemin"]
	grunt.registerTask "build", ["buildLess"]
	grunt.registerTask "default", ["lessServer"]