import React, { FC } from 'react';
import { IQuota } from './quota.types';
import { Text, View } from 'react-native';
import { quotaColors } from 'app/theme/native-base/quota-colors';


export const Quota: FC<IQuota> = props => {
  const { percentage = 0, backgroundColorData = '0' } = props;

  const colorPick = quotaColors['bp-quota'][backgroundColorData];
  return (
    <View
      style={{
        width: 65,
        padding: 9,
        backgroundColor: colorPick,
        borderRadius: 10,
        height: 40,
      }}
    >
      <Text
        style={{
          textAlign: 'center',
          color: '#000000',
          fontSize: 16,
          fontFamily: 'interstate',
        }}
      >
        {percentage}%
      </Text>
    </View>
  );
};
