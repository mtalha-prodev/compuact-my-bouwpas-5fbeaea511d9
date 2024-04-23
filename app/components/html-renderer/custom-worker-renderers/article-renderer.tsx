import React from 'react';
import { CustomBlockRenderer } from 'react-native-render-html';

export const ArticleRenderer: CustomBlockRenderer = function ArticleRenderer({
  TDefaultRenderer,
  tnode,
  ...defaultRendererProps
}) {
  return <TDefaultRenderer tnode={tnode} {...defaultRendererProps} />;
};
