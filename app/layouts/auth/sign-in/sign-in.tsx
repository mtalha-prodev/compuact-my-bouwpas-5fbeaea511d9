import { RouteProp, useRoute } from '@react-navigation/native';
import { TQrContent } from 'app/Types';
import { RoutesTypes } from 'app/Types/nav';
import { HeaderNav, InfoBlock } from 'app/components';
import { FontAwesomeIcon } from 'app/components/font-awesome-icon/font-awesome-icon';
import { Text } from 'app/components/text/text';
import { env } from 'app/config/env';
import { useCredentialsBootstrap, useQrRegistration } from 'app/hooks';
import { useAuth } from 'app/hooks/react-query/appCalls/useAuth';
import { AuthScreens } from 'app/navigation/route-names';
import { useStore } from 'app/store/main-store/main-store';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import { tcatch } from 'app/utils';
import * as WebBrowser from 'expo-web-browser';
import { openBrowserAsync } from 'expo-web-browser';
import React, { FC } from 'react';
import {
  useWindowDimensions,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

WebBrowser.maybeCompleteAuthSession();

type RouteProps = RouteProp<RoutesTypes, AuthScreens.SIGN_IN>;

export const SignIn: FC = () => {
  const route = useRoute<RouteProps>();

  const { height } = useWindowDimensions();
  const responsiveWidth = getResponsiveWidth();

  const isBootstrapLoading = useStore.useBootstrapState().isLoading;

  const qrData: TQrContent = route.params?.qrData.content;

  const { authAsync, isTokenLoading, tokenError, accountTypesError, isAccountTypesLoading } =
    useAuth();

  const { isLoading, error: bootstrapError } = useCredentialsBootstrap();

  const { openQrScreen, t } = useQrRegistration({ routeName: route.name, qrData, authAsync });

  const isButtonLoading =
    isTokenLoading || isLoading || isAccountTypesLoading || isBootstrapLoading;

  const openCreateAccountHelper = async () => {
    await tcatch(openBrowserAsync(env.MBA_CREATE_ACCOUNT));
  };

  return (
    <View style={{ flex: 1, backgroundColor: pickColor({ name: 'bp-support', shade: 100 }) }}>
      <HeaderNav title={t('loginTitle')} leftElement="drawer" />

      <ScrollView
        contentContainerStyle={{
          paddingVertical: height / 14,
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={AppStyles.scrollView}
      >
        <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 28,
                marginHorizontal: 0,
                paddingTop: 10,
                fontFamily: 'interstate',
              }}
            >
              {t('authTitle')}
            </Text>
          </View>

          {accountTypesError ? (
            <View>
              <InfoBlock
                title={t('errorAccountTypes')}
                type="error"
                icon={['fad', 'exclamation-square']}
                apiError={accountTypesError}
              />
            </View>
          ) : null}

          {tokenError ? (
            <View>
              <InfoBlock
                title={t('errorToken')}
                type="error"
                icon={['fad', 'exclamation-square']}
                apiError={tokenError}
              />
            </View>
          ) : null}

          {bootstrapError?.errorStatus === 500 ? (
            <View style={AppStyles.box}>
              <InfoBlock
                title={t('errorBootstrap-500')}
                description={t('errorBootstrapDescr-500')}
                type="error"
                icon={['fad', 'exclamation-square']}
                apiError={bootstrapError}
              />
            </View>
          ) : null}

          <View style={AppStyles.box}>
            <TouchableOpacity
              onPress={() => authAsync()}
              disabled={isButtonLoading}
              style={[
                AppStyles.button,
                { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
              ]}
            >
              {isButtonLoading ? (
                <ActivityIndicator
                  size="small"
                  color={pickColorSingleShade({ name: 'bp-white' })}
                />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={['fas', 'user-hard-hat']}
                    size={25}
                    colors={['bp-white', 'bp-white']}
                    colorsLevel={['500', '500']}
                  />
                  <Text style={[AppStyles.buttonText, { paddingLeft: 10 }]}>{t('loginLabel')}</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openCreateAccountHelper()}
              disabled={isButtonLoading}
              style={[
                AppStyles.button,
                { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
              ]}
            >
              {isButtonLoading ? (
                <ActivityIndicator
                  size="small"
                  color={pickColorSingleShade({ name: 'bp-white' })}
                />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={['fas', 'question-circle']}
                    size={25}
                    colors={['bp-white', 'bp-white']}
                    colorsLevel={['500', '500']}
                  />
                  <Text style={[AppStyles.buttonText, { paddingLeft: 10 }]}>
                    {t('getStartedLabel')}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openQrScreen}
              disabled={isButtonLoading}
              style={[
                AppStyles.button,
                { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
              ]}
            >
              {isButtonLoading ? (
                <ActivityIndicator
                  size="small"
                  color={pickColorSingleShade({ name: 'bp-white' })}
                />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={['fas', 'qrcode']}
                    size={25}
                    colors={['bp-white', 'bp-white']}
                    colorsLevel={['500', '500']}
                  />
                  <Text style={[AppStyles.buttonText, { paddingLeft: 10 }]}>
                    {t('activateOnsiteLabel')}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
