import React from 'react';
import { Dimensions, Image } from 'react-native';
import { CustomBlockRenderer } from 'react-native-render-html';

const windowWidth = Dimensions.get('window').width;

export const ImgRenderer: CustomBlockRenderer = React.memo(function Imgrender({ tnode }) {
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(300);
  Image.getSize(tnode.attributes.src, (w, h) => {
    setWidth(w);
    setHeight(h);
  });

  let imageHeight = 200;
  if (height && width) {
    imageHeight = height / (width / windowWidth);
  }

  return (
    <Image
      style={{
        width: '100%',
        height: imageHeight,
        marginVertical: 4,
      }}
      source={{ uri: tnode.attributes.src }}
    />
  );
});
