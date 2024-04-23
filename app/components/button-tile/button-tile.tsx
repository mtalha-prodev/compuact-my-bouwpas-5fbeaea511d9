import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import React from 'react';
import { View } from 'react-native';

import { Pressable } from '../pressable/pressable';
import { Text } from '../text/text';

interface IButtonTileProps {
  label: string;
  topRightNode?: React.ReactNode;
  topRightIcon?: IconProp;
  topRightText?: string;
  onPress?: () => void;
  bgColor?: string;
}

export const ButtonTile = ({
  label,
  topRightNode,
  topRightIcon,
  topRightText,
  onPress,
  bgColor = pickColor({ name: 'bp-support', shade: 500 }),
}: IButtonTileProps) => {
  const topRightElement = topRightIcon ?? topRightText;

  return (
    <Pressable style={{ flex: 1 }} onPress={onPress}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: bgColor,
          borderRadius: 12,
          padding: 0,
          marginHorizontal: 4,
          borderWidth: 2,
          borderColor: bgColor,
          height: 164,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: 54,
            padding: 16,
          }}
        >
          {topRightNode}
          {topRightElement ? (
            topRightIcon ? (
              <FontAwesomeIcon
                icon={topRightIcon}
                size={28}
                color={pickColorSingleShade({ name: 'bp-white' })}
              />
            ) : (
              <Text
                style={{
                  color: pickColorSingleShade({ name: 'bp-white' }),
                  fontSize: 22,
                  fontFamily: 'interstate',
                }}
              >
                {topRightText}
              </Text>
            )
          ) : null}
        </View>
        <Text
          style={{
            color: pickColorSingleShade({ name: 'bp-white' }),
            fontSize: 18,
            padding: 16,
            fontFamily: 'interstate',
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};
