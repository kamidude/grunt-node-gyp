var defaultArgv, gyp, manualRebuild;

gyp = require('node-gyp')();

defaultArgv = ['node', '.', '--loglevel=silent'];

manualRebuild = function(callback) {
  return gyp.commands.clean([], function(error) {
    if (error) {
      callback(error);
    }
    return gyp.commands.configure([], function(error) {
      if (error) {
        callback(error);
      }
      return gyp.commands.build([], callback);
    });
  });
};

module.exports = function(grunt) {
  return grunt.registerMultiTask('gyp', 'Run node-gyp commands from Grunt.', function() {
    var argv, done, gypCallback, options;
    done = this.async();
    options = this.options({
      debug: false
    });
    argv = defaultArgv.slice();
    if (options.debug) {
      argv.push('--debug');
    } else {
      argv.push('--no-debug');
    }
    gyp.parseArgv(argv);
    gypCallback = function(error) {
      if (error) {
        return done(false);
      } else {
        return done();
      }
    };
    if (!this.data.command) {
      this.data.command = 'rebuild';
    }
    switch (this.data.command) {
      case 'clean':
        return gyp.commands.clean([], gypCallback);
      case 'configure':
        return gyp.commands.configure([], gypCallback);
      case 'build':
        return gyp.commands.build([], gypCallback);
      case 'rebuild':
        return manualRebuild(gypCallback);
    }
  });
};
