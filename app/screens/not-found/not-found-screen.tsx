import { HeaderNav } from 'app/components';
import { pickColor } from 'app/theme/native-base/pick-color';
import * as React from 'react';
import { View } from 'react-native';

export function NotFoundScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: pickColor({ name: 'bp-support', shade: 100 }) }}>
      <HeaderNav title="Not found" leftElement="back" />
    </View>
  );
}
