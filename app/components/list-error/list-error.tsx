import { TApiError } from 'app/lib/api';
import React, { FC } from 'react';
import { Dimensions, View } from 'react-native';
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated';

import { FontAwesomeIcon } from '../font-awesome-icon';
import { Text } from '../text/text';

interface IListErrorProps {
  error: TApiError;
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const ListError: FC<IListErrorProps> = ({ error }) => {
  return (
    <Animated.View entering={SlideInLeft.duration(200)} exiting={SlideOutRight.duration(200)}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          marginHorizontal: 2,
          paddingVertical: 16,
          paddingHorizontal: 8,
          marginTop: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.5,
          height: windowHeight / 4,
          width: windowWidth - 15,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FontAwesomeIcon
          icon={['fas', 'exclamation-square']}
          size={50}
          colors={['bp-cancel', 'bp-cancel']}
          colorsLevel={['500', '500']}
        />
        <Text style={{ marginVertical: 8, fontSize: 18 }}>
          {error.errorStatus} : {error.errorUrl}
        </Text>
      </View>
    </Animated.View>
  );
};
