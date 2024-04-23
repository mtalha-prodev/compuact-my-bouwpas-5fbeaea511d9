import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigatorName, MissingScreens } from 'app/navigation/route-names';
import { NotFoundScreen } from 'app/screens';
import React, { FC } from 'react';

import { RouterNavigatorStack } from './router-navigator-stack/router-navigator-stack';

const Stack = createNativeStackNavigator();

export const RouterNavigator: FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={AuthNavigatorName.MAIN_STACK_GROUP}
        component={RouterNavigatorStack}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={MissingScreens.GLOBAL}
        component={NotFoundScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
