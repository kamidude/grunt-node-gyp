gyp = require('node-gyp')()

# The first two arguments are apparently necessary as else nopt won’t include
# loglevel as an option.
defaultArgv = ['node', '.', '--loglevel=silent']

# It is necessary to execute rebuild manually as calling node-gyp’s rebuild
# programmatically fires the callback function too early.
manualRebuild = (callback) ->
	gyp.commands.clean [], (error) ->
		callback(error) if error

		gyp.commands.configure [], (error) ->
			callback(error) if error

			gyp.commands.build [], callback

module.exports = (grunt) ->
	grunt.registerMultiTask 'gyp', 'Run node-gyp commands from Grunt.', ->
		done = @async()

		options = @options
			debug: false

		argv = defaultArgv.slice()

		# If we do not push '--no-debug' node-gyp might keep the debug option on
		# as it was set on an earlier run.
		if options.debug then argv.push '--debug' else argv.push '--no-debug'

		gyp.parseArgv argv

		gypCallback = (error) -> if error then done(false) else done()

		@data.command = 'rebuild' if !@data.command

		switch @data.command
			when 'clean'     then gyp.commands.clean [], gypCallback
			when 'configure' then gyp.commands.configure [], gypCallback
			when 'build'     then gyp.commands.build [], gypCallback
			when 'rebuild'   then manualRebuild gypCallback
