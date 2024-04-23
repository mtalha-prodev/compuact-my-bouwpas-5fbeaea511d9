import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { IFontAwesomeProps } from 'app/components';
import { TxKeyPath } from 'app/i18n';

type TScreenRoute = {
  routeName: string;
  component: any;
  title?: string;
  translatedTitle?: TxKeyPath | undefined;
  icon?: IFontAwesomeProps['icon'];
  options?: NativeStackNavigationOptions;
};

export type TScreenRoutes = TScreenRoute[];
