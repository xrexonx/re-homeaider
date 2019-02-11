// This configuration is to support a test build of the CavyDirectory app,
// where you want to test a local version of cavy (in the parent directory)
// instead of the published one.
//
// To do so, copy this file to rn-cli.config.js before running react-native.
var path = require("path");
var config = {
    watchFolders: [
      path.resolve(__dirname, "../../")
    ],
    extraNodeModules: {
      react: path.resolve(__dirname, "node_modules/react")
    }
}

module.exports = config;