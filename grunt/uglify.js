module.exports = {
  options: {
    mangle: {
      except: ['u', 'µ']
    },
    compress: {
      //drop_console: true
    },
    preserveComments: false,
    sourceMap: true
  },
  ujs: {
    options: {
      banner: '<%= banner %>'
    },
    src: ['dist/u.route.js'],
    dest: 'dist/u.route.min.js'
  },
  jquery: {
    options: {
      banner: '<%= banner %>'
    },
    src: ['dist/jquery.route.js'],
    dest: 'dist/jquery.route.min.js'
  },
  history: {
    options: {
      banner: '<%= historyBanner %>',
      sourceMap: false
    },
    src: ['dist/history.fix.js'],
    dest: 'dist/history.fix.min.js'
  }
};
