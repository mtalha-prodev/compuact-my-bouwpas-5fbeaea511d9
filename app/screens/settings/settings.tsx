import { FontAwesomeIcon, HeaderNav, AppApiErrorLogs, AppLanguagePicker } from 'app/components';
import { GenericAlert } from 'app/components/alert';
import { Pressable } from 'app/components/pressable/pressable';
import { Text } from 'app/components/text/text';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import { useWhoAmI } from 'app/hooks';
import { useStore } from 'app/store/main-store/main-store';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import * as Application from 'expo-application';
import { osVersion } from 'expo-device';
import { openURL } from 'expo-linking';
import { openAuthSessionAsync, openBrowserAsync } from 'expo-web-browser';
import React, { FC } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useQueryClient } from 'react-query';

import { UserLogo } from './user-logo';

export const Settings: FC = () => {
  const { t } = React.useContext(LocalizationContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const responsiveWidth = getResponsiveWidth();

  const isSignedIn = useStore.useBootstrapState().isSignedIn;
  const userType = useStore.useCurrentUserType();

  const queryClient = useQueryClient();

  const { refetch } = useWhoAmI(false);

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

  const versionString = () => {
    const appVersion = Application.nativeApplicationVersion;
    const nativeBuildVersion = Application.nativeBuildVersion;

    return `${appVersion} - ${nativeBuildVersion} - ${osVersion}`;
  };

  const onRefresh = async () => {
    if (userType === 'worker') {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: pickColor({ name: 'bp-support', shade: 100 }),
      }}
    >
      <HeaderNav title={t('menuItem6')} leftElement="drawer" />
      <ScrollView
        style={AppStyles.scrollView}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
          <UserLogo />

          <View style={AppStyles.invisibleBox}>
            <Text style={[AppStyles.headingTitle, AppStyles.marginLeft2, AppStyles.marginTop2]}>
              {t('switchLanguage')}
            </Text>
          </View>
          <View style={AppStyles.box}>
            <AppLanguagePicker />
          </View>

          <View style={AppStyles.invisibleBox}>
            <Text style={[AppStyles.headingTitle, AppStyles.marginLeft2]}>
              {t('settingsHelpCenter')}
            </Text>
          </View>
          <View style={AppStyles.box}>
            <View>
              <Pressable onPress={() => openBrowserAsync(env.MBA_HELP_URL)}>
                <View style={AppStyles.hStack}>
                  <FontAwesomeIcon
                    icon={['fad', 'book-open']}
                    size={25}
                    colors={['bp-primary', 'bp-primary']}
                    colorsLevel={['500', '500']}
                  />
                  <Text style={[AppStyles.fontSizeMd, AppStyles.marginLeft2]}>
                    {t('settingsHelpCenter')}
                  </Text>
                </View>
              </Pressable>

              <View style={[AppStyles.divider]} />

              <Pressable
                onPress={() => {
                  openURL('mailto:support@bouwpas.nl?subject=[Bouwpas] Feedback').catch(() => {
                    GenericAlert({ title: t('noMailClientFound') });
                  });
                }}
              >
                <View style={AppStyles.hStack}>
                  <FontAwesomeIcon
                    icon={['fad', 'lightbulb-on']}
                    size={25}
                    colors={['bp-primary', 'bp-primary']}
                    colorsLevel={['500', '500']}
                  />
                  <Text style={[AppStyles.fontSizeMd, AppStyles.marginLeft2]}>
                    {t('settingsSendFeedback')}
                  </Text>
                </View>
              </Pressable>

              <View style={AppStyles.divider} />

              <Pressable
                onPress={() => {
                  openURL('mailto:support@bouwpas.nl?subject=[Bouwpas] Vraag').catch(() => {
                    GenericAlert({ title: t('noMailClientFound') });
                  });
                }}
              >
                <View style={AppStyles.hStack}>
                  <FontAwesomeIcon
                    icon={['fad', 'info-circle']}
                    size={25}
                    colors={['bp-primary', 'bp-primary']}
                    colorsLevel={['500', '500']}
                  />
                  <Text style={[AppStyles.fontSizeMd, AppStyles.marginLeft2]}>
                    {t('settingsAskQuestion')}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          {isSignedIn && (
            <View style={AppStyles.box}>
              <Pressable onPress={userLogOut}>
                <View style={AppStyles.hStack}>
                  <FontAwesomeIcon
                    icon={['fad', 'sign-out']}
                    size={25}
                    colors={['bp-primary', 'bp-primary']}
                    colorsLevel={['500', '500']}
                  />
                  <Text style={[AppStyles.fontSizeMd, AppStyles.marginLeft2]}>
                    {t('settingsLogOut')}
                  </Text>
                </View>
              </Pressable>
            </View>
          )}

          <View style={AppStyles.box}>
            <View style={AppStyles.hStack}>
              <FontAwesomeIcon
                icon={['fad', 'mobile-android']}
                size={25}
                colors={['bp-primary', 'bp-primary']}
                colorsLevel={['500', '500']}
              />
              <Text
                style={[AppStyles.fontSizeMd, AppStyles.marginLeft2]}
              >{`Bouwpas: ${versionString()}`}</Text>
            </View>
          </View>

          <AppApiErrorLogs />
        </View>
      </ScrollView>
    </View>
  );
};
