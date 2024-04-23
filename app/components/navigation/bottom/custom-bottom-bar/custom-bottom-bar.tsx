import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TxKeyPath } from 'app/i18n';
import React, { FC } from 'react';
import { View } from 'react-native';

import { BottomTabBarItem } from '../bottom-tab-item/bottom-tab-item';

export const CustomBottomTabBar: FC<BottomTabBarProps> = ({ navigation, state, descriptors }) => {
  const onTabSelect = (index: number) => () => {
    navigation.navigate(state.routeNames[index]);
  };

  return (
    <View style={{ backgroundColor: '#F4F3F1' }}>
      <View
        style={{
          marginTop: 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const label = options.title;
            const translatedLabel = options.tabBarLabel as TxKeyPath | undefined;

            return (
              <BottomTabBarItem
                key={index}
                title={label}
                translatedTitle={translatedLabel}
                selected={isFocused}
                icon={options.tabBarIcon}
                onSelect={onTabSelect(index)}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};
