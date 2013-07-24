module.exports = function(grunt) {
  'use strict';

  var zopfli = require('./lib/zopfli')(grunt);

  grunt.registerMultiTask('zopfli', 'Compress files.', function() {
    zopfli.options = this.options({
    });

    zopfli.options.mode = zopfli.options.mode || zopfli.autoDetectMode(zopfli.options.archive);
    grunt.verbose.writeflags(zopfli.options, 'Options');

    if (grunt.util._.include(['gzip', 'deflate', 'deflateRaw'], zopfli.options.mode) === false) {
      grunt.fail.warn('Mode ' + String(zopfli.options.mode).cyan + ' not supported.');
    }

    if (zopfli.options.mode === 'gzip' || zopfli.options.mode.slice(0, 7) === 'deflate') {
      zopfli[zopfli.options.mode](this.files, this.async());
    } else {
      zopfli.tar(this.files, this.async());
    }
  });
};