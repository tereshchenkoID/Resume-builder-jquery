// eslint-disable-next-line import/no-extraneous-dependencies
import gulp from 'gulp';
// eslint-disable-next-line import/extensions
import config from '../config.js';
// import imagemin from 'gulp-imagemin';

gulp.task('copy:img', () => gulp
  .src([
    `${config.src.img  }/**/*.{jpg,png,jpeg,ico,svg,gif,mp4,webp,webm}`,
    `!${  config.src.img  }/svgo/**/*.*`
	])
	// .pipe(imagemin([], {
	// 	verbose: true
	// }))
  .pipe(gulp.dest(config.dest.img))
);

gulp.task('copy:js', () => gulp
  .src(`${config.src.js  }/custom.js`)
  .pipe(gulp.dest(config.dest.js))
);

gulp.task('copy:fonts', () => gulp
  .src(`${config.src.fonts  }/**/*.{ttf,eot,woff,woff2}`)
  .pipe(gulp.dest(config.dest.fonts))
);

gulp.task('copy:data', () => gulp
  .src(`${config.src.data  }/**/*.*`)
  .pipe(gulp.dest(config.dest.data))
);

gulp.task('copy:lib', () => gulp
  .src(`${config.src.lib  }/**/*.*`)
  .pipe(gulp.dest(config.dest.lib))
);

gulp.task('copy:rootfiles', () => gulp
  .src(`${config.src.root  }/*.*`)
  .pipe(gulp.dest(config.dest.root))
);

// eslint-disable-next-line no-shadow
const build = gulp => gulp.series('copy:img', 'copy:fonts', 'copy:js', 'copy:data');
// eslint-disable-next-line no-shadow
const watch = gulp => () => gulp.watch(`${config.src.data  }/**/*`, gulp.parallel('copy:img', 'copy:fonts', 'copy:js', 'copy:data'));

module.exports.build = build;
module.exports.watch = watch;
