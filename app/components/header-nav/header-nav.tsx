import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AuthNavigatorName } from 'app/navigation/route-names';
import { mainColors } from 'app/theme/native-base/main-colors';
import React, { FC } from 'react';
import { Platform, StatusBar, View } from 'react-native';

import { HeaderNavTypes } from './header-nav.types';
import { FontAwesomeIcon } from '../font-awesome-icon';
import { Pressable } from '../pressable/pressable';
import { Text } from '../text/text';

const BpStatusBar = () => {
  if (Platform.OS === 'ios') {
    StatusBar.setBarStyle('light-content', true);
  }
  return <StatusBar backgroundColor="#475949" translucent />;
};

export const HeaderNav: FC<HeaderNavTypes> = props => {
  const {
    title,
    rightElement,
    bgColor = mainColors({ type: 'main' }),
    leftElement,
    isModal = false,
  } = props;
  const navigation = useNavigation();

  const goBack = () => {
    const canGoBack = navigation.canGoBack();
    if (canGoBack) navigation.goBack();
    else navigation.navigate(AuthNavigatorName.AUTH_NAVIGATOR);
  };

  const toggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const leftIcon =
    leftElement === 'drawer' ? (
      <Pressable onPress={toggleDrawer}>
        <FontAwesomeIcon
          icon={['fas', 'bars']}
          size={40}
          colors={['bp-white', 'bp-white']}
          colorsLevel={['500', '500']}
        />
      </Pressable>
    ) : (
      <Pressable onPress={goBack}>
        <FontAwesomeIcon
          icon={['fas', isModal ? 'times' : 'chevron-left']}
          size={40}
          colors={['bp-white', 'bp-white']}
          colorsLevel={['500', '500']}
        />
      </Pressable>
    );

  return (
    <View
      style={{
        backgroundColor: bgColor,
        zIndex: 999,
      }}
    >
      <BpStatusBar />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: isModal && Platform.OS === 'ios' ? 12 : 6,
          // backgroundColor: 'red',
        }}
      >
        <View style={[{ flex: 0, flexShrink: 1, marginHorizontal: 12, minWidth: 40 }]}>
          {leftElement && leftIcon}
        </View>

        <View
          style={{
            flex: 1,
            flexGrow: 1,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontFamily: 'interstate',
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        <View
          style={{
            flex: 0,
            flexShrink: 1,
            marginHorizontal: 12,
            justifyContent: 'flex-end',
            flexDirection: 'row',
            minWidth: 40,
          }}
        >
          {rightElement && rightElement}
        </View>
      </View>
    </View>
  );
};
