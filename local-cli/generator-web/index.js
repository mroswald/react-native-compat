'use strict';

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const yeoman = require('yeoman-generator');

const REACT_NATIVE_PACKAGE_JSON_PATH = function() {
  return path.resolve(
    process.cwd(),
    'node_modules',
    'react-native',
    'package.json'
  );
};

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.argument('name', { type: String, required: true });

    this.option('ns', {
      desc: 'Namespace for the application (MyNamespace.MyApp)',
      type: String,
      defaults: this.name
    });
  },

  configuring: function() {
    this.fs.copy(
      this.templatePath('_gitignore'),
      this.destinationPath(path.join('web', '.gitignore'))
    );
    // @todo: merge if a babelrc already exists
    this.fs.copy(
      this.templatePath('_babelrc'),
      this.destinationPath(path.join('.babelrc'))
    );
  },

  writing: function () {
    const projectGuid = uuid.v4();
    const packageGuid = uuid.v4();
    const templateVars = { name: this.name, ns: this.options.ns, projectGuid, packageGuid };

    this.fs.copyTpl(
      this.templatePath('index.web.js'),
      this.destinationPath('index.web.js'),
      templateVars
    );

    this.fs.copyTpl(
      this.templatePath(path.join('public', '**')),
      this.destinationPath(path.join('web', this.name)),
      templateVars
    );

    this.fs.copyTpl(
      this.templatePath('index.web.bundle'),
      this.destinationPath(path.join('web', this.name, 'ReactAssets', 'index.web.bundle')),
      templateVars
    );
  },

  install: function() {
    const reactNativeWebPackageJson = require('../../package.json');
    const peerDependencies = reactNativeWebPackageJson.peerDependencies;
    if (!peerDependencies) {
      return;
    }

    if (fs.existsSync(REACT_NATIVE_PACKAGE_JSON_PATH())) {
      return;
    }

    const reactNativeVersion = peerDependencies['react-native'];
    if (!reactNativeVersion) {
      return;
    }

    console.log(`Installing react-native@${reactNativeVersion}...`);
    this.npmInstall(`react-native@${reactNativeVersion}`, { '--save': true });

    const reactVersion = peerDependencies.react;
    if (!reactVersion) {
      return;
    }

    console.log(`Installing react@${reactVersion}...`);
    this.npmInstall(`react@${reactVersion}`, { '--save': true });
  },

  end: function() {
    const projectPath = path.resolve(this.destinationRoot(), 'web', this.name);
    this.log(chalk.white.bold('To run your app on UWP:'));
    this.log(chalk.white('   react-native run-web'));
  }
});
