import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomBottomTabBar } from 'app/components';
import React, { FC } from 'react';

import { gatekeeperTabRoutes } from './gatekeeper-tabs-routes';

const Tab = createBottomTabNavigator();

export const GatekeeperTabs: FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomBottomTabBar {...props} />}
    >
      {gatekeeperTabRoutes.map(({ routeName, component, title, translatedTitle, icon }) => (
        <Tab.Screen
          key={routeName}
          name={routeName}
          component={component}
          options={{
            title,
            tabBarLabel: translatedTitle,
            tabBarIcon: icon as any,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};
