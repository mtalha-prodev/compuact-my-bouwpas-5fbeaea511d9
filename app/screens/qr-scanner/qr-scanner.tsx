import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RoutesTypes } from 'app/Types/nav';
import { FontAwesomeIcon, HeaderNav } from 'app/components';
import { Text } from 'app/components/text/text';
import VStack from 'app/components/vstack/vstack';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import { GlobalRoutes } from 'app/navigation/route-names';
import { mainColors } from 'app/theme/native-base/main-colors';
import { pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { delay, tcatch } from 'app/utils';
import { PermissionStatus, CameraView, Camera } from 'expo-camera/next';
import * as Haptics from 'expo-haptics';
import { parse, openSettings } from 'expo-linking';
import { openBrowserAsync } from 'expo-web-browser';
import jwt_decode from 'jwt-decode';
import React, { useRef } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import * as Sentry from 'sentry-expo';

type RouteProps = RouteProp<RoutesTypes, GlobalRoutes.QR_SCANNER>;

const qrViewThrottle = 400;

export const QrScanner = () => {
  const route = useRoute<RouteProps>();

  const bgColors = mainColors({ type: 'main' });
  const navigation = useNavigation();
  const { t } = React.useContext(LocalizationContext);

  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = React.useState<PermissionStatus | null>(null);
  const [torch, setTorch] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [scanned, setScanned] = React.useState(false);
  const [ratio, setRatio] = React.useState('');

  const { height } = useWindowDimensions();

  const {
    params: { screenName: screenToGoBack, screenId, screenIdPropName, screenBottomBtn },
  } = route;

  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status);
  };

  const granted = hasPermission === PermissionStatus.GRANTED && show;
  const denied = hasPermission === PermissionStatus.DENIED && show;
  const undetermined = hasPermission === PermissionStatus.UNDETERMINED && show;

  const showCameraViewWithDelay = async () => {
    try {
      await delay(qrViewThrottle);
      await requestPermission();
      setShow(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Sentry.Native.captureMessage('Could not use the camera due to lack of permissions');
    }
  };

  const toggleTorch = () => setTorch(prev => !prev);

  const scanAgain = () => setScanned(false);

  const onBarCodeScan = async (scanningResult: { data: string }) => {
    setScanned(true);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const trimmedData = scanningResult.data.replace(/\r?\n|\r/g, '');
    const parsedData = parse(trimmedData);
    let decodedData;

    try {
      const data = jwt_decode(parsedData.path as string);
      decodedData = data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // If we cannot decode the jwt, it's not a jwt... no problem. We move on.
    }

    const propName = screenIdPropName as string;
    const params = screenId
      ? {
          qrData: {
            content: decodedData ? decodedData : parsedData,
            rawScannedData: trimmedData,
          },
          [propName]: screenId,
        }
      : {
          qrData: {
            content: decodedData ? decodedData : parsedData,
            rawScannedData: trimmedData,
          },
        };

    setShow(false);
    await delay(50);
    navigation.navigate(screenToGoBack, { ...params });
  };

  const cameraViewHeight = height / 2;

  const openBrowserGatekeeperUuidHelper = async () => {
    await tcatch(openBrowserAsync(env.MBA_HELP_SCAN_UUID));
  };

  const openBrowserToolboxHelper = async () => {
    await tcatch(openBrowserAsync(env.MBA_HELP_SCAN_TOOLBOX_ATTENDANCE));
  };

  const openBrowserAttendanceHelper = async () => {
    await tcatch(openBrowserAsync(env.MBA_HELP_SCAN_ATTENDANCE));
  };

  React.useEffect(() => {
    showCameraViewWithDelay();
    return () => {
      setTorch(false);
    };
  }, []);
  React.useEffect(() => {}, [torch]);

  return (
    <View style={{ flex: 1, backgroundColor: bgColors }}>
      <HeaderNav leftElement="back" title={t('scanQrCodeTitle')} isModal />
      <View
        style={{
          width: '100%',
          height: cameraViewHeight,
          backgroundColor: pickColorSingleShade({ name: 'bp-black' }),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {granted && (
          <CameraView
            barcodeScannerSettings={{
              barCodeTypes: ['qr'],
            }}
            ref={cameraRef}
            onBarcodeScanned={scanned ? undefined : onBarCodeScan}
            style={StyleSheet.absoluteFill}
            enableTorch={!!torch}
          />
        )}

        {granted && (
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={require('app/assets/images/bp/qr_corner.png')}
              resizeMode="cover"
              alt="qr"
              style={{ width: '80%', height: '80%' }}
            />
          </View>
        )}

        {granted && !scanAgain && (
          <View
            style={{
              position: 'absolute',
              right: 20,
              bottom: 4,
              margin: 10,
              paddingRight: 40,
            }}
          >
            <TouchableOpacity onPress={scanAgain} style={[AppStyles.button, { padding: 13 }]}>
              <FontAwesomeIcon
                icon={['fas', 'repeat']}
                size={20}
                colors={['bp-white', 'bp-white']}
                colorsLevel={['500', '500']}
              />
            </TouchableOpacity>
          </View>
        )}

        {granted && (
          <View
            style={{
              position: 'absolute',
              right: 4,
              bottom: 4,
              margin: 10,
            }}
          >
            <TouchableOpacity onPress={toggleTorch} style={[AppStyles.button, { padding: 13 }]}>
              <FontAwesomeIcon
                icon={['fas', 'flashlight']}
                size={20}
                colors={!torch ? ['bp-white', 'bp-white'] : ['bp-accent', 'bp-accent']}
                colorsLevel={['500', '500']}
              />
            </TouchableOpacity>
          </View>
        )}

        {(denied || undetermined) && (
          <VStack
            space={4}
            alignItems="center"
            justifyContent="center"
            rounded="xl"
            bg={pickColorSingleShade({ name: 'bp-white' })}
            py={20}
            px={10}
          >
            <Text style={[AppStyles.headingTitle, AppStyles.marginLeft2, { marginVertical: 10 }]}>
              {t('blockedPermissionTitle')}
            </Text>
            <Text style={{ paddingBottom: 10 }}>{t('blockedPermissionText')}</Text>
            <TouchableOpacity onPress={openSettings} style={AppStyles.button}>
              <>
                <FontAwesomeIcon
                  icon={['fas', 'cog']}
                  size={25}
                  colors={['bp-white', 'bp-white']}
                  colorsLevel={['500', '500']}
                />
                <Text style={AppStyles.buttonText}>{t('settingsTitle')}</Text>
              </>
            </TouchableOpacity>
          </VStack>
        )}
      </View>

      <View style={AppStyles.invisibleBox}>
        {screenBottomBtn === 'qr_register' && (
          <View
            style={[
              AppStyles.button,
              {
                justifyContent: 'center',
              },
            ]}
          >
            <Text style={AppStyles.buttonText}>{t('qrRegister')}</Text>
          </View>
        )}

        {screenBottomBtn === 'project_attendance' && (
          <TouchableOpacity
            onPress={openBrowserAttendanceHelper}
            style={[
              AppStyles.button,
              {
                justifyContent: 'center',
              },
            ]}
          >
            <Text style={AppStyles.buttonText}>{t('qrAttendanceScannable')}</Text>
          </TouchableOpacity>
        )}

        {screenBottomBtn === 'toolbox_attendance' && (
          <TouchableOpacity
            onPress={openBrowserToolboxHelper}
            style={[
              AppStyles.button,
              {
                justifyContent: 'center',
              },
            ]}
          >
            <Text style={AppStyles.buttonText}>{t('qrAttendanceScannable')}</Text>
          </TouchableOpacity>
        )}

        {screenBottomBtn === 'gatekeeper_uuid_scanner' && (
          <TouchableOpacity
            onPress={openBrowserGatekeeperUuidHelper}
            style={[
              AppStyles.button,
              {
                justifyContent: 'center',
              },
            ]}
          >
            <Text style={AppStyles.buttonText}>{t('qrAttendanceScannable')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
