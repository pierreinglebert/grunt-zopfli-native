module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
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
      gzipWithFolders: {
        expand: true,
        cwd: 'test/fixtures/',
        src: ['**/*'],
        dest: 'tmp/gzip/',
        options: {
          mode: 'gzip'
        }
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['jshint', 'zopfli']);
};