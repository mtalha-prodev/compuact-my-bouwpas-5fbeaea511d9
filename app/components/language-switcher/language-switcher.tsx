import { useStore } from 'app/store/main-store/main-store';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import React from 'react';
import { View } from 'react-native';

import { ButtonGroup } from '../button-group/button-group';

export const LanguageSwitcher: React.FC = () => {
  const [btnGroupIndex, setBtnGroupIndex] = React.useState(0);
  const language = useStore.useLanguage();

  const bgSelected = pickColor({ name: 'bp-correct', shade: 500 });
  const textSelected = pickColorSingleShade({ name: 'bp-black' });

  const onValueChange = (value: number) => {
    setBtnGroupIndex(value);
    if (value === 0) useStore.setState({ language: 'nl' });
    if (value === 1) useStore.setState({ language: 'en' });
  };

  React.useEffect(() => {
    if (language === 'nl') setBtnGroupIndex(0);
    if (language === 'en') setBtnGroupIndex(1);
  }, []);

  return (
    <View style={{ marginVertical: 16 }}>
      <ButtonGroup
        selectedIndex={btnGroupIndex}
        buttons={['NL', 'EN']}
        selectedBgColor={bgSelected}
        selectedTextColor={textSelected}
        onValueChange={onValueChange}
      />
    </View>
  );
};
