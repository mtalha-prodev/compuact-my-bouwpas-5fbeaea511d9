import { HeaderNav } from 'app/components';
import Box from 'app/components/app-box/app-box';
import { LocalizationContext } from 'app/contexts';
import { mainColors } from 'app/theme/native-base/main-colors';
import { pickColor } from 'app/theme/native-base/pick-color';
import LottieView from 'lottie-react-native';
import React from 'react';
import { ActivityIndicator, Image, Platform, View, useWindowDimensions } from 'react-native';

export const AppVersionLoading = () => {
  const bgColors = mainColors({ type: 'bg' });
  const { t } = React.useContext(LocalizationContext);

  const { width } = useWindowDimensions();

  return (
    <View style={{ flex: 1, backgroundColor: bgColors }}>
      <HeaderNav title={t('versionLoadingTitle')} />
      <Image
        source={require('app/assets/images/bp/logo-dark.png')}
        accessibilityLabel="Logo"
        style={{
          height: 200,
          width: '100%',
          resizeMode: 'contain',
          zIndex: 999,
        }}
      />
      <Box
        flex={1}
        justifyContent="flex-end"
        alignItems="flex-end"
        position="absolute"
        bottom={0}
        bg={bgColors}
        width="auto"
      >
        {Platform.OS !== 'web' ? (
          <LottieView
            autoPlay
            loop
            style={{
              width: width * 2.2,
              height: width * 2.2,
              marginBottom: -150,
            }}
            source={require('app/assets/lottie-animations/startup-animation.json')}
          />
        ) : (
          <ActivityIndicator size="large" color={pickColor({ name: 'bp-primary', shade: 500 })} />
        )}
      </Box>
    </View>
  );
};
