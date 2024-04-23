import { HeaderNav } from 'app/components';
import { Text } from 'app/components/text/text';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import { useAppPermissions } from 'app/hooks';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import { openSettings } from 'expo-linking';
import { openBrowserAsync } from 'expo-web-browser';
import React, { FC } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import SwitchToggle from 'react-native-switch-toggle';

export const Privacy: FC = () => {
  const { t } = React.useContext(LocalizationContext);
  const responsiveWidth = getResponsiveWidth();

  const { permission: cameraPermission, askCameraPermission } = useAppPermissions('camera');
  const { permission: locationPermission, askLocationPermission } = useAppPermissions('location');

  const onAskCamera = () => {
    if (!cameraPermission) askCameraPermission();
  };

  const onAskLocation = () => {
    if (!locationPermission) askLocationPermission();
  };

  return (
    <View style={{ flex: 1, backgroundColor: pickColor({ name: 'bp-support', shade: 100 }) }}>
      <HeaderNav title={t('menuItem5')} leftElement="drawer" />

      <ScrollView style={{ paddingLeft: 5.0, paddingTop: 15 }}>
        <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
          <View>
            <Text style={[AppStyles.headingTitle, { paddingLeft: 10 }]}>
              {t('privacyDescrTitle')}
            </Text>
            <View style={AppStyles.box}>
              <Text style={[AppStyles.fontSizeMd, { fontFamily: 'source-sans-pro-regular' }]}>
                {t('privacyDescrText')}
              </Text>

              <TouchableOpacity
                onPress={() => openBrowserAsync(env.BOUWPAS_PRIVACY_URL)}
                style={[
                  AppStyles.button,
                  {
                    justifyContent: 'center',
                  },
                ]}
              >
                <Text style={AppStyles.buttonText}>{t('privacyButton')}</Text>
              </TouchableOpacity>
            </View>

            <Text style={[AppStyles.headingTitle, { paddingLeft: 10 }]}>
              {t('accessDescrTitle')}
            </Text>
            <View style={AppStyles.box}>
              <View style={[AppStyles.hStack, { justifyContent: 'space-between' }]}>
                <Text style={AppStyles.fontSizeMd}>{t('accessCameraText')}</Text>
                <SwitchToggle
                  backgroundColorOn="green"
                  circleStyle={{
                    width: 22,
                    height: 22,
                    borderRadius: 20,
                  }}
                  containerStyle={{
                    marginTop: 5,
                    width: 55,
                    height: 30,
                    borderRadius: 25,
                    padding: 5,
                  }}
                  onPress={onAskCamera}
                  switchOn={cameraPermission}
                />
              </View>

              <View style={AppStyles.divider} />

              <View style={[AppStyles.hStack, { justifyContent: 'space-between' }]}>
                <Text style={AppStyles.fontSizeMd}>{t('accessLocationText')}</Text>
                <SwitchToggle
                  backgroundColorOn="green"
                  onPress={onAskLocation}
                  switchOn={locationPermission}
                  circleStyle={{
                    width: 22,
                    height: 22,
                    borderRadius: 20,
                  }}
                  containerStyle={{
                    marginTop: 5,
                    width: 55,
                    height: 30,
                    borderRadius: 25,
                    padding: 5,
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={openSettings}
                style={[
                  AppStyles.button,
                  {
                    justifyContent: 'center',
                  },
                ]}
              >
                <Text style={AppStyles.buttonText}>{t('openAppPermissions')}</Text>
              </TouchableOpacity>
              <Text style={{ marginTop: 12 }}>{t('accessDescription')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
