'use strict';

var async = require('async');

module.exports = function(grunt) {

  var zopfli = require('./lib/zopfli')(grunt);

  grunt.registerMultiTask('zopfli', 'Compress files.', function() {
    zopfli.options = this.options({
      mode: null,
      extension: null,
      zopfliOptions: {}
    });

    var done = this.async();

    async.forEachSeries(this.files, function(filePair, nextPair) {
      async.forEachSeries(filePair.src, function(src, nextFile) {
        if (grunt.file.isDir(src)) {
          return nextFile();
        }

        if(zopfli.options.mode === null) {
          zopfli.options.mode = zopfli.detectMode(filePair.dest, zopfli.options.extension);
        }

        if(zopfli.options.extension === null) {
          zopfli.options.extension = zopfli.detectExtension(zopfli.options.mode);
        }

        if (grunt.util._.include(['gzip', 'zlib', 'deflate'], zopfli.options.mode) === false) {
          grunt.fail.warn('Mode ' + zopfli.options.mode + ' is not supported.');
        }
        zopfli.compressFile(src, filePair.dest, zopfli.options.mode, zopfli.options.extension, zopfli.options.zopfliOptions, nextFile);
      }, nextPair);
    }, function(error) {
      done(!error);
    });
  });
};
