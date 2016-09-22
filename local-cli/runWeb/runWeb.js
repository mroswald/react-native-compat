'use strict';

const chalk = require('chalk');
// const build = require('./utils/build');
const deploy = require('./utils/deploy');

function runWeb(config, args, options) {
  // Fix up options
  options.root = options.root || process.cwd();
  if (options.debug && options.release) {
    console.log(chalk.red('Only one of "debug"/"release" options should be specified'));
    return;
  }

  // Get build/deploy options
  const buildType = options.release ? 'Release' : 'Debug';

  return deploy.startServerInNewWindow(options)
    .then(() => {
      deploy.openBrowserWindow(options).then(() => {

      }).catch(e => console.error(chalk.red(`Failed to run browser: ${e.message}`)));
    })
    .catch(e => console.error(chalk.red(`Failed to deploy: ${e.message}`)));
}

/*
// Example of running the Web Command
runWeb();
*/

/**
 * Options are the following:
 *    release: Boolean - Specifies release build
 */
module.exports = {
  name: 'run-web',
  description: 'builds your app and starts it on a connected Windows desktop, emulator or device',
  func: runWeb,
  options: []
};
