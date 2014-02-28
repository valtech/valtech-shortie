module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        typescript: {
            options: {
                module: 'commonjs',
                target: 'es5'
            },
            dist: {
                src: 'src/**/*.ts'
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
                    ]
                }
            }
        },

        watch: {
            all: {
                files: [
                    'src/**/*.ts',
                    'test/**/*.js'
                ],
                tasks: ['default']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-typescript-compile');
    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('build', ['typescript']);
    grunt.registerTask('default', ['npm-install', 'build', 'test', 'jshint']);
};
