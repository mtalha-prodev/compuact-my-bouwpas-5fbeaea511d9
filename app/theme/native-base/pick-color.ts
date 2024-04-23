import {
  TColorPickLevel,
  TColorPickName,
  TColorPickSingleShade,
  colorPickSingleShade,
  colorPickName,
} from './color-to-pick.types';
import { colors } from './colors';

const pickColor = ({
  name = 'bp-primary',
  shade = 500,
}: {
  name: TColorPickName;
  shade: TColorPickLevel;
}) => {
  return colors[name][shade];
};

const pickColorSingleShade = ({ name }: { name: TColorPickSingleShade }) => {
  return colors[name][500];
};

//When this is called and a single shade color is picked, it will always return the 500 value.
const pickColorAny = ({
  name,
  shade,
}: {
  name: TColorPickSingleShade | TColorPickName;
  shade: TColorPickLevel;
}) => {
  if (isOfTypeTColorPickSingleShade(name)) {
    return colors[name][500];
  } else {
    return colors[name][shade];
  }
};

const isOfTypeTColorPickSingleShade = (value: any): value is TColorPickSingleShade => {
  return colorPickSingleShade.includes(value);
};

const isOfTypeTColorPick = (value: any): value is TColorPickSingleShade | TColorPickName => {
  return colorPickSingleShade.includes(value) || colorPickName.includes(value);
};

export { pickColor, pickColorSingleShade, pickColorAny, isOfTypeTColorPick };
