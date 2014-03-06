module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    typescript: {
      options: {
        module: 'commonjs',
        target: 'es5',
        removeComments: true
      },
      dist: {
        src: [
          'server.ts',
          'src/**/*.ts',
          'test/**/*.ts'
        ]
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
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
            '!src/public/bootstrap/**/*.js',
            '!src/public/bundle.js'
          ]
        }
      }
    },

    browserify: {
      dist: {
        files: {
          'src/public/bundle.js': [
            'src/admin/admin.js'
          ]
        }
      }
    },

    watch: {
      build: {
        files: ['<%= typescript.dist.src %>'],
        tasks: ['build']
      },
      browserify: {
        files: ['src/admin/*.js'],
        tasks: ['browserify']
      },
      test: {
        files: [
          '<%= mochaTest.test.src %>',
          '<%= jshint.src.files.src %>'
        ],
        tasks: ['test', 'jshint']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-typescript-compile');
  grunt.loadNpmTasks('grunt-npm-install');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('build', ['typescript']);
  grunt.registerTask('default', ['npm-install', 'build', 'browserify', 'test', 'jshint']);

  grunt.registerTask('teamcity', [], function() {
    grunt.task.run('build');
    grunt.task.run('browserify');
    // Change mocha runner one emitting results for TeamCity
    grunt.config.set('mochaTest.test.options.reporter', 'mocha-teamcity-reporter');
    grunt.task.run('test');
    grunt.task.run('jshint');
  });
};
