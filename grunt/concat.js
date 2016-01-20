module.exports = {
  options: {
    separator: '\n\n',
    stripBanners: {
      block: false,
      line: false
    },
    banner: '<%= banner %>',
  },
  dist: {
    src: [
      'src/history.fix.js',
      'src/u.route.js'
    ],
    dest: 'dist/u.route.js'
  }
};
