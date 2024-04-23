import { TKeyColors, TColorsLevel } from 'app/components/font-awesome-icon';

export interface IColorForTagProps {
  green: {
    backGroundColor: string;
    color?: TKeyColors[];
    colorLevel?: TColorsLevel[];
  };
  red: {
    backGroundColor: string;
    color?: TKeyColors[];
    colorLevel?: TColorsLevel[];
  };
  black: {
    backGroundColor: string;
    color?: TKeyColors[];
    colorLevel?: TColorsLevel[];
  };
  cyan: {
    backGroundColor: string;
    color?: TKeyColors[];
    colorLevel?: TColorsLevel[];
  };
  yellow: {
    backGroundColor: string;
    color?: TKeyColors[];
    colorLevel?: TColorsLevel[];
  };
  orange: {
    backGroundColor: string;
    color?: TKeyColors[];
    colorLevel?: TColorsLevel[];
  };
  grey: {
    backGroundColor: string;
    color?: TKeyColors[];
    colorLevel?: TColorsLevel[];
  };
  warning: {
    backGroundColor: string;
    color?: TKeyColors[];
    colorLevel?: TColorsLevel[];
  };
  default: {
    backGroundColor: string;
    color?: TKeyColors[];
    colorLevel?: TColorsLevel[];
  };
}
