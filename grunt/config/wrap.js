module.exports = {
  'core': {
    header: 'snc_eval_header.js',
    footer: 'snc_eval_footer.js',
    src: [
      '../jasmine/spec/core/**/*.js',
    ],
    dest: 'snc_eval_spec/core'
  },
  'jasmine-snc': {
    header: 'snc_eval_header.js',
    footer: 'snc_eval_footer.js',
    src: [
      'spec/**/*.js'
    ],
    dest: 'snc_eval_spec/jasmine-snc'
  }
};
