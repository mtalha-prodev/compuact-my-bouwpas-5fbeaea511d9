import React, { FC } from 'react';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

import {
  H1Renderer,
  H2Render,
  PRenderer,
  ImgRenderer,
  BlockquoteRenderer,
  UlRenderer,
  OLRenderer,
} from './custom-renderers';

export const renderers = {
  h1: H1Renderer,
  h2: H2Render,
  p: PRenderer,
  img: ImgRenderer,
  blockquote: BlockquoteRenderer,
  ul: UlRenderer,
  ol: OLRenderer,
};

export const HtmlRender: FC<{
  html: string;
  layoutCoordinatesRef: React.MutableRefObject<any[]>;
}> = React.memo(({ html, layoutCoordinatesRef }) => {
  const { width } = useWindowDimensions();
  const memoizeRenderers = React.useMemo(() => renderers, []);

  return (
    <RenderHtml
      contentWidth={width}
      source={{
        html: `${html}`,
      }}
      renderers={memoizeRenderers}
      renderersProps={{
        h1: {
          layoutCoordinatesRef,
        },
        h2: {
          layoutCoordinatesRef,
        },
      }}
    />
  );
});
