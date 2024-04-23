import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface HStackProps {
  children: ReactNode;
  rounded?: number;
  borderWidth?: number;
  borderColor?: string;
  style?: ViewStyle;
}

const HStack: React.FC<HStackProps> = ({ children, rounded, borderWidth, borderColor, style }) => {
  return (
    <View style={[styles.hStack, { borderRadius: rounded, borderWidth, borderColor }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  hStack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default HStack;
