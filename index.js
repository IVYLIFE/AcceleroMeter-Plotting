/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// LogBox.ignoreLogs([
//     "Require cycle: node_modules/victory",
// ]);

AppRegistry.registerComponent(appName, () => App);
