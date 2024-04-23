import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { LocalizationContext } from 'app/contexts/LocalizationContext';
import { TApiError } from 'app/lib/api';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import React, { FC } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';

import { FontAwesomeIcon } from '../font-awesome-icon/font-awesome-icon';
import { Pressable } from '../pressable/pressable';
import { Text } from '../text/text';

export type TAction = {
  status: 'checkIn' | 'checkOut' | 'loading' | 'error' | null;
  error?: TApiError;
};

export interface IActionBlockProps {
  title: string;
  icon: IconProp;
  closeBtnText: string;
  closeBtnIsAbort: boolean;
  actionType: TAction;
  error?: TApiError;
  onClose: () => void;
  onAction?: () => void;
}

export const AttendanceAction: FC<IActionBlockProps> = ({
  title,
  icon,
  closeBtnText,
  closeBtnIsAbort = false,
  onClose,
  onAction,
  actionType,
  error,
}) => {
  const { t } = React.useContext(LocalizationContext);
  return (
    <Animated.View entering={SlideInRight.delay(25)} exiting={SlideOutLeft}>
      {actionType.status === 'loading' ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator size="large" color={pickColor({ name: 'bp-primary', shade: 500 })} />
        </View>
      ) : null}

      {actionType.status === 'error' ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {error?.errorStatus === 400 || error === undefined || error?.errorStatus === 500 ? (
            <Text style={{ fontSize: 30, textAlign: 'center' }}>{t('checkInNotAllowed')}</Text>
          ) : (
            <Text style={{ fontSize: 46, textAlign: 'center' }}>{error?.errorStatus}</Text>
          )}

          {error?.errorData.message && (
            <Text style={{ textAlign: 'center' }}>{error.errorData.message}</Text>
          )}

          {error?.errorStatus === 400 || error === undefined || error?.errorStatus === 500 ? (
            <Text style={{ fontSize: 17, textAlign: 'center', marginVertical: 30 }}>
              {t('checkInNotAllowedDesc')}
            </Text>
          ) : (
            <Pressable
              onPress={onAction}
              style={{
                marginVertical: 8,
              }}
            >
              <FontAwesomeIcon
                icon={['fad', 'exclamation-square']}
                size={120}
                colors={['bp-red-card', 'bp-red-card']}
                colorsLevel={['500', '500']}
              />
            </Pressable>
          )}

          <TouchableOpacity
            onPress={onClose}
            style={[
              AppStyles.button,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                backgroundColor: closeBtnIsAbort
                  ? pickColor({ name: 'bp-red-card', shade: 500 })
                  : pickColor({ name: 'bp-support', shade: 500 }),
                width: '100%',
              },
            ]}
          >
            <>
              <FontAwesomeIcon
                icon={['fas', 'times']}
                size={25}
                colors={['bp-white', 'bp-white']}
                colorsLevel={['500', '500']}
              />
              <Text
                style={[
                  AppStyles.buttonText,
                  { color: pickColorSingleShade({ name: 'bp-white' }) },
                ]}
              >
                {closeBtnText}
              </Text>
            </>
          </TouchableOpacity>
        </View>
      ) : null}

      {actionType.status === 'checkIn' || actionType.status === 'checkOut' ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 22, textAlign: 'center' }}>{title}</Text>

          <Pressable
            onPress={onAction}
            style={{
              marginVertical: 20,
            }}
          >
            <View
              style={[
                AppStyles.box,
                {
                  backgroundColor: '#199C4D',
                  padding: 44,
                  borderRadius: 999,
                  borderColor: pickColor({ name: 'bp-primary', shade: 300 }),
                  borderWidth: 6,
                  shadowColor: 'black',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <FontAwesomeIcon
                icon={icon}
                size={100}
                colors={['bp-white', 'bp-white']}
                colorsLevel={['500', '500']}
              />
            </View>
          </Pressable>

          <TouchableOpacity
            onPress={onClose}
            style={[
              AppStyles.button,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                backgroundColor: closeBtnIsAbort
                  ? pickColorSingleShade({ name: 'bp-white' })
                  : pickColor({ name: 'bp-support', shade: 500 }),
                borderStyle: 'solid',
                borderWidth: 2,
                width: '100%',
                padding: 10,
              },
            ]}
          >
            <>
              <FontAwesomeIcon
                icon={['fas', 'times']}
                size={20}
                colors={['bp-black', 'bp-black']}
                colorsLevel={['500', '500']}
              />
              <Text style={[AppStyles.buttonText, { color: closeBtnIsAbort ? 'black' : 'white' }]}>
                {closeBtnText}
              </Text>
            </>
          </TouchableOpacity>
        </View>
      ) : null}
    </Animated.View>
  );
};
