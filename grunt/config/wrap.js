module.exports = {
  'core': {
    header: 'snc_eval_header.js',
    footer: 'snc_eval_footer.js',
    src: [
      '../jasmine/spec/core/**/*.js',
    ],
    dest: 'snc_eval_spec/core'
  },
  'console': {
    header: 'snc_eval_header.js',
    footer: 'snc_eval_footer.js',
    src: [
      '../jasmine/spec/console/**/*.js'
    ],
    dest: 'snc_eval_spec/console'
  }
};
