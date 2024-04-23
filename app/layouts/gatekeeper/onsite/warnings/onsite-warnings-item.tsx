import { RouteProp, useRoute } from '@react-navigation/core';
import { RoutesTypes } from 'app/Types/nav';
import { HeaderNav } from 'app/components';
import { Text } from 'app/components/text/text';
import { useOnsiteProjectWarningItem } from 'app/hooks';
import { SignedInUser } from 'app/navigation/route-names';
import { mainColors } from 'app/theme/native-base/main-colors';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import dayjs from 'dayjs';
import React, { FC } from 'react';
import { View, ScrollView } from 'react-native';

type RouteProps = RouteProp<RoutesTypes, SignedInUser.GATEKEEPER_ONSITE_WARNING_ITEM>;

export const OnsiteWarningsItem: FC = () => {
  const route = useRoute<RouteProps>();
  const responsiveWidth = getResponsiveWidth();

  const { data: warning } = useOnsiteProjectWarningItem({
    projectId: route.params.projectId,
    warningId: route.params.warningId,
  });

  const cardColor = () => {
    if (warning && warning[0].warningTypeId === 1)
      return pickColor({ name: 'bp-yellow-card', shade: 500 });
    if (warning && warning[0].warningTypeId === 2)
      return pickColor({ name: 'bp-red-card', shade: 500 });
    return pickColor({ name: 'bp-yellow-card', shade: 500 });
  };

  return (
    <View style={{ flex: 1, backgroundColor: mainColors({ type: 'bg' }) }}>
      <HeaderNav title={warning ? warning[0]?.warningReason : 'Warning'} leftElement="back" />
      {warning && (
        <ScrollView>
          <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 4,
              }}
            >
              <View
                style={{
                  width: 120,
                  height: 120,
                  backgroundColor: pickColor({ name: 'bp-support-gray', shade: 500 }),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 60,
                }}
              >
                <View
                  style={{
                    width: 100,
                    height: 100,
                    backgroundColor: cardColor(),
                    borderRadius: 50,
                  }}
                />
              </View>
            </View>

            <View
              style={{
                borderRadius: 20,
                backgroundColor: pickColorSingleShade({ name: 'bp-white' }),
                shadowColor: pickColorSingleShade({ name: 'bp-black' }),
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
                elevation: 8,
                marginHorizontal: 2,
                marginTop: -8,
              }}
            >
              <View
                style={{
                  margin: 4,
                }}
              >
                <View>
                  <Text>Naam:</Text>
                  <Text>{warning[0].userCreated}</Text>
                </View>

                <View>
                  <Text>Reden:</Text>
                  <Text>{warning[0].warningReason}</Text>
                </View>

                <View>
                  <Text>Daatum:</Text>
                  <Text>{dayjs(warning[0].warningDate).format('DD-MM-YYYY')}</Text>
                </View>

                <View>
                  <Text>Verloopt:</Text>
                  <Text>{dayjs(warning[0].expirationDate).format('DD-MM-YYYY')}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};
