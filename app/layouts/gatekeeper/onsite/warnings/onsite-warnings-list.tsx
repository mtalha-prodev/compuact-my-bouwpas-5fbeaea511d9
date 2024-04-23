import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { RoutesTypes } from 'app/Types/nav';
import { FontAwesomeIcon, HeaderNav, InfoBlock } from 'app/components';
import { FloatingActionButton } from 'app/components/button-group/floating-action-button';
import { Pressable } from 'app/components/pressable/pressable';
import { Text } from 'app/components/text/text';
import { useOnsiteProjectWarnings } from 'app/hooks';
import { SignedInUser } from 'app/navigation/route-names';
import { mainColors } from 'app/theme/native-base/main-colors';
import { pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import dayjs from 'dayjs';
import React, { FC } from 'react';
import { View, ScrollView } from 'react-native';

type RouteProps = RouteProp<RoutesTypes, SignedInUser.GATEKEEPER_ONSITE_WARNINGS_LIST>;

export const OnsiteWarningsList: FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const responsiveWidth = getResponsiveWidth();

  const { data: projectWarnings } = useOnsiteProjectWarnings(route.params.projectId);

  const openWarning = (warningId: number) => {
    return () =>
      navigation.navigate(SignedInUser.GATEKEEPER_ONSITE_WARNING_ITEM, {
        warningId,
        projectId: route.params.projectId,
      });
  };

  const openCreateWarning = () => {
    navigation.navigate(SignedInUser.GATEKEEPER_ONSITE_CREATE_WARNING, {
      projectId: route.params.projectId,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: mainColors({ type: 'bg' }) }}>
      <HeaderNav title="Warning" leftElement="back" />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={AppStyles.scrollView}
      >
        <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
          <View
            style={{
              paddingHorizontal: 16,
              backgroundColor: pickColorSingleShade({ name: 'bp-white' }),
              borderRadius: 12,
              margin: 8,
              paddingTop: 16,
            }}
          >
            {projectWarnings && !projectWarnings.length && (
              <View
                style={{
                  marginVertical: 4,
                }}
              >
                <InfoBlock
                  title="Geen warnings"
                  type="error"
                  icon={['fad', 'exclamation-square']}
                />
              </View>
            )}
            {projectWarnings?.map((warning, index) => (
              <View key={warning.warningId}>
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={openWarning(warning.warningId)}
                >
                  <View
                    style={{
                      alignItems: 'center',
                      marginRight: 16,
                    }}
                  >
                    <Text>{dayjs(warning.warningDate).format('DD')}</Text>
                    <Text>{dayjs(warning.warningDate).format('MMM')}</Text>
                  </View>

                  <View
                    style={[
                      AppStyles.hStack,
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flex: 1,
                      },
                    ]}
                  >
                    <Text numberOfLines={1}>{warning.warningReason}</Text>

                    <View>
                      <FontAwesomeIcon
                        icon={['fas', 'chevron-right']}
                        size={25}
                        colors={['bp-primary', 'bp-primary']}
                        colorsLevel={['500', '500']}
                      />
                    </View>
                  </View>
                </Pressable>
                {index !== projectWarnings.length - 1 && <View style={AppStyles.divider} />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <FloatingActionButton onPress={openCreateWarning} iconName="plus" />
    </View>
  );
};
