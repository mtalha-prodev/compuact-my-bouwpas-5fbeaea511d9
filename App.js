// <reference types="@welldone-software/why-did-you-render" />

// import './wdyr.js';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import './app/i18n';
import { registerRootComponent } from 'expo';
import * as Sentry from 'sentry-expo';

import App from './app/App';

Sentry.init({
  dsn: 'https://ed77be8d03dd47e7b11b16e3d0a1cb12@o1193736.ingest.sentry.io/6316065',
  enableInExpoDevelopment: false,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

registerRootComponent(App);

export default App;
