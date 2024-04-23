import React from 'react';
import { CustomBlockRenderer } from 'react-native-render-html';

export const DivRenderer: CustomBlockRenderer = function DivRenderer({
  TDefaultRenderer,
  tnode,
  ...defaultRendererProps
}) {
  return <TDefaultRenderer tnode={tnode} {...defaultRendererProps} />;
};
