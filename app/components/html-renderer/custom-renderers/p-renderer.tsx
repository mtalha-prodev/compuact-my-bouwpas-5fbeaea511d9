import { Text } from 'app/components/text/text';
import { textContent } from 'domutils';
import React from 'react';
import { View } from 'react-native';
import { CustomTextualRenderer, Node } from 'react-native-render-html';

import { ImgRenderer } from './img-renderer';

export const PRenderer: CustomTextualRenderer = React.memo(function Prender(props) {
  const { tnode, propsFromParent } = props;
  //@ts-ignore
  const { isUlInside } = propsFromParent;

  return (
    <View style={{ marginVertical: 8 }}>
      <Text style={{ lineHeight: 26, color: isUlInside ? 'bp-primary.500' : 'black' }}>
        {textContent(tnode.domNode as Node)}
      </Text>

      {tnode.children.map(elem => {
        if (elem.tagName === 'img') {
          //@ts-ignore
          return <ImgRenderer tnode={elem} key={Math.random()} />;
        }
      })}
    </View>
  );
});
