import { Pressable as RNPressable, StyleSheet } from 'react-native';

export const Pressable = ({ children, style = {}, ...restProps }) => {
  const mergedStyle = (pressed: boolean) => {
    return StyleSheet.compose({ opacity: pressed ? 0.5 : 1.0 }, style);
  };

  return (
    <RNPressable style={({ pressed }) => mergedStyle(pressed) as any} {...restProps}>
      {children}
    </RNPressable>
  );
};
