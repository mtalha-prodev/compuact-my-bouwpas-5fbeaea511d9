import { useNavigation } from '@react-navigation/native';
import { TQrContent } from 'app/Types';
import { RoutesTypes } from 'app/Types/nav';
import { LocalizationContext } from 'app/contexts';
import { GlobalRoutes } from 'app/navigation/route-names';
import { onQrRegister } from 'app/services/qr-register/qr-register';
import React from 'react';

interface IUseQrRegistrationProps {
  routeName: keyof RoutesTypes;
  qrData: TQrContent;
  authAsync: (formDataCode?: string | undefined) => Promise<void>;
}

export const useQrRegistration = ({ routeName, qrData, authAsync }: IUseQrRegistrationProps) => {
  const navigation = useNavigation();

  const { t, setLocale } = React.useContext(LocalizationContext);

  const openQrScreen = () => {
    navigation.navigate(GlobalRoutes.QR_SCANNER, {
      screenName: routeName,
      screenBottomBtn: 'qr_register',
    });
  };

  React.useEffect(() => {
    onQrRegister(qrData, openQrScreen, t, authAsync);
  }, [qrData]);

  return {
    navigation,
    t,
    setLocale,
    openQrScreen,
  };
};
