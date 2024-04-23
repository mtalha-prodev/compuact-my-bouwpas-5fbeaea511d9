import { RouteProp, useRoute } from '@react-navigation/native';
import { RoutesTypes } from 'app/Types/nav';
import { HeaderNav } from 'app/components';
import { Text } from 'app/components/text/text';
import { LocalizationContext } from 'app/contexts';
import { SignedInUser } from 'app/navigation/route-names';
import { mainColors } from 'app/theme/native-base/main-colors';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

type RouteProps = RouteProp<RoutesTypes, SignedInUser.WORKER_QR_UUID>;

const qrLogo = require('app/assets/images/bp/qr_corner.png');

const calcQrWidth = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { width } = useWindowDimensions();
  const qrWidth = width > 768 ? 400 : width * 0.7;

  return qrWidth;
};

export const QrUuid = () => {
  const route = useRoute<RouteProps>();
  const uuid = route.params.uuid;

  const isUuid = uuid.length === 36;

  const bgColors = mainColors({ type: 'main' });
  const { t } = React.useContext(LocalizationContext);

  const responsiveWidth = getResponsiveWidth();

  return (
    <View style={{ flex: 1, backgroundColor: bgColors }}>
      <HeaderNav leftElement="back" title={t('qrUuidModalLabel')} isModal />
      <View
        style={{
          height: '100%',
          marginHorizontal: 16,
          backgroundColor: 'white',
          borderRadius: 16,
          alignItems: 'center',
        }}
      >
        <View
          style={[
            AppStyles.responsiveWidthBox,
            { width: responsiveWidth, margin: 48, alignItems: 'center' },
          ]}
        >
          {isUuid ? (
            <QRCode
              value={'bouwpas://' + uuid}
              size={calcQrWidth()}
              logo={qrLogo}
              logoSize={60}
              logoBackgroundColor="#fff"
              logoMargin={0}
              logoBorderRadius={12}
              color="#000"
              backgroundColor="#fff"
            />
          ) : (
            <Text>{t('errorNoUuid')} (code: a-201)</Text>
          )}
        </View>
        <View style={{ width: '80%' }}>
          <Text style={AppStyles.heading}>{t('qrUuidHeader')}</Text>
          <Text>{t('qrUuidDescription')}</Text>
        </View>
      </View>
    </View>
  );
};
