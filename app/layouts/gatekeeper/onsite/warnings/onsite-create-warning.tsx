import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { RoutesTypes } from 'app/Types/nav';
import { HeaderNav, InfoBlock } from 'app/components';
import { Pressable } from 'app/components/pressable/pressable';
import VStack from 'app/components/vstack/vstack';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import { useApiCallStatus, useApiMutation, useGatekeeperProjectRegistrations } from 'app/hooks';
import { SignedInUser } from 'app/navigation/route-names';
import { mainColors } from 'app/theme/native-base/main-colors';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import dayjs from 'dayjs';
import React, { FC } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DatePicker, Picker, PickerItem } from 'react-native-woodpicker';

type RouteProps = RouteProp<RoutesTypes, SignedInUser.GATEKEEPER_ONSITE_CREATE_WARNING>;

type TWarningData = {
  workerId: number | null;
  warningReason: string;
  warningDate: Date | null;
  expirationDate: Date | null;
  projectId: number;
  warningTypeId: 1 | 2;
};

export const OnsiteCreateWarning: FC = () => {
  const { t } = React.useContext(LocalizationContext);

  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const responsiveWidth = getResponsiveWidth();

  const [pickedDate] = React.useState<Date>(new Date(Date.now()));
  const [pickedWorkerName, setPickedWorkerName] = React.useState<PickerItem>({
    label: t('warningSelectWorkerPlacheloder'),
    value: 0,
  });

  const [pickedCardType, setPickedCardType] = React.useState<PickerItem>({
    label: t('warningYellowCard'),
    value: 1,
  });

  const [newWarningData, setNewWarningData] = React.useState<TWarningData>({
    workerId: null,
    warningReason: '',
    warningDate: new Date(Date.now()),
    expirationDate: new Date(Date.now()),
    projectId: Number(route.params.projectId),
    warningTypeId: 1,
  });

  const {
    data: projectRegistrations,
    status,
    error,
  } = useGatekeeperProjectRegistrations(route.params.projectId);

  const { showData, showLoading, showError } = useApiCallStatus(status);

  const {
    mutateAsync: addNewWarning,
    isLoading: isNewWarningLoading,
    error: newWarningError,
  } = useApiMutation();

  const handleText = (): string => (pickedDate ? pickedDate.toDateString() : '');

  const mutateWarningData = (newValue: TWarningData) => {
    setNewWarningData({
      ...newValue,
    });
  };

  const onDateChange = (type: 'current' | 'expiration') => {
    return (selectedDate: Date | null) => {
      if (type === 'current' && selectedDate) {
        mutateWarningData({
          ...newWarningData,
          warningDate: selectedDate,
        });
      }
      if (type === 'expiration' && selectedDate) {
        mutateWarningData({
          ...newWarningData,
          expirationDate: selectedDate,
        });
      }
    };
  };

  const workerIdCondition = newWarningData.workerId;
  const warningReasonCondition = newWarningData.warningReason.length >= 5;

  const sendNewWarning = async () => {
    try {
      await addNewWarning({
        key: `${env.ONSITE_WARNINGS}/${route.params.projectId}/0`,
        apiLink: env.ONSITE_WARNINGS.slice(0, -1),
        method: 'post',
        apiData: newWarningData,
      });
      navigation.goBack();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: mainColors({ type: 'bg' }) }}>
      <HeaderNav title="Create Warning" leftElement="back" />
      {showLoading && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator size="small" color={pickColorSingleShade({ name: 'bp-white' })} />
        </View>
      )}

      {showError && error && (
        <View
          style={{
            backgroundColor: pickColorSingleShade({ name: 'bp-white' }),
            margin: 8,
            padding: 16,
            borderRadius: 16,
            shadowColor: pickColorSingleShade({ name: 'bp-black' }),
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <InfoBlock
            title="Ooops..."
            type="error"
            icon={['fad', 'exclamation-square']}
            apiError={error}
          />
        </View>
      )}

      {showData && projectRegistrations && (
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          extraHeight={100}
        >
          <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
            <View
              style={{
                borderRadius: 16,
                backgroundColor: pickColorSingleShade({ name: 'bp-white' }),
                shadowColor: pickColorSingleShade({ name: 'bp-black' }),
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
                elevation: 8,
                marginHorizontal: 8,
                marginTop: 8,
                padding: 16,
              }}
            >
              <Picker
                item={pickedWorkerName}
                items={projectRegistrations.map(
                  ({ firstname, lastname, preposition, workerId }) => ({
                    label: `${firstname}${
                      preposition.length > 0 ? ` ${preposition}` : ' '
                    }${lastname}`,
                    value: workerId,
                  }),
                )}
                onItemChange={selectedItem => {
                  setPickedWorkerName(selectedItem);
                  mutateWarningData({
                    ...newWarningData,
                    workerId: selectedItem.value,
                  });
                }}
                InputComponent={props => {
                  const { togglePicker } = props;
                  return (
                    <VStack>
                      <Text>{t('myEmployersCompanyName')}</Text>
                      <TextInput
                        placeholder={pickedWorkerName.label}
                        style={{
                          borderWidth: 2,
                          borderColor: pickColor({ name: 'bp-primary', shade: 500 }),
                          color: pickColor({ name: 'bp-primary', shade: 500 }),
                          paddingVertical: 4,
                        }}
                        placeholderTextColor={pickColor({ name: 'bp-primary', shade: 500 })}
                      />
                      <Pressable
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                        onPress={togglePicker}
                      />
                    </VStack>
                  );
                }}
              />

              <Picker
                item={pickedCardType}
                items={[
                  { label: t('warningYellowCard'), value: 1 },
                  { label: t('warningRedowCard'), value: 2 },
                ]}
                onItemChange={selectedItem => {
                  setPickedCardType(selectedItem);
                  mutateWarningData({
                    ...newWarningData,
                    warningTypeId: selectedItem.value,
                  });
                }}
                InputComponent={props => {
                  const { togglePicker } = props;
                  return (
                    <VStack>
                      <Text>{t('warningCardTitle')}</Text>
                      <TextInput
                        placeholder={pickedCardType.label}
                        style={{
                          borderWidth: 2,
                          borderColor: pickColor({ name: 'bp-primary', shade: 500 }),
                          color: pickColor({ name: 'bp-primary', shade: 500 }),
                          paddingVertical: 4,
                        }}
                        placeholderTextColor={pickColor({ name: 'bp-primary', shade: 500 })}
                      />
                      <Pressable
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                        onPress={togglePicker}
                      />
                    </VStack>
                  );
                }}
              />

              <VStack>
                <Text>{t('warningReasonTitle')}</Text>
                <TextInput
                  value={newWarningData.warningReason}
                  onChangeText={text => {
                    mutateWarningData({
                      ...newWarningData,
                      warningReason: text,
                    });
                  }}
                  multiline
                  numberOfLines={4}
                  style={{
                    height: 80,
                    borderWidth: 2,
                    borderColor: pickColor({ name: 'bp-primary', shade: 500 }),
                    color: pickColor({ name: 'bp-primary', shade: 500 }),
                    padding: 8,
                  }}
                  placeholder="Text Area Placeholder"
                  selectionColor={pickColor({ name: 'bp-primary', shade: 500 })}
                  placeholderTextColor={pickColor({ name: 'bp-primary', shade: 500 })}
                  underlineColorAndroid="transparent"
                />
              </VStack>

              <DatePicker
                value={newWarningData.warningDate}
                onDateChange={onDateChange('current')}
                text={handleText()}
                title=""
                isNullable={false}
                iosDisplay="inline"
                iosMode="date"
                minimumDate={new Date(Date.now())}
                androidDisplay="default"
                InputComponent={props => {
                  const { togglePicker } = props;
                  return (
                    <VStack>
                      <Text>{t('warningDateTitle')}</Text>
                      <TextInput
                        placeholder={dayjs(newWarningData.warningDate).format('DD-MM-YYYY')}
                        style={{
                          borderWidth: 2,
                          borderColor: pickColor({ name: 'bp-primary', shade: 500 }),
                          color: pickColor({ name: 'bp-primary', shade: 500 }),
                          paddingVertical: 4,
                        }}
                        placeholderTextColor={pickColor({ name: 'bp-primary', shade: 500 })}
                      />
                      <Pressable
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                        onPress={togglePicker}
                      />
                    </VStack>
                  );
                }}
              />

              <DatePicker
                value={newWarningData.expirationDate}
                onDateChange={onDateChange('expiration')}
                text={handleText()}
                title=""
                isNullable={false}
                iosDisplay="inline"
                iosMode="date"
                androidDisplay="default"
                minimumDate={new Date(Date.now())}
                InputComponent={({ togglePicker }) => (
                  <VStack>
                    <Text>{t('warningExpireDateTitle')}</Text>
                    <TextInput
                      placeholder={dayjs(newWarningData.expirationDate).format('DD-MM-YYYY')}
                      style={{
                        borderWidth: 2,
                        borderColor: pickColor({ name: 'bp-primary', shade: 500 }),
                        color: pickColor({ name: 'bp-primary', shade: 500 }),
                        paddingVertical: 4,
                      }}
                      placeholderTextColor={pickColor({ name: 'bp-primary', shade: 500 })}
                    />
                    <Pressable
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      }}
                      onPress={togglePicker}
                    />
                  </VStack>
                )}
              />

              {newWarningError && (
                <VStack>
                  <InfoBlock
                    title="Oooops..."
                    type="error"
                    icon={['fad', 'exclamation-square']}
                    apiError={newWarningError}
                  />
                </VStack>
              )}

              <VStack>
                <TouchableOpacity
                  disabled={!warningReasonCondition || !workerIdCondition}
                  onPress={sendNewWarning}
                  style={[AppStyles.button, { padding: 20, marginBottom: 12, marginLeft: 8 }]}
                >
                  <>
                    {isNewWarningLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={pickColorSingleShade({ name: 'bp-white' })}
                      />
                    ) : (
                      <Text style={AppStyles.buttonText}>{t('warningSubmitButton')}</Text>
                    )}
                  </>
                </TouchableOpacity>
              </VStack>
            </View>
          </View>
        </KeyboardAwareScrollView>
      )}
    </View>
  );
};
