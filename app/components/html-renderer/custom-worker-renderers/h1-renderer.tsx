import { GenericAlert } from 'app/components/alert';
import { FontAwesomeIcon } from 'app/components/font-awesome-icon';
import { Text } from 'app/components/text/text';
import { LocalizationContext } from 'app/contexts';
import { textContent } from 'domutils';
import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Node, CustomTextualRenderer } from 'react-native-render-html';

export const H1InfoRenderer: CustomTextualRenderer = React.memo(function H1Inforender({ tnode }) {
  const { t } = React.useContext(LocalizationContext);

  // Add an index to avoid warnings.
  let headingText = '';
  let classNames = [];
  classNames = (tnode.attributes.class ?? '').split(' ');

  const onGeneralStatusIcon = () => {
    GenericAlert({
      title: t('generalStatusIconTitle'),
      message: t('generalStatusIconMessage'),
    });
  };

  let icon: any = undefined;
  let colors: any = undefined;
  let secondaryColors: any = undefined;
  let colorLevel: any = undefined;
  let secondaryColorLevel: any = undefined;

  try {
    headingText = textContent(tnode?.domNode as Node);
    if (classNames.includes('valid')) {
      icon = ['fad', 'check-circle'];
      colors = ['bp-correct', 'bp-correct'];
      secondaryColors = ['bp-valid', 'bp-valid'];
      colorLevel = ['300', '300'];
      secondaryColorLevel = ['500', '500'];
    } else if (classNames.includes('invalid')) {
      icon = ['fad', 'exclamation-circle'];
      colors = ['bp-white', 'bp-white'];
      secondaryColors = ['bp-cancel', 'bp-cancel'];
      colorLevel = ['500', '500'];
      secondaryColorLevel = ['500', '500'];
    } else if (classNames.includes('noStatus')) {
      icon = ['fad', 'info-circle'];
      colors = ['bp-support', 'bp-support'];
      secondaryColors = ['bp-support', 'bp-support'];
      colorLevel = ['900', '200'];
      secondaryColorLevel = ['300', '300'];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // user created a header without content, so make the header empty
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 12,
        marginTop: 9,
        marginRight: 8,
      }}
      key={Math.random()}
    >
      <Text style={{ fontSize: 24, fontFamily: 'interstate' }}>{headingText}</Text>
      {icon && colors && (
        <TouchableOpacity onPress={onGeneralStatusIcon}>
          <FontAwesomeIcon
            icon={icon}
            size={36}
            colors={colors}
            secondaryColors={secondaryColors}
            colorsLevel={colorLevel}
            secondaryColorsLevel={secondaryColorLevel}
            secondaryOpacity={1}
          />
        </TouchableOpacity>
      )}
    </View>
  );
});
