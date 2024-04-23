import { TNode } from 'react-native-render-html';

export function extractText(tnode: TNode) {
  let text = '';

  if (tnode.type === 'text') {
    return tnode.data;
  }
  for (const tchild of tnode.children) {
    text += extractText(tchild);
  }
  return text;
}
