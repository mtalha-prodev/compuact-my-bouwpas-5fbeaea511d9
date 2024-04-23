import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigatorOptions } from 'app/navigation/navigation-options';
import { SignedInNavigatorNames } from 'app/navigation/route-names';
import { useStore } from 'app/store/main-store/main-store';
import React, { FC } from 'react';

import { CompanyuserDrawerNavigator } from '../authorized-navigators/companyuser-navigator/companyuser-drawer/companyuser-drawer';
import { GatekeeperDrawerNavigator } from '../authorized-navigators/gatekeeper-navigator/gatekeeper-drawer/gatekeeper-drawer';
import { WorkerDrawerNavigator } from '../authorized-navigators/worker-navigator/worker-drawer/worker-drawer';

const Stack = createNativeStackNavigator();

export const UserModesNavigator: FC = () => {
  const currentUserType = useStore.useCurrentUserType();

  const worker = currentUserType === 'worker';
  const gatekeeper = currentUserType === 'gatekeeper';
  const companyuser = currentUserType === 'companyuser';
  return (
    <Stack.Navigator>
      <Stack.Group>
        {worker && (
          <Stack.Screen
            name={SignedInNavigatorNames.WORKER_DRAWER_NAVIGATOR}
            options={navigatorOptions}
            component={WorkerDrawerNavigator}
          />
        )}
        {gatekeeper && (
          <Stack.Screen
            name={SignedInNavigatorNames.GATEKEEPER_DRAWER_NAVIGATOR}
            options={navigatorOptions}
            component={GatekeeperDrawerNavigator}
          />
        )}
        {companyuser && (
          <Stack.Screen
            name={SignedInNavigatorNames.COMPANYUSER_DRAWER_NAVIGATOR}
            options={navigatorOptions}
            component={CompanyuserDrawerNavigator}
          />
        )}
      </Stack.Group>
    </Stack.Navigator>
  );
};
