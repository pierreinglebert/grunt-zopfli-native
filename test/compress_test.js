var grunt = require('grunt');
var path = require('path');
var zlib = require('zlib');
var fs = require('fs');
var tar = require('tar');
var zopfli = require('../tasks/lib/zopfli')(grunt);

exports.compress = {
  gzip: function(test) {
    test.expect(3);
    grunt.util.async.forEachSeries([
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
      'test',
      'folder_one/one',
      'folder_two/two'
    ].forEach(function(file) {
      var expected = path.join('tmp', 'gzipCustomExt', file + '.gz.js');
      test.ok(grunt.file.exists(expected), 'should of had a correct extension.');
    });
    test.done();
  },
  zlib: function(test) {
    test.expect(3);
    grunt.util.async.forEachSeries([
      'test.js',
      path.join('folder_one', 'one.css'),
      path.join('folder_two', 'two.js')
    ], function(file, next) {
      var expected = grunt.file.read(path.join('test', 'fixtures', file));
      var actual = '';
      fs.createReadStream(path.join('tmp', 'deflate', file + '.zz'))
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
    grunt.util.async.forEachSeries([
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