import { createDrawerNavigator } from '@react-navigation/drawer';
import { CustomDrawer } from 'app/components';
import React from 'react';

import { companyuserDrawerRoutes } from './companyuser-drawer-routes';

const CompanyuserDrawer = createDrawerNavigator();

export const CompanyuserDrawerNavigator = () => {
  return (
    <CompanyuserDrawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerType: 'slide',
        overlayColor: 'transparent',
      }}
    >
      {companyuserDrawerRoutes.map(route => (
        <CompanyuserDrawer.Screen
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
    </CompanyuserDrawer.Navigator>
  );
};
