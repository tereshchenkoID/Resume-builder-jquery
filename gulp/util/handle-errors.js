// eslint-disable-next-line import/no-extraneous-dependencies
import notify from 'gulp-notify';

module.exports = function() {
  // eslint-disable-next-line prefer-rest-params
  const args = Array.prototype.slice.call(arguments);
  notify.onError({
      title: 'Compile Error',
      message: '<%= error.message %>',
      sound: 'Submarine'
  }).apply(this, args);
  this.emit('end');
};
