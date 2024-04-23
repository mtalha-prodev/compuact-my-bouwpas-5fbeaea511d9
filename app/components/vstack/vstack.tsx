import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface VStackProps {
  children: ReactNode;
  space?: number;
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | number;
  bg?: string;
  py?: number | string;
  px?: number | string;
  style?: ViewStyle;
}

const VStack: React.FC<VStackProps> = ({
  children,
  space,
  alignItems,
  justifyContent,
  rounded,
  bg,
  py,
  px,
  style,
}) => {
  const getBorderRadius = () => {
    if (rounded === 'sm' || rounded === 'md' || rounded === 'lg' || rounded === 'xl') {
      return styles[rounded as 'sm' | 'md' | 'lg' | 'xl'];
    } else {
      return { borderRadius: rounded };
    }
  };

  return (
    <View
      style={[
        styles.vStack,
        { marginVertical: space },
        {
          alignItems,
          justifyContent,
          backgroundColor: bg,
          paddingVertical: py,
          paddingHorizontal: px,
        },
        getBorderRadius(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  vStack: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  sm: {
    borderRadius: 4,
  },
  md: {
    borderRadius: 8,
  },
  lg: {
    borderRadius: 12,
  },
  xl: {
    borderRadius: 16,
  },
});

export default VStack;
