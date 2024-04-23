import React from 'react';
import { Modal, View, StyleSheet, Platform } from 'react-native';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalContent: any;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, modalContent }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      if (isOpen) {
        const timeout = setTimeout(() => {
          setIsVisible(true);
        }, 750);

        return () => clearTimeout(timeout);
      }
      if (!isOpen) {
        setIsVisible(false);
      }
    } else {
      setIsVisible(true);
    }
  }, [isOpen]);
  return (
    <View>
      {isVisible && (
        <Modal
          animationType="slide"
          presentationStyle="pageSheet"
          visible={isOpen}
          onRequestClose={onClose}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>{modalContent}</View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'none',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default CustomModal;
