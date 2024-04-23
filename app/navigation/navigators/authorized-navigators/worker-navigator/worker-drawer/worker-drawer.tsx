import { createDrawerNavigator } from '@react-navigation/drawer';
import { CustomDrawer } from 'app/components';
import React from 'react';

import { workerDrawerRoutes } from './worker-drawer-routes';

const WorkerDrawer = createDrawerNavigator();

export const WorkerDrawerNavigator = () => {
  return (
    <WorkerDrawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerType: 'slide',
        overlayColor: 'transparent',
      }}
    >
      {workerDrawerRoutes.map(route => (
        <WorkerDrawer.Screen
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
    </WorkerDrawer.Navigator>
  );
};
