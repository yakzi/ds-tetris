cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-vibration.notification",
      "file": "plugins/cordova-plugin-vibration/www/vibration.js",
      "pluginId": "cordova-plugin-vibration",
      "merges": [
        "navigator"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-vibration": "3.1.1",
    "cordova-plugin-whitelist": "1.3.4"
  };
});