import { Tag } from 'app/components';
import { extractText } from 'app/components/html-renderer/helpers/extract-node-text';
import { LocalizationContext } from 'app/contexts';
import React from 'react';
import { CustomTextualRenderer } from 'react-native-render-html';

export const KeesingStatusRenderer: CustomTextualRenderer = React.memo(function KeesingRenderer({
  tnode,
}) {
  const { t } = React.useContext(LocalizationContext);
  const text = extractText(tnode);
  return (
    <Tag
      status={text === 'OK' ? 'valid' : 'unknown'}
      label={`${t('keesingStatusLabel')}:`}
      description={text && text}
    />
  );
});
