import { pickColor } from 'app/theme/native-base/pick-color';
import React, { FC } from 'react';
import { View } from 'react-native';

import { IDropdownListItemProps } from './dropdown.types';
import Box from '../app-box/app-box';
import { FontAwesomeIcon } from '../font-awesome-icon';
import HStack from '../hstack/hstack';
import { Text } from '../text/text';

export const DropdownListItem: FC<IDropdownListItemProps> = React.memo(
  ({ item, isLast, isSelected }) => {
    const bottomRadius = isLast ? 8 : 0;
    const textColor = isSelected ? 'white' : pickColor({ name: 'bp-primary', shade: 500 });
    return (
      <Box
        borderBottomLeftRadius={bottomRadius}
        borderBottomRightRadius={bottomRadius}
        width="auto"
        px="4"
        py="20"
        flexDirection="row"
        justifyContent="space-between"
        bg={isSelected ? pickColor({ name: 'bp-primary', shade: 500 }) : 'transparent'}
      >
        <HStack>
          {item.leftElement ? (
            <View style={{ marginHorizontal: 16 }}>{item.leftElement}</View>
          ) : null}
          <Text
            style={{
              marginLeft: 16,
              fontSize: 20,
              color: textColor,
            }}
            numberOfLines={1}
          >
            {item.label}
          </Text>
        </HStack>
        {isSelected && (
          <View style={{ marginHorizontal: 16 }}>
            <FontAwesomeIcon
              icon={['fas', 'check']}
              size={25}
              colors={['bp-white', 'bp-white']}
              colorsLevel={['500', '500']}
            />
          </View>
        )}
      </Box>
    );
  },
);
