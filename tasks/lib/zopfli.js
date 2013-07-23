var fs = require('fs');
var path = require('path');
var prettySize = require('prettysize');
var zopfli = require('node-zopfli');
var archiver = require('archiver');
var Readable = require('lazystream').Readable;

module.exports = function(grunt) {
  'use strict';

  var exports = {
    options: {}
  };

  // 1 to 1 gziping of files
  exports.gzip = function(files, done) {
    exports.singleFile(files, zopfli.createGzip, 'gz', done);
  };

  // 1 to 1 deflate of files
  exports.deflate = function(files, done) {
    exports.singleFile(files, zopfli.createZlib, 'deflate', done);
  };

  // 1 to 1 deflateRaw of files
  exports.deflateRaw = function(files, done) {
    exports.singleFile(files, zopfli.createDeflate, 'deflate', done);
  };

  // 1 to 1 compression of files, expects a compatible zlib method to be passed in, see above
  exports.singleFile = function(files, algorithm, extension, done) {
    grunt.util.async.forEachSeries(files, function(filePair, nextPair) {
      grunt.util.async.forEachSeries(filePair.src, function(src, nextFile) {
        // Must be a file
        if (grunt.file.isDir(src)) {
          return nextFile();
        }

        // Append ext if the specified one isnt there
        if (typeof filePair.orig.ext === 'undefined') {
          var ext = '.' + extension;
          // if the chosen ext is different then the dest ext lets use it
          if (String(filePair.dest).slice(-ext.length) !== ext) {
            filePair.dest += ext;
          }
        }

        // Ensure the dest folder exists
        grunt.file.mkdir(path.dirname(filePair.dest));

        var srcStream = fs.createReadStream(src);
        var destStream = fs.createWriteStream(filePair.dest);
        var compressor = algorithm.call(zopfli, exports.options);

        compressor.on('error', function(err) {
          grunt.log.error(err);
          grunt.fail.warn(algorithm + ' failed.');
          nextFile();
        });

        destStream.on('close', function() {
          grunt.log.writeln('Created ' + String(filePair.dest).cyan + ' (' + exports.getSize(filePair.dest) + ')');
          nextFile();
        });

        srcStream.pipe(compressor).pipe(destStream);
      }, nextPair);
    }, done);
  };

  exports.getSize = function(filename, pretty) {
    var size = 0;
    if (typeof filename === 'string') {
      try {
        size = fs.statSync(filename).size;
      } catch (e) {}
    } else {
      size = filename;
    }
    if (pretty !== false) {
      if (!exports.options.pretty) {
        return size + ' bytes';
      }
      return prettySize(size);
    }
    return Number(size);
  };

  exports.autoDetectMode = function(dest) {
    if (exports.options.mode) {
      return exports.options.mode;
    }
    if (!dest) {
      return 'gzip';
    }
    var ext = path.extname(dest).replace('.', '');
    if (ext === 'gz') {
      return 'gzip';
    } else {
      return ext;
    }
  };

  exports.unixifyPath = function(filepath) {
    if (process.platform === 'win32') {
      return filepath.replace(/\\/g, '/');
    } else {
      return filepath;
    }
  };

  return exports;
};