import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastText, setToastText] = useState('');

  const showToast = (message, duration = 3000) => {
    setToastText(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, duration);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toastVisible && <View style={styles.toastContainer}>{toastText}</View>}
    </ToastContext.Provider>
  );
};

export const useCustomToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useCustomToast must be used within a ToastProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: '4%',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 8,
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
  },
  dismissButton: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
  },
});
