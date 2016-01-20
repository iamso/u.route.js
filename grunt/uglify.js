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
  dist: {
    options: {
      banner: '<%= banner %>'
    },
    src: ['dist/u.route.js'],
    dest: 'dist/u.route.min.js'
  }
};
