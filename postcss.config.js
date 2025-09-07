/**
 * @type {import('postcss-load-config').Config}
 *
 * @description
 * This is the configuration file for PostCSS.
 * It allows you to use plugins to transform your CSS.
 *
 * @see
 * https://github.com/postcss/postcss-load-config
 */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}