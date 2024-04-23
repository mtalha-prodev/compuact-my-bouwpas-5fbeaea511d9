import React from 'react';
import { View, Text } from 'react-native';
import { Node, CustomTextualRenderer } from 'react-native-render-html';
import { textContent } from 'domutils';
import { FontAwesomeIcon } from 'app/components/font-awesome-icon';
import { colors as themeColors } from 'app/theme/native-base/colors';

export const H3InfoRenderer: CustomTextualRenderer = React.memo(function H3Inforender({ tnode }) {
  let headingText = '';
  let classNames = [];
  classNames = (tnode.attributes.class ?? '').split(' ');
  let icon: any = undefined;
  let colors: any = undefined;
  let colorLevel: any = undefined;
  const bgColor = themeColors['bp-support'][200];
  try {
    headingText = textContent(tnode?.domNode as Node);
    if (classNames.includes('valid')) {
      icon = ['fas', 'check-circle'];
      colors = ['bp-valid', 'bp-valid'];
      colorLevel = ['500', '500'];
    } else if (classNames.includes('invalid')) {
      icon = ['fas', 'times-circle'];
      colors = ['bp-cancel', 'bp-cancel'];
      colorLevel = ['500', '500'];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // user created a header without content, so make the header empty
  }
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 8,
      }}
      key={Math.random()}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        key={Math.random()}
      >
        <Text style={{ flex: 9, fontSize: 15, fontFamily: 'interstate', marginRight: 4 }}>
          {headingText}
        </Text>
        {icon && colors && (
          <View style={{ flex: 1 }}>
            <FontAwesomeIcon
              icon={icon}
              size={20}
              colors={colors}
              secondaryColors={['bp-support', 'bp-support']}
              colorsLevel={colorLevel}
              secondaryColorsLevel={['500', '500']}
            />
          </View>
        )}
      </View>

      <View
        style={{
          marginTop: 8,
          height: 1,
          width: '97%',
          backgroundColor: bgColor,
          alignSelf: 'flex-start',
        }}
      ></View>
    </View>
  );
});
