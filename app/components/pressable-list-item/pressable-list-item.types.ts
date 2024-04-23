import { IFontAwesomeProps } from 'app/components/font-awesome-icon/font-awesome-icon.types';

export interface IProjectItem {
  id?: number;
  title: string;
  subtitle?: string;
  image?: null | string;
  rightBottomIcon?: IFontAwesomeProps['icon'] | null | undefined;
  rightBottomText?: string | null | undefined;
  isSuccess?: boolean | null;
  onPress?: () => void;
}
