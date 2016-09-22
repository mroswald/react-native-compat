'use strict';

// use react native packager's blacklist to gather platform
// behind the scenes there's the implementation of
// react-native or react-native-web
import {Platform} from '../Utilities/Platform';

let getSourceDependency = () => Platform.OS == 'web'
    ? require('react-native-web')
    : require('../react-native/Libraries/react-native/react-native');

// this object's defined components and apis will be preferred
const ReactNative = {
  Platform,
};

// proxy to use either the components/api defined in this file
// or the one's from react-native/react-native-web, depending on
// the platform
module.exports = new Proxy(ReactNative, {
    get: (target, name) => {
        // contained in defined object
        if (name in target) {
          return target[name];
        }

        // try to get from original implementation
        let source = getSourceDependency();
        return name in source
          ? source[name]
          : {};
    }
});
