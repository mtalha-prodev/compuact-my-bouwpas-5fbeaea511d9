import { FontAwesomeIcon as FtAwIcon } from '@fortawesome/react-native-fontawesome';
import { TColorPickLevel, colorPickLevel } from 'app/theme/native-base/color-to-pick.types';
import { pickColorAny, isOfTypeTColorPick } from 'app/theme/native-base/pick-color';
import React, { FC } from 'react';

import { IFontAwesomeProps } from './font-awesome-icon.types';
import Box from '../app-box/app-box';

/**
 * @property icon
 * default icon is ['fad', 'home']
 * to prevent type error
 */

export const FontAwesomeIcon: FC<IFontAwesomeProps> = props => {
  const {
    icon = ['fad', 'home'],
    size = 20,
    colors = ['bp-primary', 'bp-support'],
    colorsLevel = ['500', '300'],
    secondaryColors = '',
    secondaryColorsLevel = '',
    secondaryOpacity = 0.4,
  } = props;

  //@Later when implementing dark mode, replace colorsLevel with number
  const parseColorLevel = (value: any): TColorPickLevel => {
    const intValue: any = parseInt(value, 10);
    if (colorPickLevel.includes(intValue)) {
      return intValue;
    }
    return 500;
  };

  const iconColor = pickColorAny({ name: colors[0], shade: parseColorLevel(colorsLevel[0]) });

  //Get secondary color, if there is any..
  let secondaryIconColor;
  const secondaryColor: any = secondaryColors[0];
  const secondryColorLevel: any = secondaryColorsLevel[0];
  if (secondaryColor && isOfTypeTColorPick(secondaryColor)) {
    secondaryIconColor = pickColorAny({
      name: secondaryColor,
      shade: parseColorLevel(secondryColorLevel),
    });
  }

  return (
    <Box width="auto">
      <FtAwIcon
        icon={icon}
        size={size}
        color={iconColor}
        {...(secondaryColors ? { secondaryColor: secondaryIconColor } : null)}
        {...(secondaryColors ? { secondaryOpacity } : null)}
      />
    </Box>
  );
};
