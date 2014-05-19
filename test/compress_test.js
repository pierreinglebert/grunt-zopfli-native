var grunt = require('grunt');
var path = require('path');
var zlib = require('zlib');
var fs = require('fs');
var async = require('async');

exports.compress = {
  gzip: function(test) {
    test.expect(3);
    async.forEachSeries([
      'test.js',
      path.join('folder_one', 'one.css'),
      path.join('folder_two', 'two.js')
    ], function(file, next) {
      var expected = grunt.file.read(path.join('test', 'fixtures', file));
      var actual = '';
      fs.createReadStream(path.join('tmp', 'gzip', file + '.gz'))
        .pipe(zlib.createGunzip())
        .on('data', function(buf) {
          actual += buf.toString();
        })
        .on('end', function() {
          test.equal(actual, expected, 'should be equal to fixture after gunzipping');
          next();
        });
    }, test.done);
  },
  gzipCustomExt: function(test) {
    test.expect(3);
    [
      'test.js',
      path.join('folder_one', 'one.css'),
      path.join('folder_two', 'two.js')
    ].forEach(function(file) {
      var expected = path.join('tmp', 'customExt', file + '.custom');
      test.ok(grunt.file.exists(expected), 'should of had a correct extension.');
    });
    test.done();
  },
  zlib: function(test) {
    test.expect(3);
    async.forEachSeries([
      'test.js',
      path.join('folder_one', 'one.css'),
      path.join('folder_two', 'two.js')
    ], function(file, next) {
      var expected = grunt.file.read(path.join('test', 'fixtures', file));
      var actual = '';
      fs.createReadStream(path.join('tmp', 'zlib', file + '.zz'))
        .pipe(zlib.createInflate())
        .on('data', function(buf) {
          actual += buf.toString();
        })
        .on('end', function() {
          test.equal(actual, expected, 'should be equal to fixture after inflating');
          next();
        });
    }, test.done);
  },
  deflate: function(test) {
    test.expect(3);
    async.forEachSeries([
      'test.js',
      path.join('folder_one', 'one.css'),
      path.join('folder_two', 'two.js')
    ], function(file, next) {
      var expected = grunt.file.read(path.join('test', 'fixtures', file));
      var actual = '';
      fs.createReadStream(path.join('tmp', 'deflate', file + '.deflate'))
        .pipe(zlib.createInflateRaw())
        .on('data', function(buf) {
          actual += buf.toString();
        })
        .on('end', function() {
          test.equal(actual, expected, 'should be equal to fixture after inflateRaw-ing');
          next();
        });
    }, test.done);
  }
};
