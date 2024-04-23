import { Text } from 'app/components/text/text';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { textContent } from 'domutils';
import React from 'react';
import { View } from 'react-native';
import { CustomBlockRenderer, Node } from 'react-native-render-html';

export const OLRenderer: CustomBlockRenderer = React.memo(function OLrender(props) {
  //@ts-ignore
  const { tnode, isOlInside } = props;
  const textColor = isOlInside ? pickColor({ name: 'bp-primary', shade: 500 }) : 'black';

  return (
    <View style={{ margin: 1 }}>
      {tnode.children.map((elem, index) => {
        const text = textContent(elem.domNode as Node);

        if (text.includes('/n')) {
          return null;
        } else {
          return (
            <View key={index} style={{ padding: 4, margin: 4 }}>
              <View style={AppStyles.hStack}>
                <Text style={{ marginRight: 8, color: textColor }}>{index + 1}.</Text>

                <Text style={{ color: textColor }}>{text}</Text>
              </View>
            </View>
          );
        }
      })}
    </View>
  );
});
