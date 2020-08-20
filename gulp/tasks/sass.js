// eslint-disable-next-line import/no-extraneous-dependencies
import gulp from 'gulp';
// eslint-disable-next-line import/no-extraneous-dependencies
import sass from 'gulp-sass';
// eslint-disable-next-line import/no-extraneous-dependencies
import sourcemaps from 'gulp-sourcemaps';
// eslint-disable-next-line import/no-extraneous-dependencies
import postcss from 'gulp-postcss';
// eslint-disable-next-line import/no-extraneous-dependencies
import autoprefixer from 'autoprefixer';
// import mqpacker from 'css-mqpacker';
// eslint-disable-next-line import/no-extraneous-dependencies
import csso from 'postcss-csso';
import config from '../config';

const isMax = mq => /max-width/.test(mq);
const isMin = mq => /min-width/.test(mq);

const sortMediaQueries = (a, b) => {
  // eslint-disable-next-line prefer-const
  const A = a.replace(/\D/g, '');
  // eslint-disable-next-line no-undef
  const B = b.replace(/\D/g, '');


    if (isMax(a) && isMax(b)) {
      // eslint-disable-next-line no-undef
        return B - A;
    } if (isMin(a) && isMin(b)) {
    // eslint-disable-next-line no-undef
        return A - B;
    } if (isMax(a) && isMin(b)) {
        return 1;
    } if (isMin(a) && isMax(b)) {
        return -1;
    }
    return 1;
}

const processors = [
  autoprefixer({
    browsers: ['last 4 versions'],
    cascade: false
  }),
  // require('lost'),
  // mqpacker({
  //   sort: sortMediaQueries
  // }),
  csso
];

gulp.task('sass', () => gulp
  .src(`${config.src.scss  }/*.{sass,scss}`)
  .pipe(sourcemaps.init())
  .pipe(sass({
      outputStyle: config.production ? 'compact' : 'expanded', // nested, expanded, compact, compressed
      precision: 5
  }))
  .on('error', config.errorHandler)
  .pipe(postcss(processors))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(config.dest.css))
);

// eslint-disable-next-line no-shadow
const build = gulp => gulp.parallel('sass');
// eslint-disable-next-line no-shadow
const watch = gulp => () => gulp.watch(`${config.src.scss  }/**/*.{sass,scss}`, gulp.parallel('sass'));

module.exports.build = build;
module.exports.watch = watch;
