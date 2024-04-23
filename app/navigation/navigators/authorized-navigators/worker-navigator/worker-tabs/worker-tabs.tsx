import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomBottomTabBar } from 'app/components';
import React, { FC } from 'react';

import { workerTabRoutes } from './worker-tabs-routes';

const Tab = createBottomTabNavigator();

export const WorkerTabs: FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomBottomTabBar {...props} />}
    >
      {workerTabRoutes.map(({ routeName, component, title, translatedTitle, icon }) => (
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
