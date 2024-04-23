import { IProjectItem } from 'app/components/pressable-list-item/pressable-list-item.types';
import { pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React, { FC } from 'react';
import { View } from 'react-native';

import { Pressable } from '../pressable/pressable';
import { Text } from '../text/text';

export const PressableItemLite: FC<IProjectItem> = ({ title, subtitle, onPress }) => {
  const responsiveWidth = getResponsiveWidth();

  return (
    <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
      <Pressable onPress={onPress}>
        <View
          style={{
            marginHorizontal: 12,
            paddingHorizontal: 3,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'interstate',
              textTransform: 'uppercase',
              color: pickColorSingleShade({ name: 'bp-black' }),
              fontWeight: 'bold',
            }}
            numberOfLines={2}
          >
            {title}
          </Text>
          <View
            style={[AppStyles.hStack, { justifyContent: 'space-between', alignItems: 'center' }]}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'bilo',
                  color: pickColorSingleShade({ name: 'bp-black' }),
                }}
              >
                {subtitle}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
      <View style={AppStyles.divider} />
    </View>
  );
};
