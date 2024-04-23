import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React, { FC } from 'react';
import { Image, Platform, Pressable, View } from 'react-native';

import { Text } from '../text/text';

interface IBookletItem {
  id?: number;
  title: string;
  subtitle?: string;
  image?: null | string;
  onPress?: () => void;
}

export const BookletItem: FC<IBookletItem> = ({ title, subtitle, image, onPress }) => {
  const blockHeight = 260;

  const responsiveWidth = getResponsiveWidth();

  return (
    <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
      <Pressable onPress={onPress}>
        <View
          style={{
            borderRadius: 12,
            marginVertical: 8,
            marginHorizontal: 8,
            ...Platform.select({
              ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
              },
              android: {
                elevation: 5,
              },
            }),
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              width: '100%',
              height: blockHeight,
              flex: 1,
              left: 0,
              top: 0,
              overflow: 'hidden',
            }}
          >
            {/* Dummy fallback to avoid weird shadow inside the main element */}
            <View
              style={{
                borderRadius: 12,
                width: '100%',
                flex: 1,
                height: '100%',
                backgroundColor: '#cddad3',
              }}
            />
            {image && (
              <Image
                source={{ uri: image }}
                resizeMode="cover"
                alt="Booklet cover image"
                style={{
                  borderRadius: 12,
                  width: '100%',
                  height: blockHeight,
                  position: 'absolute',
                  zIndex: 9999,
                  left: 0,
                  top: 0,
                }}
                onError={e => e.nativeEvent.error}
              />
            )}
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              padding: 20,
              height: blockHeight,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'interstate',
                textTransform: 'uppercase',
                color: 'white',
                fontWeight: 'bold',
              }}
              numberOfLines={2}
            >
              {title}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'bilo',
                color: 'white',
              }}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};
