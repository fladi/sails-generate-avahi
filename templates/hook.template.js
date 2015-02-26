/**
 * avahi hook
 */

var Enum = require('enum');
var DBus = require('dbus-native');

// Mimicking the constants from python-avahi library for conventience.
// Some unused constants are missing.
var avahi = new Enum({
  'IF_UNSPEC': -1,
  'PROTO_UNSPEC': -1,
  'PROTO_INET': 0,
  'SERVER_RUNNING': 2,
  'SERVER_COLLISION': 3,
  'DBUS_NAME': 'org.freedesktop.Avahi',
  'DBUS_PATH_SERVER': '/',
  'DBUS_INTERFACE_SERVER': 'org.freedesktop.Avahi.Server',
  'DBUS_INTERFACE_ENTRY_GROUP': 'org.freedesktop.Avahi.EntryGroup'
});

module.exports = function (sails) {
  //process.env.DISPLAY = ':0';
  //process.env.DBUS_SESSION_BUS_ADDRESS = 'unix:path=/run/dbus/system_bus_socket';
  var bus = DBus.systemBus();

  // Scoped variables to hold the various objects retrieved from dbus.
  var server;
  var service;
  var group;
  var config;

  // Remove the service after a StateChanged signal if necessary.
  function remove_service() {
    if (group) {
      group.Reset();
    }
  }

  // Add a new EntryGroup for our service.
  function add_group() {
    server.EntryGroupNew(function(err, path) {
      if (err) {
        sails.log.error('DBus: Could not call org.freedesktop.Avahi.Server.EntryGroupNew');
        return;
      }
      service.getInterface(
        path,
        avahi.DBUS_INTERFACE_ENTRY_GROUP.value,
        function (
          err,
          newGroup
        ) {
          group = newGroup;
          add_service();
        }
      )
    });
  }

  // Add our service definition.
  function add_service() {
    // Default configuration. Overrides can be defined in `config/avahi.js`.

    sails.log.info('Publishing service ' + config.name + ' (' + config.type + ') on port '+ config.port);
    group.AddService(
      avahi.IF_UNSPEC.value,
      avahi.PROTO_INET.value,
      0,
      config.name,
      config.type,
      config.domain,
      config.host,
      config.port,
      '',
      function(err) {
        if (err) {
          sails.log.error('DBus: Could not call org.freedesktop.Avahi.EntryGroup.AddService');
          return;
        }
        group.Commit();
      }
    );
  }

  // Handle StateChange signals from the avahi server.
  function stateChanged(state) {
    if (state == avahi.SERVER_COLLISION.value) {
      remove_service();
    } else {
      add_group();
    }
  }
  return {
    // Run when sails loads-- be sure and call `next()`.
    initialize: function (next) {
      var defaultConfig = {
        enabled: true,
        name: "Sails.js",
        type: "_sails._tcp",
        domain: "",
        host: "",
        port: sails.config.proxyPort || sails.config.port
      };

      // Merge default config with custom config.
      config = _.merge(defaultConfig, sails.config.avahi);

      // See if service publishing is desired
      if (!config.enabled) {
        return next();
      }
      // Get the avahi service from dbus.
      service = bus.getService(avahi.DBUS_NAME.value);
      service.getInterface(
        avahi.DBUS_PATH_SERVER.value,
        avahi.DBUS_INTERFACE_SERVER.value,
        function(
          err,
          newServer
        ) {
          server = newServer;
          server.on('StateChanged', stateChanged);
          server.GetState(function(err, state) {
            if (err) {
              sails.log.error('DBus: Could not call org.freedesktop.Avahi.Server.GetState');
              return;
            }
            stateChanged(state);
          });
        }
      );


      return next();
    }
  };
};
