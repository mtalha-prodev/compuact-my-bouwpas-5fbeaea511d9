import { LocalizationContext } from 'app/contexts';
import { Camera } from 'expo-camera';
import { openSettings } from 'expo-linking';
import { useForegroundPermissions } from 'expo-location';
import React from 'react';
import { Alert } from 'react-native';

export const useAppPermissions = (type?: 'camera' | 'location') => {
  const { t } = React.useContext(LocalizationContext);

  const [status, requestPermission] = useForegroundPermissions();
  const [permission, setPermission] = React.useState<boolean>(false);

  const askLocationPermission = async () => {
    const { status } = await requestPermission();
    if (status === 'granted') {
      setPermission(true);
    } else {
      setPermission(false);
      Alert.alert(t('permissionError'), t('revokePermissionText'), [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        { text: 'OK', onPress: () => openSettings() },
      ]);
    }
  };

  const askCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      setPermission(true);
    } else {
      setPermission(false);
      Alert.alert(t('permissionError'), t('revokePermissionText'), [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        { text: 'OK', onPress: () => openSettings() },
      ]);
    }
  };

  const initialPermissions = () => {
    if (type && type === 'location' && status) {
      setPermission(status.granted);
    }
  };

  React.useEffect(() => {
    initialPermissions();
  }, [status]);

  return {
    permission,
    askLocationPermission,
    askCameraPermission,
  };
};
