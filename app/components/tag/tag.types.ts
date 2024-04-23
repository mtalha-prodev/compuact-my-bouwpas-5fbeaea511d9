import { IconProp } from '@fortawesome/fontawesome-svg-core';

export type TagTypes = {
  label: string;
  description: string;
  status: 'valid' | 'about-to-expire' | 'expired' | 'unknown';
};

export type TTagColors = {
  primaryColor: string;
  bgColor: string;
  borderColor: string;
  iconName: IconProp;
  txtColor: string;
};
