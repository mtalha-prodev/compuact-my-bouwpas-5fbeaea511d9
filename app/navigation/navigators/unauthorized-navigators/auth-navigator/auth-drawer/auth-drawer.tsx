import { createDrawerNavigator } from '@react-navigation/drawer';
import { CustomDrawer } from 'app/components';
import React, { FC } from 'react';

import { authDrawerRoutes } from './auth-drawer-routes';

const AuthDrawer = createDrawerNavigator();

export const AuthNavigator: FC = () => (
  <AuthDrawer.Navigator
    drawerContent={props => <CustomDrawer {...props} />}
    screenOptions={{
      drawerType: 'slide',
      overlayColor: 'transparent',
    }}
  >
    {authDrawerRoutes.map(route => (
      <AuthDrawer.Screen
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
  </AuthDrawer.Navigator>
);
