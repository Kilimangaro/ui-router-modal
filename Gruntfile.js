module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/** <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.description ? pkg.description + "\\n" : "" %>' +
            '*/\n',
        // Task configuration
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['src/ui-router-modal.js'],
                dest: 'dist/ui-router-modal.js'
            }
        },
        uglify: {
            options: {
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/ui-router-modal.min.js'
            }
        },
        jshint: {
            options: {
                node: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                eqnull: true,
                boss: true
            },
            gruntfile: {
                src: 'gruntfile.js'
            },
            lib_test: {
                src: ['src/**/*.js']
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'nodeunit']
            }
        },

        karma: {
            options: {
                configFile: 'karma.conf.js'
                // Serve and load angular files using regular Karma mode
                //browsers: [ grunt.option('browser') || 'PhantomJS' ]
            },
            // Same as karma:base
            unit: {
            }
        }
    });


    // Default task
    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', ['jshint', 'concat', 'uglify']);

    grunt.registerTask('test', ['build', 'karma:unit']);
};

