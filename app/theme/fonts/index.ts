import * as Font from 'expo-font';

export const initFonts = async () => {
  await Font.loadAsync({
    bilo: require('../../assets/fonts/bp/Bilo.ttf'),
    interstate: require('../../assets/fonts/bp/Interstate.ttf'),
    'source-sans-pro-light': require('../../assets/fonts/bp/SourceSansPro-Light.ttf'),
    'source-sans-pro-light-italic': require('../../assets/fonts/bp/SourceSansPro-LightItalic.ttf'),
    'source-sans-pro-regular': require('../../assets/fonts/bp/SourceSansPro-Regular.ttf'),
    'source-sans-pro-semibold': require('../../assets/fonts/bp/SourceSansPro-Semibold.ttf'),
  });
};
