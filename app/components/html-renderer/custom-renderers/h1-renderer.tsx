import { BookletHeading } from 'app/layouts/booklets/booklet-heading';
import React from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { CustomTextualRenderer, useRendererProps } from 'react-native-render-html';

export const H1Renderer: CustomTextualRenderer = React.memo(function H1render({ tnode }) {
  const headingNumber = tnode.attributes.heading_numb;
  const rendererProps = useRendererProps('h1');

  const onLayout = React.useCallback(async (event: LayoutChangeEvent) => {
    const { layout } = event.nativeEvent;
    const yCoordinate = layout.y;
    const object = {
      yDirection: yCoordinate,
      headingText: tnode.attributes?.heading_text,
      headingNumb: tnode.attributes?.heading_numb,
      headingType: Number(tnode.attributes?.heading_type),
    };
    if (rendererProps?.layoutCoordinatesRef) {
      if (rendererProps.layoutCoordinatesRef.current.length > 0) {
        let hasElement = false;
        rendererProps.layoutCoordinatesRef.current.forEach((element: any) => {
          if (element.headingNumb === object.headingNumb) {
            hasElement = true;
          }
        });
        if (hasElement === false) {
          rendererProps.layoutCoordinatesRef.current.push(object);
        }
      } else {
        rendererProps.layoutCoordinatesRef.current.push(object);
      }
    }
  }, []);

  return (
    <View onLayout={onLayout} key={headingNumber}>
      <BookletHeading headingNumber={headingNumber} type="title" tnode={tnode} />
    </View>
  );
});
