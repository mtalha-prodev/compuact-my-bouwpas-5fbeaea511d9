import React from 'react';
import { CustomBlockRenderer } from 'react-native-render-html';

export const PInfoRenderer: CustomBlockRenderer = function PRenderer({
  TDefaultRenderer,
  tnode,
  ...defaultRendererProps
}) {
  return <TDefaultRenderer tnode={tnode} {...defaultRendererProps} />;
};
