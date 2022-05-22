// eslint-disable-next-line import/no-extraneous-dependencies
import gulp from 'gulp';
// eslint-disable-next-line import/no-extraneous-dependencies
import browseeSync from 'browser-sync';
// eslint-disable-next-line import/no-extraneous-dependencies
import util from  'gulp-util';
import config  from '../config';

const server = browseeSync.create();

// in CL 'gulp server --open' to open current project in browser
// in CL 'gulp server --tunnel siteName' to make project available over http://siteName.localtunnel.me

gulp.task('server', done => {
  server.init({
    server: {
      baseDir: !config.production ? [config.dest.root, config.src.root] : config.dest.root,
      directory: false,
      serveStaticOptions: {
        extensions: ['html']
      }
    },
    files: [
      `${config.dest.html  }/*.html`,
      `${config.dest.css  }/*.css`,
      `${config.dest.img  }/**/*`
    ],
    port: util.env.port || 8080,
    logLevel: 'info', // 'debug', 'info', 'silent', 'warn'
    logConnections: false,
    logFileChanges: true,
    open: Boolean(util.env.open),
    notify: false,
    ghostMode: false,
    online: Boolean(util.env.tunnel),
    tunnel: util.env.tunnel || null
  });
  done();
});

// eslint-disable-next-line no-shadow
const build = gulp => gulp.parallel('server');

module.exports.build = build;
module.exports.server = server;
