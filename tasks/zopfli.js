module.exports = function(grunt) {
  'use strict';

  var zopfli = require('./lib/zopfli')(grunt);

  grunt.registerMultiTask('zopfli', 'Compress files.', function() {
    zopfli.options = this.options({
    });

    zopfli.options.mode = zopfli.options.mode || compress.autoDetectMode(compress.options.archive);
    grunt.verbose.writeflags(compress.options, 'Options');

    if (grunt.util._.include(['gzip', 'deflate', 'deflateRaw'], compress.options.mode) === false) {
      grunt.fail.warn('Mode ' + String(compress.options.mode).cyan + ' not supported.');
    }

    if (compress.options.mode === 'gzip' || compress.options.mode.slice(0, 7) === 'deflate') {
      compress[compress.options.mode](this.files, this.async());
    } else {
      compress.tar(this.files, this.async());
    }
  });
};