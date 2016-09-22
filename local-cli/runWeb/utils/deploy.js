'use strict';

const child_process = require('child_process');
const spawn = child_process.spawn, execSync = child_process.execSync;
const http = require('http');
const path = require('path');
const chalk = require('chalk');

function startServerInNewWindow(options) {
  return new Promise(resolve => {
    http.get('http://localhost:8081/status', res => {
      if (res.statusCode === 200) {
        console.log(chalk.green('React-Native Server already started'));
      } else {
        console.log(chalk.red('React-Native Server not responding'));
      }
      resolve();
    }).on('error', () => resolve(launchServer(options)));
  });
};

function launchServer(options) {
  console.log(chalk.green('Starting the React-Native Server'));
  const launchPackagerScript = path.join('node_modules/react-native/packager/packager.sh');
  const opts = {
    cwd: options.root,
    // detached: true,
    stdio: 'ignore'
  };

  return Promise.resolve(spawn('open', ['-n', '-a', 'Terminal.app', launchPackagerScript], opts));
};

function openBrowserWindow(options) {
  console.log(chalk.green('Opening the browser for you 😍'));
  const url = 'http://localhost:8081/web/TestWeb/index.html';
  const opts = {
    cwd: options.root,
    // detached: true,
    stdio: 'ignore'
  };

  return Promise.resolve(spawn('open', [url], opts));
}

module.exports = {
  openBrowserWindow,
  startServerInNewWindow
};
