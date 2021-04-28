var gulp = require('gulp');
var del = require('del');
var jscadFiles = require('gulp-jscad-files');
var { getInjected } = require('gulp-jscad-files/getPackage');
var merge2 = require('merge2');
var debug = require('gulp-debug');
var inject = require('gulp-inject');
var plumber = require('gulp-plumber');
var terser = require('gulp-terser');

var pkg = require('./package.json');

gulp.task('clean', function (done) {
  del(['dist/*']).then((paths) => {
    console.log('Deleted files and folders:\n', paths.join('\n')); // eslint-disable-line no-console, no-undef
    done();
  });
});

gulp.task('inject', function () {
  return gulp
    .src('AtomicPaw.jscad')
    .pipe(plumber())
    .pipe(
      inject(
        merge2(
          gulp.src(['*.jscad'], { ignore: ['AtomicPaw.jscad'] }),
          gulp
            .src('package.json')
            .pipe(jscadFiles())
            .pipe(
              terser({
                ecma: 6,
                keep_fnames: true,
                mangle: false,
                compress: false,
                output: {
                  beautify: false,
                  max_line_len: 80
                }
              })
            )
        ).pipe(debug({ title: 'injecting:' })),
        {
          relative: true,
          starttag: '// include:js',
          endtag: '// endinject',
          transform: function (filepath, file) {
            return '// ' + filepath + '\n' + file.contents.toString('utf8');
          }
        }
      )
    )
    .pipe(gulp.dest('dist'));
});

gulp.task(
  'vuepress',
  gulp.series(['inject'], function () {
    return gulp
      .src('dist/AtomicPaw.jscad')
      .pipe(debug({ title: 'vuepress:' }))
      .pipe(gulp.dest('.vuepress/public/'));
  })
);

gulp.task(
  'default',
  gulp.series(['clean', 'inject'], function () {
    gulp.watch(
      ['**/*.jscad', ...getInjected(pkg)],
      {
        verbose: true,
        followSymlinks: true,
        delay: 500,
        queue: false,
        ignoreInitial: false,
        ignored: ['**/*.*~', 'dist/*', '.vuepress/*', 'public', 'node_modules']
      },
      gulp.series(['inject'])
    );
  })
);
