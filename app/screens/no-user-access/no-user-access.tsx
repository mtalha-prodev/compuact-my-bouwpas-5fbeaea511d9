import { FontAwesomeIcon, HeaderNav } from 'app/components';
import { Pressable } from 'app/components/pressable/pressable';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import { useStore } from 'app/store/main-store/main-store';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import { openAuthSessionAsync } from 'expo-web-browser';
import React, { FC } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useQueryClient } from 'react-query';

export const NoUserAccess: FC = () => {
  const { t } = React.useContext(LocalizationContext);
  const responsiveWidth = getResponsiveWidth();

  const queryClient = useQueryClient();

  const userLogOut = async () => {
    await openAuthSessionAsync(env.LOGOUT, env.APP_REDIRECT);
    queryClient.clear();
    useStore.setState({
      token: null,
      bootstrapState: {
        isError: null,
        isSignedIn: false,
        isLoading: false,
      },
      userTypes: null,
      currentUserType: 'worker',
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: pickColor({ name: 'bp-support', shade: 100 }),
      }}
    >
      <HeaderNav title={t('loginTitle')} leftElement="drawer" />
      <ScrollView
        style={AppStyles.scrollView}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
          <View style={[AppStyles.invisibleBox, { paddingTop: 20 }]}>
            <Text style={AppStyles.headingTitle}>{t('welcomeToBouwpas')}</Text>
          </View>
          <View style={AppStyles.box}>
            <View>
              <Text style={{ fontSize: 18 }}>{t('noUserAccessDesc')}</Text>
            </View>
          </View>

          <View style={[AppStyles.invisibleBox, { paddingTop: 20 }]}>
            <Pressable onPress={userLogOut} style={AppStyles.button}>
              <FontAwesomeIcon
                icon={['fad', 'sign-out']}
                size={25}
                colors={['bp-white', 'bp-white']}
                colorsLevel={['500', '500']}
              />
              <Text style={[AppStyles.buttonText, { paddingLeft: 10 }]}>{t('settingsLogOut')}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
