'use strict';

const fs = require('fs');
const path = require('path');
const yeoman = require('yeoman-environment');

/**
 * Simple utility for running the web yeoman generator.
 *
 * @param  {String} projectDir root project directory (i.e. contains index.js)
 * @param  {String} name       name of the root JS module for this app
 * @param  {String} ns         namespace for the project
 */
function generateWeb (projectDir, name, ns) {
  const oldCwd = process.cwd();

  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir);
  }

  const env = yeoman.createEnv();
  const generatorPath = path.join(__dirname, 'generator-web');
  env.register(generatorPath, 'react:web');
  const args = ['react:web', name, ns].concat(process.argv.slice(4));
  env.run(args, { ns: ns }, function () {
    process.chdir(oldCwd);
  });
}

module.exports = generateWeb;
