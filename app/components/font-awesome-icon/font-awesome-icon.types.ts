import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ViewStyle } from 'react-native';

import { TColorPickName, TColorPickSingleShade } from '../../theme/native-base/color-to-pick.types';

export type TKeyColors = TColorPickName | TColorPickSingleShade;
export type TColorsLevel = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export interface IFontAwesomeProps {
  icon?: IconProp;
  size?: number;
  containerStyle?: ViewStyle;
  colors?: TKeyColors[];
  colorsLevel?: TColorsLevel[];
  secondaryColors?: TKeyColors[] | '';
  secondaryColorsLevel?: TColorsLevel[] | '';
  secondaryOpacity?: number;
}
