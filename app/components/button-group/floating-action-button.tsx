import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Pressable } from '../pressable/pressable';

interface FloatingActionButtonProps {
  onPress: () => void;
  iconName: any;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  iconName,
}) => {
  return (
    <Pressable style={styles.fabContainer} onPress={onPress}>
      <FontAwesomeIcon
        icon={['fas', iconName]}
        size={30}
        color={pickColor({ name: 'bp-primary', shade: 500 })}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: pickColor({ name: 'bp-accent', shade: 500 }),
    borderRadius: 30,
    padding: 15,
    elevation: 5,
    shadowColor: pickColorSingleShade({ name: 'bp-black' }),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default FloatingActionButton;
