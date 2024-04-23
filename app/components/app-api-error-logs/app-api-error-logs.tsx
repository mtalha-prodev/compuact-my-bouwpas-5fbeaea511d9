import { LocalizationContext } from 'app/contexts';
import { useStore } from 'app/store/main-store/main-store';
import { AppStyles } from 'app/theme/style/AppStyles';
import dayjs from 'dayjs';
import Constants from 'expo-constants';
import { moveAsync } from 'expo-file-system';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import React, { FC } from 'react';
import { Alert, View } from 'react-native';

import htmlPdfTemplate from './htmlPdfTemplate';
import CustomSpinner from '../app-spinner/AppSpinner';
import { FontAwesomeIcon } from '../font-awesome-icon';
import { Pressable } from '../pressable/pressable';
import { Text } from '../text/text';

export const AppApiErrorLogs: FC = () => {
  const { t } = React.useContext(LocalizationContext);

  const [loading, setLoading] = React.useState(false);

  const apiErrorLogs = useStore.useApiErrors();

  const getLogs = async () => {
    setLoading(true);
    const dateNow = dayjs().format('DD-MM-YYYY');
    const sortedErrors = apiErrorLogs?.reverse().slice(0, 5);

    const newErrors = sortedErrors?.map((el, index) => {
      const {
        deviceYearClass,
        errorData,
        errorResponseHeaderData,
        localAppDate,
        manufacturer,
        modelName,
        osBuildId,
        osVersion,
        url,
        status,
      } = el;

      return `
                  <div style="margin-top:30px;margin-bottom:30px" >
                  <h3> Error: ${index + 1} </h3>
                  <h3> Date: ${dateNow}</h3>
                  <table>
                  <tr>
                      <th>url:</th>
                      <td>${url}</td>
                    </tr>
                    <tr>
                      <th>App version:</th>
                      <td>${Constants.expoConfig?.version}</td>
                    </tr>
                    <tr>
                      <th>status:</th>
                      <td>${status}</td>
                    </tr>
                    <tr>
                      <th>manufacturer:</th>
                      <td>${manufacturer}</td>
                    </tr>
                    <tr>
                      <th>deviceYearClass:</th>
                      <td>${deviceYearClass}</td>
                    </tr>
                    <tr>
                      <th>errorData:</th>
                      <td>${JSON.stringify(errorData)}</td>
                    </tr>
                    <tr>
                      <th>errorResponseHeaderData:</th>
                      <td>${errorResponseHeaderData}</td>
                    </tr>
                    <tr>
                      <th>localAppDate:</th>
                      <td>${localAppDate}</td>
                    </tr>
                    <tr>
                      <th>modelName:</th>
                      <td>${modelName}</td>
                    </tr>
                    <tr>
                      <th>osBuildId:</th>
                      <td>${osBuildId}</td>
                    </tr>
                    <tr>
                      <th>osVersion:</th>
                      <td>${osVersion}</td>
                    </tr>
  
  
                  </table>
                  </div>
                  `;
    });

    const html = await htmlPdfTemplate(newErrors);

    const response = await printToFileAsync({
      html,
    });

    const pdfName = `${response.uri.slice(
      0,
      response.uri.lastIndexOf('/') + 1,
    )}my_bouwpas_network_errors_${dateNow}.pdf`;

    await moveAsync({
      from: response.uri,
      to: pdfName,
    });

    shareAsync(pdfName);

    setLoading(false);
  };

  const clearLogs = () => {
    Alert.alert(t('clearApiLogsTitle'), t('clearApiLogsSubtitle'), [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      { text: 'OK', onPress: () => useStore.setState({ apiErrors: null }) },
    ]);
  };

  return (
    <>
      {apiErrorLogs && apiErrorLogs.length > 0 && (
        <View style={AppStyles.box}>
          <Pressable
            onPress={getLogs}
            disabled={loading}
            onLongPress={clearLogs}
            delayLongPress={1000}
          >
            <View style={AppStyles.hStack}>
              {loading && <CustomSpinner size="small" color="bp-primary.500" />}

              {!loading && (
                <FontAwesomeIcon
                  icon={['fad', 'share-alt']}
                  size={25}
                  colors={['bp-primary', 'bp-primary']}
                  colorsLevel={['500', '500']}
                />
              )}
              <Text style={[AppStyles.fontSizeMd, AppStyles.marginLeft2]}>
                {t('errorLogsTitle')}
              </Text>
            </View>
          </Pressable>
        </View>
      )}
    </>
  );
};
