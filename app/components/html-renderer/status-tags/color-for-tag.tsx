import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';

import { IColorForTagProps } from './color-for-tag.types';
export const colorForTag: IColorForTagProps = {
  green: {
    backGroundColor: pickColorSingleShade({ name: 'bp-valid' }),
    color: ['bp-valid', 'bp-valid'],
    colorLevel: ['500', '500'],
  },
  red: {
    backGroundColor: pickColor({ name: 'bp-cancel', shade: 700 }),
    color: ['bp-cancel', 'bp-cancel'],
    colorLevel: ['700', '700'],
  },
  black: {
    backGroundColor: pickColorSingleShade({ name: 'bp-black' }),
    color: ['bp-black', 'bp-black'],
    colorLevel: ['500', '500'],
  },
  warning: {
    backGroundColor: pickColor({ name: 'bp-warning', shade: 700 }),
    color: ['bp-warning', 'bp-warning'],
    colorLevel: ['700', '700'],
  },
  grey: {
    backGroundColor: pickColor({ name: 'bp-support', shade: 400 }),
    color: ['bp-support', 'bp-support'],
    colorLevel: ['400', '400'],
  },
  orange: {
    backGroundColor: pickColor({ name: 'bp-cancel', shade: 500 }),
    color: ['bp-cancel', 'bp-cancel'],
    colorLevel: ['500', '500'],
  },
  cyan: {
    backGroundColor: pickColorSingleShade({ name: 'bp-cyan' }),
    color: ['bp-cyan', 'bp-cyan'],
    colorLevel: ['500', '500'],
  },
  yellow: {
    backGroundColor: pickColor({ name: 'bp-accent', shade: 500 }),
    color: ['bp-accent', 'bp-accent'],
    colorLevel: ['500', '500'],
  },
  default: {
    backGroundColor: pickColor({ name: 'bp-warning', shade: 700 }),
    color: ['bp-warning', 'bp-warning'],
    colorLevel: ['700', '700'],
  },
};
