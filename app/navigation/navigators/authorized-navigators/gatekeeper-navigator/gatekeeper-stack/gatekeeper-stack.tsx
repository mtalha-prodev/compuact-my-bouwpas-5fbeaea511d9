import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';

import { gatekeeperStackRoutes } from './gatekeeper-stack-routes';

const Stack = createNativeStackNavigator();

export const GatekeeperStackNavigator: FC = () => {
  return (
    <Stack.Navigator>
      {gatekeeperStackRoutes.map(route => (
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
