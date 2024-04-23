import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface SkeletonProps {
  duration?: number;
  height?: number;
  style?: any;
  customKey?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ duration = 1000, height = 52, style, customKey }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateSkeleton = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 3,
            duration: duration / 2,
            useNativeDriver: false,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: duration / 2,
            useNativeDriver: false,
          }),
        ]),
        { iterations: -1 },
      ).start();
    };

    animateSkeleton();
  }, [animation, duration]);

  const interpolateColor = animation.interpolate({
    inputRange: [0, 3],
    outputRange: ['#EEEEEE', '#DDDDDD'], // Change these colors as needed
  });

  const animatedStyle = {
    backgroundColor: interpolateColor,
  };

  return (
    <Animated.View
      style={[
        {
          height,
        },
        animatedStyle,
        style,
      ]}
      key={customKey ?? Math.random().toString()}
    />
  );
};

export default Skeleton;
