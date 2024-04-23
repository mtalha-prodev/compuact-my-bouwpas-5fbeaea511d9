import { createDrawerNavigator } from '@react-navigation/drawer';
import { CustomDrawer } from 'app/components';
import React from 'react';

import { gatekeeperDrawerRoutes } from './gatekeeper-drawer-routes';

const GatekeeperDrawer = createDrawerNavigator();

export const GatekeeperDrawerNavigator = () => {
  return (
    <GatekeeperDrawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerType: 'slide',
        overlayColor: 'transparent',
      }}
    >
      {gatekeeperDrawerRoutes.map(route => (
        <GatekeeperDrawer.Screen
          key={route.routeName}
          name={route.routeName}
          component={route.component}
          options={{
            headerShown: false,
            title: route.translatedTitle,
            drawerIcon: route.icon as any,
          }}
        />
      ))}
    </GatekeeperDrawer.Navigator>
  );
};
