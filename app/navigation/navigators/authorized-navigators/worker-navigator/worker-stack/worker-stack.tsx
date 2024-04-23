import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';

import { workerStackRoutes } from './worker-stack-routes';

const Stack = createNativeStackNavigator();

export const WorkerStackNavigator: FC = () => {
  return (
    <Stack.Navigator>
      {workerStackRoutes.map(route => (
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
