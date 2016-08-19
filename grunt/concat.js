module.exports = {
  options: {
    separator: '\n\n',
    stripBanners: {
      block: false,
      line: false
    },
    banner: '<%= banner %>',
  },
  ujs: {
    src: [
      'src/umd/ujs.js',
      'src/history.js',
      'src/plugin.js',
      'src/umd/end.js',
    ],
    dest: 'dist/u.route.js'
  },
  jquery: {
    src: [
      'src/umd/jquery.js',
      'src/history.js',
      'src/plugin.js',
      'src/umd/end.js',
    ],
    dest: 'dist/jquery.route.js'
  },
  history: {
    options: {
      banner: '<%= historyBanner %>',
    },
    src: [
      'src/history.js',
    ],
    dest: 'dist/history.fix.js'
  }
};
