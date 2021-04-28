const pkg = require('../package.json');
module.exports = {
  title: pkg.name,
  description: pkg.description,
  dest: 'public',
  themeConfig: {
    navbar: false
  },
  base: process.env.BASEPATH || '/'
};
