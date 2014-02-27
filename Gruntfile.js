module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    typescript: {
      options: {
        module: 'commonjs',
        target: 'es5'
      },
      dist: {
        src: 'src/lib/**/*.ts'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['tests/**/*.js']
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: {
        files: {
          src: [
            'Gruntfile.js',
            'src/**/*.js',
          ]
        }
      },
      tests: {
        files: {
          src: ['tests/**/*.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-typescript-compile');

  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('build', ['typescript']);
  grunt.registerTask('default', ['build', 'test', 'jshint']);
};
