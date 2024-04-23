import {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const TimingConfig = { duration: 50, easing: Easing.linear };

export const shakeAnimatedStyle = (conditional: SharedValue<boolean>) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const animatedStyle = useAnimatedStyle(() => {
    if (conditional.value) {
      return {
        transform: [
          {
            translateX: withRepeat(
              withSequence(
                withTiming(-10, TimingConfig),
                withTiming(10, TimingConfig),
                withTiming(0, TimingConfig),
              ),
              2,
              false,
            ),
          },
        ],
      };
    } else {
      return {};
    }
  });

  return animatedStyle;
};
