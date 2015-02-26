/**
 * sails-generate-avahi
 *
 * Usage:
 * `sails generate avahi`
 *
 * @description Generates an avahi hook to publish the sails.js
 *              instance as a service
 * @help See http://links.sailsjs.org/docs/generators
 */

module.exports = {

  /**
   * The files/folders to generate.
   * @type {Object}
   */

  targets: {

    './config/avahi.js': { template: 'config.template.js' },
    './api/hooks/avahi/index.js': { template: 'hook.template.js' },

  },


  /**
   * The absolute path to the `templates` for this generator
   * (for use with the `template` helper)
   *
   * @type {String}
   */
  templatesDirectory: require('path').resolve(__dirname, './templates')
};
