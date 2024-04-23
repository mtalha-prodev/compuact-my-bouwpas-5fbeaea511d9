import { FontAwesomeIcon } from 'app/components/font-awesome-icon';
import { AppStyles } from 'app/theme/style/AppStyles';
import React, { FC } from 'react';
import { View } from 'react-native';

import { IStatusTagIconProps } from './status-tag-icon.types';
import { colorForTag } from '../html-renderer/status-tags/color-for-tag';
import { iconForTag } from '../html-renderer/status-tags/icon-tag';
import { Text } from '../text/text';

export const StatusTagIcon: FC<IStatusTagIconProps> = props => {
  const { statusText = '', icon, color } = props;

  return (
    <View
      style={{
        backgroundColor: colorForTag[color].backGroundColor,
        alignItems: 'center',
        paddingHorizontal: 0,
        borderRadius: 6,
        flexDirection: 'row',
        borderColor: colorForTag[color].backGroundColor,
        borderWidth: 1,
      }}
    >
      <View
        style={{
          backgroundColor: 'white',
          padding: 5,
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5,
        }}
      >
        <FontAwesomeIcon
          icon={iconForTag[icon].icon}
          size={12}
          colors={colorForTag[color].color}
          secondaryColors={['bp-support', 'bp-support']}
          colorsLevel={colorForTag[color].colorLevel}
          secondaryColorsLevel={['900', '900']}
        />
      </View>

      <Text
        style={[
          AppStyles.fontSizeSm,
          {
            color: 'white',
            marginHorizontal: 6,
            textTransform: 'uppercase',
            fontFamily: 'interstate',
          },
        ]}
      >
        {statusText}
      </Text>
    </View>
  );
};
