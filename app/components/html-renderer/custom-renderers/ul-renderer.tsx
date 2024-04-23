import { Text } from 'app/components/text/text';
import { pickColor } from 'app/theme/native-base/pick-color';
import { textContent } from 'domutils';
import React from 'react';
import { View } from 'react-native';
import { CustomBlockRenderer, Node } from 'react-native-render-html';

export const UlRenderer: CustomBlockRenderer = React.memo(function Ulrender(props) {
  //@ts-ignore
  const { tnode, isUlInside } = props;

  return (
    <View style={{ marginVertical: 8 }}>
      {tnode.children.map((elem, index) => {
        const text = textContent(elem.domNode as Node);

        if (text.includes('/n')) {
          return null;
        } else {
          return (
            <View key={index} style={{ padding: 4, margin: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    height: 12,
                    width: 12,
                    marginRight: 8,
                    backgroundColor: isUlInside
                      ? 'white'
                      : pickColor({ name: 'bp-primary', shade: 500 }),
                    alignSelf: 'center',
                  }}
                />

                <Text
                  style={{
                    flex: 1,
                    color: isUlInside ? 'white' : 'black',
                  }}
                >
                  {text}
                </Text>
              </View>
            </View>
          );
        }
      })}
    </View>
  );
});
