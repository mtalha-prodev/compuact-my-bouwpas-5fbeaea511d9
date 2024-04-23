import * as LocalAuthentication from 'expo-local-authentication';
import React from 'react';

interface IUseLocalAuth {
  checkOnMount: boolean;
}

type TLocalAuth = {
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[] | null;
  enrolledLevel: LocalAuthentication.SecurityLevel | null;
  localAuthResponse: LocalAuthentication.LocalAuthenticationResult | null;
};

export const useLocalAuth = ({ checkOnMount }: IUseLocalAuth) => {
  const [localAuth, setLocalAuth] = React.useState<TLocalAuth>({
    hasHardware: false,
    isEnrolled: false,
    supportedTypes: null,
    enrolledLevel: null,
    localAuthResponse: null,
  });

  const checkLocalAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const enrolledLevel = await LocalAuthentication.getEnrolledLevelAsync();
    setLocalAuth({ ...localAuth, hasHardware, isEnrolled, supportedTypes, enrolledLevel });
  };

  const localAuthAsync = async (options?: LocalAuthentication.LocalAuthenticationOptions) => {
    const localAuthResponse = await LocalAuthentication.authenticateAsync(options);
    setLocalAuth({ ...localAuth, localAuthResponse });
  };

  React.useEffect(() => {
    if (checkOnMount) {
      checkLocalAuth();
    }
  }, []);

  return { localAuth, checkLocalAuth, localAuthAsync };
};
