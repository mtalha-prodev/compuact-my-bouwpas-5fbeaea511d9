import { FontAwesomeIcon } from 'app/components';
import { LocalizationContext } from 'app/contexts';
import { TxKeyPath } from 'app/i18n';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import React from 'react';
import { Text } from 'react-native';

import { Pressable } from '../pressable/pressable';

interface ModalOptionProps {
  isSelected: boolean;
  onModeSelect: () => void;
  buttonText: TxKeyPath;
}

export const ModalOption: React.FC<ModalOptionProps> = ({
  isSelected,
  onModeSelect,
  buttonText,
}) => {
  const { t } = React.useContext(LocalizationContext);
  return (
    <Pressable
      onPress={onModeSelect}
      style={[
        AppStyles.button,
        {
          backgroundColor: isSelected
            ? pickColor({ name: 'bp-correct', shade: 800 })
            : pickColor({ name: 'bp-support', shade: 500 }),
        },
      ]}
    >
      <>
        <FontAwesomeIcon
          icon={[isSelected ? 'fas' : 'fad', 'users-viewfinder']}
          size={25}
          colors={['bp-white', 'bp-white']}
          colorsLevel={['500', '500']}
        />
        <Text style={AppStyles.buttonText}>{t(buttonText)}</Text>
      </>
    </Pressable>
  );
};
