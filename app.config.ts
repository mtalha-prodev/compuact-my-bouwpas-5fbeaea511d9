import { ConfigContext, ExpoConfig } from '@expo/config';

// If you want to change app version, please change only this object
// So we no longer need to find version number and code
// To prevent old version/code
const versions = {
  number: '2.7.1',
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Bouwpas',
  icon: './app/assets/images/bp/icon.png',
  version: versions.number,
  slug: 'my-bouwpas',
  owner: 'meesbouwpas',
  orientation: 'portrait',
  scheme: 'bouwpas',
  jsEngine: 'hermes',
  extra: {
    eas: {
      // projectId: '188abcae-9530-482d-9878-b9902fdb391b',
      projectId: '864bf290-a00a-4f9d-9867-34490565a517',
    },
  },
  plugins: [
    'expo-font',
    'expo-secure-store',
    'expo-localization',
    'sentry-expo',
    [
      'expo-build-properties',
      {
        ios: {
          flipper: true,
        },
      },
    ],
  ],
  ios: {
    bitcode: 'Debug',
    bundleIdentifier: 'nl.bouwpas.my',
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_TOKEN,
    },
    supportsTablet: true,
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    // package: 'nl.bouwpas.my',
    package: 'com.muhammadawaisash.AwesomeProject',
    permissions: [
      'LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
      'CAMERA',
      'USE_FINGERPRINT',
      'USE_BIOMETRIC',
      'VIBRATE',
      'READ_PHONE_STATE',
      'com.google.android.c2dm.permission.RECEIVE',
      'com.anddoes.launcher.permission.UPDATE_COUNT',
      'com.majeur.launcher.permission.UPDATE_BADGE',
      'com.google.android.providers.gsf.permission.READ_GSERVICES',
      'com.sonyericsson.home.permission.BROADCAST_BADGE',
      'com.htc.launcher.permission.READ_SETTINGS',
      'com.htc.launcher.permission.UPDATE_SHORTCUT',
      'com.sec.android.provider.badge.permission.READ',
      'com.sec.android.provider.badge.permission.WRITE',
    ],
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_TOKEN,
      },
    },
  },
  locales: {
    nl: './app/i18n/languages/json/nl.json',
    en: './app/i18n/languages/json/en.json',
  },
  splash: {
    image: './app/assets/images/bp/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#475949',
  },
  updates: {
    fallbackToCacheTimeout: 0,
    enabled: false,
  },
  assetBundlePatterns: ['**/*'],
  privacy: 'unlisted',
  platforms: ['ios', 'android'],
  web: {
    favicon: './assets/icon.png',
  },
  hooks: {
    postPublish: [
      {
        file: 'sentry-expo/upload-sourcemaps',
        config: {
          organization: 'bouwpas',
          project: 'bouwpas',
        },
      },
    ],
  },
});
