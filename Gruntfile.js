module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      test: ['tmp']
    },

    // Configuration to be run (and then tested).
    compress: {
      gzip: {
        expand: true,
        cwd: 'test/fixtures/',
        src: ['**/*.{css,html,js}'],
        dest: 'tmp/gzip/',
        options: {
          mode: 'gzip'
        }
      },
      deflate: {
        expand: true,
        cwd: 'test/fixtures/',
        src: ['**/*.{css,html,js}'],
        dest: 'tmp/deflate/',
        options: {
          mode: 'deflate'
        }
      },
      deflateRaw: {
        expand: true,
        cwd: 'test/fixtures/',
        src: ['**/*.{css,html,js}'],
        dest: 'tmp/deflateRaw/',
        options: {
          mode: 'deflateRaw'
        }
      },
      gzipWithFolders: {
        expand: true,
        cwd: 'test/fixtures/',
        src: ['**/*'],
        dest: 'tmp/gzip/',
        options: {
          mode: 'gzip'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'compress', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test', 'build-contrib']);
};