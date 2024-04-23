import { Text } from 'app/components/text/text';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React, { FC } from 'react';
import { View } from 'react-native';

import { InfoBlockProps } from './info-block.types';
import { FontAwesomeIcon } from '../font-awesome-icon';

export const BigInfoBlock: FC<InfoBlockProps> = ({
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
    <View style={[{ width: responsiveWidth }]}>
      <View style={[AppStyles.box, { paddingVertical: 48 }]}>
        <View
          style={{
            borderRadius: 12,
            backgroundColor: bgColor,
          }}
        >
          <View style={[{ alignItems: 'center', marginVertical: 16, width: '100%' }]}>
            <View style={{ paddingBottom: 16 }}>
              <FontAwesomeIcon
                icon={icon}
                size={128}
                colors={['bp-primary', 'bp-primary']}
                colorsLevel={['500', '500']}
              />
            </View>

            <Text style={{ fontSize: 18, color }}>{title}</Text>
            {description ? <Text style={{ fontSize: 18, color }}>{description}</Text> : null}
            {type === 'error' && apiError && <Text style={{ color }}>{apiError.errorStatus}</Text>}
          </View>
        </View>
      </View>
    </View>
  );
};
