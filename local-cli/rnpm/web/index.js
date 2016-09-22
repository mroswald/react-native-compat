module.exports = {
  func: require('./src/web'),
  description: 'Generate React Native web template project',
  name: 'web [name]',
  options: [{
    command: '--webVersion [version]',
    description: 'The version of react-native-web to use.'
  }]
};
