/**
 * Avahi hook configuration
 * (sails.config.avahi)
 */

module.exports.avahi = {

  /***************************************************************************
   * Enable/disable avahi service publishing.
   ***************************************************************************/

  // enabled: true,

  /***************************************************************************
   * The service name
   ***************************************************************************/

  // name: "Sails.js",

  /***************************************************************************
   * The service type, see http://www.dns-sd.org/ServiceTypes.html
   * _sails._tcp is NOT officially registered and so may be prone to
   * collisions. Better use your own service type.
   ***************************************************************************/

  // type: "_sails._tcp",

  /***************************************************************************
   * The domain, "local" if left blank, to use for this service.
   ***************************************************************************/

  // domain: "",

  /***************************************************************************
   * The hostname for this service. If left blank it defaults to the current
   * FQDN.
   ***************************************************************************/

  // host: "",

  /***************************************************************************
   * The port to be publisched for this service.
   * If not specified uses the configured sails port.
   ***************************************************************************/

  // port: 1337

};
