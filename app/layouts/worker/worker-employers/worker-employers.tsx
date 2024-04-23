import { HeaderNav, InfoBlock } from 'app/components';
import { Text } from 'app/components/text/text';
import { LocalizationContext } from 'app/contexts';
import { useWhoAmI } from 'app/hooks';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React, { FC } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

export const WorkerEmployers: FC = () => {
  const { t } = React.useContext(LocalizationContext);
  const responsiveWidth = getResponsiveWidth();

  const { data: worker, error: workerError, isLoading: isWorkerLoading } = useWhoAmI();

  return (
    <View style={{ flex: 1, backgroundColor: pickColor({ name: 'bp-support', shade: 100 }) }}>
      <HeaderNav title={t('menuItem3')} leftElement="drawer" />

      <ScrollView
        style={AppStyles.scrollView}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
          <View style={AppStyles.invisibleBox}>
            <Text style={[AppStyles.headingTitle, { paddingTop: 16 }]}>
              {t('myEmployersDescr')}
            </Text>
          </View>
          <View style={AppStyles.box}>
            <Text>{t('myEmployersText')}</Text>
          </View>

          <View style={AppStyles.box}>
            {isWorkerLoading && (
              <ActivityIndicator
                size="large"
                color={pickColor({ name: 'bp-primary', shade: 500 })}
              />
            )}

            {workerError && (
              <View
                style={{
                  marginHorizontal: 2,
                  marginVertical: 4,
                }}
              >
                <InfoBlock
                  title={t('errorEmployersList')}
                  icon={['fad', 'exclamation-square']}
                  type="error"
                  apiError={workerError}
                />
              </View>
            )}

            {worker?.companies.map(company => (
              <Text key={company.companyname}>{company.companyname}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
