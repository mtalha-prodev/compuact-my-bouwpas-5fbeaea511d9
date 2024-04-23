import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React, { FC } from 'react';
import { View } from 'react-native';

import { InfoBlockProps } from './info-block.types';
import { FontAwesomeIcon } from '../font-awesome-icon';
import { Text } from '../text/text';

export const InfoBlock: FC<InfoBlockProps> = ({
  bgColor = 'white',
  color = 'black',
  title,
  description,
  type,
  apiError,
  icon = ['fas', 'check'],
}) => {
  const responsiveWidth = getResponsiveWidth();
  return (
    <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
      <View
        style={[
          AppStyles.box,
          {
            borderRadius: 12,
            backgroundColor: bgColor,
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 8,
            width: '100%',
          }}
        >
          <View style={{ paddingRight: 16 }}>
            <FontAwesomeIcon
              icon={icon}
              size={50}
              colors={['bp-primary', 'bp-primary']}
              colorsLevel={['500', '500']}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ color }}>{title}</Text>
            {description && <Text style={{ color }}>{description}</Text>}
            {type === 'error' && apiError && <Text style={{ color }}>{apiError.errorStatus}</Text>}
          </View>
        </View>
      </View>
    </View>
  );
};
