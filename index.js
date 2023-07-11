/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
messaging().onMessage(async remoteMessage => {
  // Handle background messages here
  console.log('Received background msg:', remoteMessage);
});
messaging().setBackgroundMessageHandler(async remoteMessage => {
    // Handle background messages here
    console.log('Received background message1:', remoteMessage);
  });
  messaging().getInitialNotification(async remoteMessage => {
    // Handle background messages here
    console.log('Received background kill:', remoteMessage);
  });
AppRegistry.registerComponent(appName, () => App);
