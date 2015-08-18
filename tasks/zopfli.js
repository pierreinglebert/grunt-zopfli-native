'use strict';

var async = require('async'),
  os = require('os');

module.exports = function(grunt) {

  var zopfli = require('./lib/zopfli')(grunt);

  grunt.registerMultiTask('zopfli', 'Compress files.', function() {
    zopfli.options = this.options({
      mode: null,
      extension: null,
      limit: os.cpus().length,
      zopfliOptions: {}
    });

    var done = this.async(),
      promises = [];

    this.files.forEach(function(filePair) {
      filePair.src.forEach(function(src) {
        if (grunt.file.isDir(src)) {
          return;
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
        promises.push(function(cb) {
          zopfli.compressFile(src, filePair.dest, zopfli.options.mode, zopfli.options.extension, zopfli.options.zopfliOptions, cb);
        })
      });
    });
    async.parallelLimit(promises, zopfli.options.limit, function(error) {
      done(!error);
    });
  });
};
