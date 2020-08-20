// eslint-disable-next-line import/no-extraneous-dependencies
import gulp from 'gulp';
// eslint-disable-next-line import/no-extraneous-dependencies
import plumber from 'gulp-plumber';
// eslint-disable-next-line import/no-extraneous-dependencies
import svgmin from 'gulp-svgmin';
// eslint-disable-next-line import/no-extraneous-dependencies
import svgStore from 'gulp-svgstore';
// eslint-disable-next-line import/no-extraneous-dependencies
import rename from 'gulp-rename';
// eslint-disable-next-line import/no-extraneous-dependencies
import cheerio from 'cheerio';
// eslint-disable-next-line import/no-extraneous-dependencies
import gulpcheerio from 'gulp-cheerio';
// eslint-disable-next-line import/no-extraneous-dependencies
import through2 from 'through2';
// eslint-disable-next-line import/no-extraneous-dependencies
import consolidate from 'gulp-consolidate';
import config from '../config';

gulp.task('sprite:svg', () => gulp
  .src(`${config.src.iconsSvg  }/*.svg`)
  .pipe(
    gulpcheerio({
      run($, file) {

        $('[fill]:not([fill="currentColor"])').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        let w; let h; let size;
        if($('svg').attr('height')){
            w = $('svg').attr('width').replace(/\D/g,'');
            h = $('svg').attr('height').replace(/\D/g,'');
        } else {
            size = $('svg').attr('viewbox').split(' ').splice(2);
          // eslint-disable-next-line prefer-destructuring
            w = size[0];
          // eslint-disable-next-line prefer-destructuring
            h = size[1];
          // eslint-disable-next-line radix
            $('svg').attr('width', parseInt(w));
          // eslint-disable-next-line radix
            $('svg').attr('height', parseInt(h));
        }
        // eslint-disable-next-line radix
        $('svg').attr('viewBox', `0 0 ${  parseInt(w)  } ${  parseInt(h)}`);
      },
      parserOptions: { xmlMode: true }
    })
  )
  .pipe(plumber({
      errorHandler: config.errorHandler
  }))
  .pipe(svgmin({
      js2svg: {
          pretty: true
      },
      plugins: [{
          removeDesc: true
      }, {
          cleanupIDs: true
      }, {
          removeViewBox: false
      }, {
          mergePaths: false
      }]
  }))
  .pipe(rename({ prefix: 'icon-' }))
  .pipe(svgStore({ inlineSvg: false }))
  .pipe(through2.obj(function (file, encoding, cb) {
      const $ = cheerio.load(file.contents.toString(), {xmlMode: true});
      const data = $('svg > symbol').map(function() {
      const $this  = $(this);
      const size   = $this.attr('viewBox').split(' ').splice(2);
      const name   = $this.attr('id');
      const ratio  = size[0] / size[1]; // symbol width / symbol height
      const fill   = $this.find('[fill]:not([fill="currentColor"])').attr('fill');
			const stroke = $this.find('[stroke]').attr('stroke');

      return {
          name,
          ratio: +ratio.toFixed(2),
          fill: fill || 'initial',
          stroke: stroke || 'initial'
      };
    }).get();
    this.push(file);
    gulp.src(`${__dirname  }/sprite-svg/_sprite-svg.scss`)
      .pipe(consolidate('lodash', {
          symbols: data
      }))
			.pipe(gulp.dest(config.src.scssGen))
		;
    cb();
  }))

  .pipe(rename({ basename: 'sprite' }))
  .pipe(gulp.dest(config.dest.img))
);

// eslint-disable-next-line no-shadow
const build = gulp => gulp.series('sprite:svg');
// eslint-disable-next-line no-shadow
const watch = gulp => () => gulp.watch(`${config.src.iconsSvg  }/*.svg`, gulp.parallel('sprite:svg'));

module.exports.build = build;
module.exports.watch = watch;
