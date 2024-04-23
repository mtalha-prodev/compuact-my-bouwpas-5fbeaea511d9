import { FC } from 'react';
import { Alert } from 'react-native';

export interface IAlertProps {
  title: string;
  message?: string;
}

export const GenericAlert: FC<IAlertProps> = props => {
  Alert.alert(props.title, props.message ?? undefined);
  return null;
};
