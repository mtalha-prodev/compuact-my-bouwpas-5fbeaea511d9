import { FontAwesomeIcon, HeaderNav } from 'app/components';
import Box from 'app/components/app-box/app-box';
import { Text } from 'app/components/text/text';
import { LocalizationContext } from 'app/contexts';
import { mainColors } from 'app/theme/native-base/main-colors';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import * as Linking from 'expo-linking';
import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';

export const AppUpdate = () => {
  const bgColors = mainColors({ type: 'bg' });
  const { t } = React.useContext(LocalizationContext);

  const buttonText = Platform.OS === 'ios' ? t('iosStore') : t('androidStore');

  const openStore = () => {
    // eslint-disable-next-line no-unused-expressions
    Platform.OS === 'ios'
      ? Linking.openURL('https://apps.apple.com/app/mijn-bouwpas/id1536817500')
      : Linking.openURL('https://play.google.com/store/apps/details?id=nl.bouwpas.my');
  };

  return (
    <View style={{ flex: 1, backgroundColor: bgColors }}>
      <HeaderNav title={t('criticalVersionTitle')} />

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 2,
        }}
      >
        <Box
          bg={{
            linearGradient: {
              colors: [
                pickColor({ name: 'bp-primary', shade: 300 }),
                pickColor({ name: 'bp-primary', shade: 400 }),
              ],
              start: [0, 0],
              end: [1, 0],
            },
          }}
          p="12"
          rounded="10"
          width="auto"
          alignItems="center"
        >
          <Text style={{ fontSize: 46 }}>{t('askAppUpdate')}</Text>

          <View
            style={{
              marginVertical: 4,
            }}
          >
            <FontAwesomeIcon
              icon={['fad', 'exclamation-circle']}
              size={70}
              colors={['bp-primary', 'bp-primary']}
              colorsLevel={['500', '500']}
            />
          </View>

          <TouchableOpacity
            onPress={openStore}
            style={[
              AppStyles.button,
              { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
            ]}
          >
            <>
              <FontAwesomeIcon
                icon={['fas', 'cog']}
                size={25}
                colors={['bp-white', 'bp-white']}
                colorsLevel={['500', '500']}
              />
              <Text
                style={{
                  color: pickColorSingleShade({ name: 'bp-white' }),
                  marginLeft: 10,
                  fontSize: 18,
                }}
              >
                {buttonText}
              </Text>
            </>
          </TouchableOpacity>
        </Box>
      </View>
    </View>
  );
};
