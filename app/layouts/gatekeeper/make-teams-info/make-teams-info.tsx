import { HeaderNav } from 'app/components';
import { RouteProp, useRoute } from '@react-navigation/native';
import { WorkerHtmlRender } from 'app/components/html-renderer/worker-html-render';
import { LocalizationContext } from 'app/contexts';
import { mainColors } from 'app/theme/native-base/main-colors';
import { View, ScrollView } from 'react-native';
import React, { FC } from 'react';
import { AppStyles } from 'app/theme/style/AppStyles';
import { RoutesTypes } from 'app/Types/nav';
import { SignedInUser } from 'app/navigation/route-names';

type RouteProps = RouteProp<RoutesTypes, SignedInUser.GATEKEEPER_MAKE_TEAMS_INFO>;

export const MakeTeamsInfo: FC = React.memo(() => {
  const { t } = React.useContext(LocalizationContext);
  const route = useRoute<RouteProps>();
  const makeTeamsInfo = route.params.makeTeamsInfo;
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f3' }}>
      <HeaderNav title={t('workerInfoTitle')} leftElement="back" />
      <ScrollView
        style={AppStyles.scrollView}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View>
          {makeTeamsInfo && (
            <>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <WorkerHtmlRender html={makeTeamsInfo} />
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
});
