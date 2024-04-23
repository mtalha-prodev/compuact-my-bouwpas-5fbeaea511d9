import { AppStyles } from 'app/theme/style/AppStyles';
import { Text as RNText, StyleSheet } from 'react-native';

export const Text = ({ children, style = {}, ...restProps }) => {
  const mergedStyle = StyleSheet.compose(AppStyles.fontSizeMd, style);

  return (
    <RNText style={mergedStyle} {...restProps}>
      {children}
    </RNText>
  );
};
