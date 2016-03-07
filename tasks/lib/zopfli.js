'use strict';

var fs = require('fs');
var path = require('path');
var zopfli = require('node-zopfli');

module.exports = function(grunt) {

  exports.detectMode = function(dest, ext) {
    var mode = 'gzip';
    ext = ext || path.extname(dest).replace('.', '');
    switch(ext) {
      case 'gz':
        mode = 'gzip';
        break;
      case 'zz':
        mode = 'zlib';
        break;
      case 'deflate':
        mode = 'deflate';
        break;
    }
    return mode;
  };

  exports.detectExtension = function(mode) {
    var extension = '';
    switch(mode) {
      case 'gzip':
        extension = 'gz';
        break;
      case 'zlib':
        extension = 'zz';
        break;
      case 'deflate':
        extension = 'deflate';
        break;
    }
    return extension;
  };

  exports.compressFile = function(src, dest, mode, ext, zopfliOptions, next) {

    grunt.file.mkdir(path.dirname(dest));

    if (ext && dest.indexOf(ext, dest.length - ext.length) === -1) {
      if (ext.charAt(0) !== '.') {
        ext = '.' + ext;
      }
      dest += ext;
    }

    var destStream = fs.createWriteStream(dest);
    var compressStream = null;

    if (mode === 'gzip') {
      compressStream = zopfli.createGzip(zopfliOptions);
    } else if (mode === 'deflate') {
      compressStream = zopfli.createDeflate(zopfliOptions);
    } else if (mode === 'zlib') {
      compressStream = zopfli.createZlib(zopfliOptions);
    } else {
      grunt.fail.warn('incorrect mode: ' + mode);
      next();
      return;
    }

    compressStream.on('error', function(err) {
      grunt.log.error(err);
      grunt.fail.warn('compress failed.');
      next();
    });

    destStream.on('close', function() {
      grunt.log.writeln('Created ' + String(dest).cyan);
      next();
    });
    fs.createReadStream(src).pipe(compressStream).pipe(destStream);
  };

  return exports;
};
