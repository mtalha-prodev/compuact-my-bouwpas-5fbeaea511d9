import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';

import { authStackRoutes } from './auth-stack-routes';

const Stack = createNativeStackNavigator();

export const AuthStackNavigator: FC = () => {
  return (
    <Stack.Navigator>
      {authStackRoutes.map(({ routeName, component, options }) => (
        <Stack.Screen key={routeName} name={routeName} component={component} options={options} />
      ))}
    </Stack.Navigator>
  );
};
