'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    // lint
    tslint: {
      options: {
        configuration: grunt.file.readJSON('tslint.json')
      },
      src: {
        src: ['src/ts/**/*.ts']
      }
    },

    // build
    ts: {
      options: {
        fast: 'never',
        target: 'es5'
      },
      dev: {
        src: 'src/ts/**/*.ts',
        out: 'bin/js/lsystems.js',
        options: {
          sourcemap: true,
          removeComments: false
        }
      },
      prod: {
        src: 'src/ts/**/*.ts',
        out: 'bin/js/lsystems.js',
        options: {
          sourcemap: false,
          removeComments: true
        }
      }
    },
    jade: {
      dev: {
        src: 'src/jade/index.jade',
        dest: 'bin/index.html'
      },
      prod: {
        src: 'src/jade/index.jade',
        dest: 'bin/index.html'
      }
    },
    less: {
      options: {
        paths: [
          'node_modules/bootstrap-less',
          'node_modules/bootswatch'
        ]
      },
      dev: {
        src: 'src/less/index.less',
        dest: 'bin/css/index.css',
        options: {
          sourceMap: true,
          sourceMapRootpath: '../..',
          sourceMapBasepath: '.',
          sourceMapURL: 'index.css.map', // TODO: temporary fix for https://github.com/gruntjs/grunt-contrib-less/issues/236
          compress: false
        }
      },
      prod: {
        src: 'src/less/index.less',
        dest: 'bin/css/index.css',
        options: {
          sourceMap: false,
          compress: true
        }
      }
    },
    copy: {
      res: {
        files: [
          {
            expand: true,
            cwd: 'src/res',
            src: ['**/*'],
            dest: 'bin/res'
          },
          {
            expand: true,
            cwd: 'node_modules/bootstrap-less',
            src: ['fonts/**/*'],
            dest: 'bin'
          }
        ]
      }
    },
    uglify: {
      prod: {
        files: {
          '<%= ts.prod.out %>': '<%= ts.prod.out %>'
        }
      }
    },

    // clean
    clean: {
      js: {
        src: ['bin/js']
      },
      html: {
        src: ['bin/index.html']
      },
      css: {
        src: ['bin/css']
      },
      res: {
        src: ['bin/res']
      },
      bin: {
        src: ['bin']
      },
      remove_src_baseDir: {
        src: ['src/ts/**/.baseDir.ts'],
        dot: true
      }
    },

    // other
    watch: {
      ts: {
        files: ['src/ts/**/*'],
        tasks: ['clean:js', 'build_dev:ts']
      },
      jade: {
        files: ['src/jade/**/*'],
        tasks: ['clean:html', 'build_dev:jade']
      },
      less: {
        files: ['src/less/**/*'],
        tasks: ['clean:css', 'build_dev:less']
      },
      res: {
        files: ['src/res/**/*'],
        tasks: ['clean:res', 'copy:res']
      }
    },
    todo: {
      options: {},
      src: ['src/**/*']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-todo');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-tslint');

  grunt.registerTask('build_dev:ts', ['tslint:src', 'ts:dev', 'clean:remove_src_baseDir']);
  grunt.registerTask('build_dev:jade', ['jade:dev']);
  grunt.registerTask('build_dev:less', ['less:dev']);
  grunt.registerTask('build_dev', ['clean:bin', 'build_dev:ts', 'build_dev:jade', 'build_dev:less', 'copy:res']);

  grunt.registerTask('build:ts', ['tslint:src', 'ts:prod', 'clean:remove_src_baseDir', 'uglify:prod']);
  grunt.registerTask('build:jade', ['jade:prod']);
  grunt.registerTask('build:less', ['less:prod']);
  grunt.registerTask('build', ['clean:bin', 'build:ts', 'build:jade', 'build:less', 'copy:res']);

  grunt.registerTask('default', ['build_dev', 'todo']);

};
