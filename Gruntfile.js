'use strict';

module.exports = function(grunt) {
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

    clean: {
      test: ['tmp']
    },

    // Configuration to be run (and then tested).
    zopfli: {
      gzip: {
        expand: true,
        cwd: 'test/fixtures/',
        src: ['**/*.{css,html,js}'],
        dest: 'tmp/gzip/',
        options: {
          mode: 'gzip'
        }
      },
      zlib: {
        expand: true,
        cwd: 'test/fixtures/',
        src: ['**/*.{css,html,js}'],
        dest: 'tmp/zlib/',
        options: {
          mode: 'zlib'
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
      gzipWithCustomExt: {
        expand: true,
        cwd: 'test/fixtures/',
        src: ['**/*'],
        dest: 'tmp/customExt/',
        options: {
          mode: 'gzip',
          extension: 'custom'
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

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('default', ['clean', 'jshint', 'zopfli', 'nodeunit']);
};
