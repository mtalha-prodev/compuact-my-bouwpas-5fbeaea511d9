import { pickColor } from 'app/theme/native-base/pick-color';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import HStack from '../hstack/hstack';
import { Text } from '../text/text';

interface IButtonGroupProps {
  buttons: string[];
  selectedIndex: number;
  selectedBgColor?: string;
  selectedTextColor?: string;
  notSelectedTextColor?: string;
  borderColor?: string;
  borderWidth?: string | number;
  onValueChange: (index: number) => void;
}

export const ButtonGroup = ({
  buttons,
  onValueChange,
  selectedIndex,
  selectedBgColor = pickColor({ name: 'bp-support', shade: 500 }),
  selectedTextColor = 'white',
  notSelectedTextColor = pickColor({ name: 'bp-primary', shade: 500 }),
  borderColor = 'bp-primary.500',
  borderWidth = 1,
}: IButtonGroupProps) => {
  return (
    <HStack rounded={14} borderWidth={1} borderColor="white">
      {buttons.map((btn, index, { length }) => {
        const isSelected = index === selectedIndex;

        const isFirstELement = index === 0;
        const isLastElement = index + 1 === length;

        const btnBgSelected = isSelected ? selectedBgColor : 'transparent';
        const textColorSelected = isSelected ? selectedTextColor : notSelectedTextColor;

        return (
          <TouchableOpacity
            onPress={() => onValueChange(index)}
            key={index}
            style={{
              flex: 1,
              borderRadius: 0,
              borderTopLeftRadius: isFirstELement ? 10 : 0,
              borderBottomLeftRadius: isFirstELement ? 10 : 0,
              borderTopRightRadius: isLastElement ? 10 : 0,
              borderBottomRightRadius: isLastElement ? 10 : 0,
              overflow: 'hidden',
              borderColor,
              padding: 8,
              borderWidth: Number(borderWidth), // Convert borderWidth to a number
              backgroundColor: btnBgSelected,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: textColorSelected,
                fontFamily: 'interstate',
                paddingVertical: 8,
              }}
            >
              {btn}
            </Text>
          </TouchableOpacity>
        );
      })}
    </HStack>
  );
};
