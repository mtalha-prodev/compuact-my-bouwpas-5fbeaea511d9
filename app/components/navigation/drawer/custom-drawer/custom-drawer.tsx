import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import React, { FC } from 'react';
import { Image, View } from 'react-native';

import { UserModeSwitcher } from '../../../user-mode-switcher/user-mode-switcher';
import { DrawerItem } from '../drawer-item/drawer-item';

export const CustomDrawer: FC<DrawerContentComponentProps> = ({
  navigation,
  state,
  descriptors,
}) => {
  const { routes, index } = state;
  const focusedRoute = routes[index].name;

  const openScreen = (route: string) => () => {
    navigation.navigate(route);
  };

  return (
    <View
      style={{
        paddingBottom: 16,
        backgroundColor: '#475949',
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: 'white',
        paddingHorizontal: 8,
      }}
    >
      <DrawerContentScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View>
          <Image
            source={require('app/assets/images/bp/logo.png')}
            alt="Logo"
            style={{
              width: '100%',
              height: 50,
              marginBottom: 16,
              resizeMode: 'contain',
            }}
          />
        </View>
        <View>
          {routes.map(({ key, name }) => {
            const options = descriptors[key].options;
            return (
              <DrawerItem
                key={options.title}
                translatedTitle={options.title as any}
                onPress={openScreen(name)}
                iconLeft={options.drawerIcon}
                iconRight={['fas', 'chevron-right']}
                selected={focusedRoute === name}
              />
            );
          })}
        </View>

        <View>
          <UserModeSwitcher />
        </View>
      </DrawerContentScrollView>
    </View>
  );
};
