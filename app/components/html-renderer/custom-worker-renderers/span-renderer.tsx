import React from 'react';
import { CustomBlockRenderer } from 'react-native-render-html';

export const SpanInfoRenderer: CustomBlockRenderer = function SpanInforender({
  TDefaultRenderer,
  tnode,
  ...defaultRendererProps
}) {
  return <TDefaultRenderer tnode={tnode} {...defaultRendererProps} />;
};
