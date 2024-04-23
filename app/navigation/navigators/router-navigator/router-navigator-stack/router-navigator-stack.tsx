import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from 'app/components';
import HStack from 'app/components/hstack/hstack';
import { Text } from 'app/components/text/text';
import { LocalizationContext } from 'app/contexts';
import { useAppVersionStatus } from 'app/hooks';
import { useCustomToast } from 'app/hooks/useToast/toastProvider';
import { navigatorOptions } from 'app/navigation/navigation-options';
import {
  AuthNavigatorName,
  GlobalRoutes,
  SignedInNavigatorNames,
} from 'app/navigation/route-names';
import { AppUpdate } from 'app/screens/app-update/app-update';
import { AppVersionLoading } from 'app/screens/app-version-loading/app-version-loading';
import { Wizard } from 'app/screens/wizard/wizard';
import { useStore } from 'app/store/main-store/main-store';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { delay } from 'app/utils';
import * as Linking from 'expo-linking';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';

import { routerNavigatorStackRoutes } from './router-navigator-stack-routes';
import { AuthNavigator } from '../../unauthorized-navigators/auth-navigator/auth-drawer/auth-drawer';
import { UserModesNavigator } from '../../user-modes-navigator/user-modes-navigator';

const Stack = createNativeStackNavigator();

export const RouterNavigatorStack = () => {
  const { t } = React.useContext(LocalizationContext);

  // Let's define and destructure our global state variables/functions
  const bootstrapState = useStore.useBootstrapState();
  const wizard = useStore.useWizard();
  const { showToast } = useCustomToast();

  const { appVersionStatus } = useAppVersionStatus();

  const versionStatusLoading = !appVersionStatus;

  /* const versionStatusLoading = false
  const appVersionStatus = 'moderate' */

  const moderate = appVersionStatus === 'moderate';
  const highest = appVersionStatus === 'highest';
  const updated = appVersionStatus === 'updated';
  const unknown = appVersionStatus === 'unknown';

  const showMainGroup = (moderate || updated || unknown) && !versionStatusLoading && wizard;
  const showWizard = !wizard && (moderate || updated || unknown);

  const openToUpate = () => {
    // eslint-disable-next-line no-unused-expressions
    Platform.OS === 'ios'
      ? Linking.openURL('https://apps.apple.com/us/app/mijn-bouwpas/id1536817500')
      : Linking.openURL('https://play.google.com/store/apps/details?id=nl.bouwpas.my');
  };

  const notifyToUpdate = async () => {
    await delay(2000);
    if (moderate) {
      showToast(
        <TouchableOpacity
          style={{
            marginBottom: 5,
            paddingHorizontal: 4,
            height: 50,
            backgroundColor: pickColor({ name: 'bp-accent', shade: 500 }),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}
          onPress={openToUpate}
        >
          <HStack
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginHorizontal: 12,
            }}
          >
            <FontAwesomeIcon
              icon={['fad', 'store']}
              size={20}
              colors={['bp-accent', 'bp-accent']}
              colorsLevel={['900', '900']}
            />
            <Text style={[AppStyles.fontSizeMd]}>{t('newVersion')}</Text>
          </HStack>
        </TouchableOpacity>,
        4000,
      );
    }
  };

  React.useEffect(() => {
    notifyToUpdate();
  }, []);

  return (
    <Stack.Navigator>
      {versionStatusLoading ? (
        <Stack.Screen
          name={GlobalRoutes.APP_VERSION_LOADING}
          component={AppVersionLoading}
          options={navigatorOptions}
        />
      ) : null}

      {highest ? (
        <Stack.Screen
          name={GlobalRoutes.APP_UPDATE}
          component={AppUpdate}
          options={navigatorOptions}
        />
      ) : null}

      {showWizard ? (
        <Stack.Screen
          name={GlobalRoutes.APP_WIZARD}
          component={Wizard}
          options={navigatorOptions}
        />
      ) : null}

      {showMainGroup ? (
        <Stack.Group>
          {bootstrapState.isSignedIn ? (
            <Stack.Group key="authorized">
              <Stack.Screen
                name={SignedInNavigatorNames.SIGNED_IN_NAVIGATOR}
                component={UserModesNavigator}
                options={navigatorOptions}
              />
            </Stack.Group>
          ) : (
            <Stack.Group key="unauthorized">
              <Stack.Screen
                name={AuthNavigatorName.AUTH_NAVIGATOR}
                component={AuthNavigator}
                options={navigatorOptions}
              />
            </Stack.Group>
          )}
        </Stack.Group>
      ) : null}

      {routerNavigatorStackRoutes.map(route => (
        <Stack.Screen
          key={route.routeName}
          name={route.routeName}
          component={route.component}
          options={route.options}
        />
      ))}
    </Stack.Navigator>
  );
};
