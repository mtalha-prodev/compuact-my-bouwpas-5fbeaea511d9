import { FontAwesomeIcon } from 'app/components/font-awesome-icon';
import { IProjectItem } from 'app/components/pressable-list-item/pressable-list-item.types';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React, { FC } from 'react';
import { Image, Text, View } from 'react-native';
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';

import { Pressable } from '../pressable/pressable';

export const PressableListItem: FC<IProjectItem> = ({
  title,
  subtitle,
  image,
  rightBottomIcon = null,
  rightBottomText = '',
  isSuccess = false,
  onPress,
}) => {
  const successBorder = isSuccess
    ? pickColorSingleShade({ name: 'bp-valid' })
    : pickColor({ name: 'bp-support', shade: 400 });

  const responsiveWidth = getResponsiveWidth();

  return (
    <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
      <Pressable onPress={onPress}>
        <View
          style={{
            borderRadius: 12,
            borderWidth: isSuccess ? 3 : 1,
            borderColor: successBorder,
            marginVertical: 2,
            marginHorizontal: 12,
            shadowColor: pickColorSingleShade({ name: 'bp-black' }),
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              width: '100%',
              flex: 1,
              left: 0,
              top: 0,
              overflow: 'hidden',
              height: '100%',
            }}
          >
            {/* Dummy fallback to avoid weird shadow inside the main element */}
            <View
              style={{
                borderRadius: 12,
                width: '100%',
                flex: 1,
                height: '100%',
                backgroundColor: pickColor({ name: 'bp-support', shade: 300 }),
              }}
            />
            {image && (
              <Image
                source={{ uri: image }}
                resizeMode="cover"
                style={{
                  borderRadius: 12,
                  width: '100%',
                  position: 'absolute',
                  zIndex: 9999,
                  left: 0,
                  top: 0,
                  flex: 1,
                  height: '100%',
                }}
                onError={e => console.error(e.nativeEvent.error)}
              />
            )}
          </View>

          <View
            style={{
              borderRadius: 12,
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.4)',
            }}
          >
            <View
              style={{
                margin: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'interstate',
                  textTransform: 'uppercase',
                  color: pickColor({ name: 'bp-primary', shade: 900 }),
                }}
                numberOfLines={1}
              >
                {title}
              </Text>
              <View
                style={[
                  AppStyles.hStack,
                  { justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'bilo',
                      color: pickColor({ name: 'bp-primary', shade: 900 }),
                    }}
                    numberOfLines={1}
                  >
                    {subtitle}
                  </Text>
                </View>
                {rightBottomIcon && (
                  <Animated.View entering={SlideInRight} exiting={SlideOutRight}>
                    <View
                      style={[
                        AppStyles.hStack,
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 8,
                          borderRadius: 12,
                          backgroundColor: pickColorSingleShade({ name: 'bp-white' }),
                        },
                      ]}
                    >
                      <Text
                        style={{
                          textTransform: 'uppercase',
                          color: pickColorSingleShade({ name: 'bp-valid' }),
                          fontFamily: 'interstate',
                          fontWeight: '600',
                          paddingLeft: 4,
                        }}
                      >
                        {rightBottomText}
                      </Text>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FontAwesomeIcon
                          icon={rightBottomIcon}
                          size={30}
                          colors={['bp-valid', 'bp-valid']}
                          colorsLevel={['500', '500']}
                        />
                      </View>
                    </View>
                  </Animated.View>
                )}
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};
