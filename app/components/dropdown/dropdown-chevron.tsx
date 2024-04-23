import { pickColor } from 'app/theme/native-base/pick-color';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { mix, mixColor } from 'react-native-redash';

import { IDropdownChevronProps } from './dropdown.types';
import { FontAwesomeIcon } from '../font-awesome-icon';

const size = 30;
const styles = StyleSheet.create({
  container: {
    height: size,
    width: size,
    borderRadius: size / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#525251',
  },
});

export const DropdownChevron: FC<IDropdownChevronProps> = React.memo(({ progress, isSelected }) => {
  const colorPick1 = pickColor({ name: 'bp-primary', shade: 500 });
  const colorPick2 = pickColor({ name: 'bp-accent', shade: 500 });

  const style = useAnimatedStyle(() => ({
    backgroundColor: mixColor(progress.value, colorPick1, colorPick2),
    transform: [{ rotateZ: `${mix(progress.value, 0, Math.PI)}rad` }],
  }));

  const iconColors = !isSelected ? ['bp-white', 'bp-white'] : ['bp-support', 'bp-support'];

  return (
    <Animated.View style={[styles.container, style]}>
      <FontAwesomeIcon
        icon={['fas', 'chevron-down']}
        size={15}
        //@ts-ignore
        colors={iconColors}
        colorsLevel={['500', '500']}
      />
    </Animated.View>
  );
});

/* export default function Icon({isFocused}) {

} */
