import React, { FC } from 'react';
import { useWindowDimensions } from 'react-native';
import { RenderHTML } from 'react-native-render-html';

import { ArticleRenderer } from './custom-worker-renderers/article-renderer';
import { DivRenderer } from './custom-worker-renderers/div-renderer';
import { H1InfoRenderer } from './custom-worker-renderers/h1-renderer';
import { H2InfoRenderer } from './custom-worker-renderers/h2-renderer';
import { H3InfoRenderer } from './custom-worker-renderers/h3-renderer';
import { PInfoRenderer } from './custom-worker-renderers/p-renderer';
import { SectionRenderer } from './custom-worker-renderers/section-renderer';
import { SpanInfoRenderer } from './custom-worker-renderers/span-renderer';
import { tagsStyles } from './tag-styles/worker-tag-styles';

export const renderers = {
  h1: H1InfoRenderer,
  h2: H2InfoRenderer, 
  p: PInfoRenderer,
  span: SpanInfoRenderer,
  div: DivRenderer,
  article: ArticleRenderer,
  section: SectionRenderer,
  h3: H3InfoRenderer,
};

export const WorkerHtmlRender: FC<{
  html: string;
}> = React.memo(({ html }) => {
  const { width } = useWindowDimensions();
  const memoizeRenderers = React.useMemo(() => renderers, []);

  return (
    <RenderHTML
      contentWidth={width}
      source={{
        html: `${html}`,
      }}
      renderers={memoizeRenderers}
      tagsStyles={tagsStyles}
    />
  );
});
