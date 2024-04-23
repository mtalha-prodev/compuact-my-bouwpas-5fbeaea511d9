import { useNavigation } from '@react-navigation/core';
import { FontAwesomeIcon } from 'app/components';
import Skeleton from 'app/components/app-skeleton/app-skeleton';
import { LocalizationContext } from 'app/contexts';
import { useApiCallStatus, useWhoAmI, useWorkerBadges } from 'app/hooks';
import { GlobalRoutes, SignedInUser } from 'app/navigation/route-names';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React, { FC, useEffect } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

export const WorkerProjectListHeader: FC = React.memo(() => {
  const { t } = React.useContext(LocalizationContext);
  const responsiveWidth = getResponsiveWidth();

  const navigation = useNavigation();

  const { status: badgesStatus, error: badgesError } = useWorkerBadges();

  const { showLoading } = useApiCallStatus(badgesStatus);

  const { data: user, error: whoAmIError } = useWhoAmI(true);
  const avatarTitle = (name: string) => (name ? name.toString().substring(0, 1).toUpperCase() : '');
  const [hasUuid, setHasUuid] = React.useState(false);
  const [userUuid, setuserUuid] = React.useState('');
  const [userFirstName, setUserFirstName] = React.useState('');
  const [userLastName, setUserLastName] = React.useState('');

  useEffect(() => {
    if (user !== undefined) {
      setUserFirstName(user.firstname);
      setUserLastName(user.lastname);
      if (user.uuid !== undefined) {
        const hasCurrentUuid = user.uuid.length === 36;
        setHasUuid(hasCurrentUuid);
        if (hasCurrentUuid) {
          setuserUuid(user.uuid);
        }
      }
    }
  }, [user]);

  const openQrScannerScreen = () => {
    navigation.navigate(GlobalRoutes.QR_SCANNER, {
      screenName: SignedInUser.WORKER_PROJECTS,
      screenBottomBtn: 'project_attendance',
    });
  };

  const openUuidQrModal = () => {
    if (hasUuid) {
      navigation.navigate(SignedInUser.WORKER_QR_UUID, { uuid: userUuid });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: pickColor({ name: 'bp-primary', shade: 500 }),
          borderRadius: 0,
          marginHorizontal: 0,
          marginTop: 0,
          paddingHorizontal: 8,
          height: 79,
          shadowColor: 'transparent',
        }}
      >
        <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
          {showLoading ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 12,
                borderColor: pickColorSingleShade({ name: 'bp-white' }),
                padding: 16,
                height: 73,
                marginLeft: 4,
              }}
            >
              <Skeleton
                style={{
                  flex: 1,
                  borderRadius: 8,
                  marginTop: -6,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
              <View style={{ flex: 3, flexDirection: 'column', marginHorizontal: 36 }}>
                <View style={{ marginTop: -6 }}>
                  {[1, 2, 3].map(line => (
                    <Skeleton
                      key={line}
                      style={{
                        height: 11,
                        borderRadius: 5,
                        marginBottom: 9,
                        width: line === 3 ? '60%' : '100%',
                      }}
                    />
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, width: '100%' }}>
              <View
                style={{
                  height: 73,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TouchableOpacity onPress={openUuidQrModal}>
                    <View
                      style={{
                        backgroundColor: pickColor({ name: 'bp-yellow-card', shade: 500 }),
                        width: 70,
                        height: 70,
                        borderColor: pickColor({ name: 'bp-primary', shade: 500 }),
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderRadius: 999,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {user && hasUuid ? (
                        <FontAwesomeIcon
                          icon={['fad', 'id-badge']}
                          size={32}
                          colors={['bp-black', 'bp-black']}
                          colorsLevel={['500', '500']}
                        />
                      ) : (
                        <Text
                          style={{
                            fontSize: 24,
                            color: pickColor({ name: 'bp-support', shade: 500 }),
                            fontFamily: 'interstate',
                          }}
                        >
                          {`${avatarTitle(userFirstName)}${avatarTitle(userLastName)}`}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flex: 2,
                    marginHorizontal: 8,
                  }}
                >
                  <TouchableOpacity
                    onPress={openQrScannerScreen}
                    style={[
                      AppStyles.button,
                      {
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 0,
                        backgroundColor: pickColorSingleShade({ name: 'bp-white' }),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        AppStyles.buttonText,
                        {
                          color: pickColorSingleShade({ name: 'bp-black' }),
                          marginLeft: 0,
                          fontSize: 18,
                          fontFamily: 'interstate',
                        },
                      ]}
                    >
                      {t('scanQrCodeTitle')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
});
