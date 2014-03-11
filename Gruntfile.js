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
        src: [
          'test/**/*.js',
          '!test/integration/**/*.js'
        ]
      },
      integration: {
        options: {
          reporter: 'spec'
        },
        src: [
          'test/integration/**/*.js'
        ]
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
            '!src/js/**/*.js',
            '!src/public/js/bundle.js'
          ]
        }
      }
    },

    concat: {
      admin: {
        src: [
          'src/css/bootstrap/bootstrap.css',
          'src/css/bootstrap/bootstrap-theme.css',
          'src/css/common.css',
          'src/css/admin-*.css'
        ],
        dest: 'src/public/css/admin.css'
      },
      public: {
        src: [
          'src/css/bootstrap/*.css',
          'src/css/common.css',
          'src/css/public-*.css'
        ],
        dest: 'src/public/css/public.css'
      }
    },

    browserify: {
      dist: {
        files: {
          'src/public/js/bundle.js': [
            'src/admin/admin.js'
          ]
        }
      }
    },

    watch: {
      build: {
        files: [
          '<%= typescript.dist.src %>',
          '<%= concat.admin.src %>',
          '<%= concat.public.src %>'
        ],
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
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', ['mochaTest:test']);
  grunt.registerTask('integrationTest', ['mochaTest:integration']);
  grunt.registerTask('build', [
    'typescript',
    'browserify',
    'concat'
  ]);
  grunt.registerTask('default', [
    'npm-install',
    'build',
    'test',
    'jshint'
  ]);

  grunt.registerTask('teamcity', [], function() {
    grunt.task.run('build');
    grunt.task.run('browserify');
    // Change mocha runner one emitting results for TeamCity
    grunt.config.set('mochaTest.test.options.reporter', 'mocha-teamcity-reporter');
    grunt.task.run('test');
    grunt.task.run('jshint');
  });
};
