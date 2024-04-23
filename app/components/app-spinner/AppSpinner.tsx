import React from 'react';
import { ActivityIndicator, View } from 'react-native';

interface CustomSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

const CustomSpinner: React.FC<CustomSpinnerProps> = ({ size = 'large', color = 'blue' }) => {
  return (
    <View>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default CustomSpinner;
