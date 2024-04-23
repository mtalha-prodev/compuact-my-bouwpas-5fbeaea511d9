import { FontAwesomeIcon } from 'app/components/font-awesome-icon';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CustomBlockRenderer, TChildrenRenderer } from 'react-native-render-html';

export const SectionRenderer: CustomBlockRenderer = function SectionRenderer({
  TDefaultRenderer,
  tnode,
  ...defaultRendererProps
}) {
  const [extraContentModal, setExtraContentModal] = React.useState(false);

  const onExtraContentModal = () => {
    setExtraContentModal(!extraContentModal);
  };

  const children = tnode.children;

  const extraContent = children.filter(
    c => c.attributes.class?.split(' ').includes('extraContent'),
  );

  const hasExtraContent = extraContent.length > 0;

  return (
    <View>
      <TDefaultRenderer tnode={tnode} {...defaultRendererProps}>
        <View style={{ marginLeft: 8, marginTop: 8 }}>
          <TChildrenRenderer
            tchildren={children.filter(
              c => !c.attributes.class?.split(' ').includes('extraContent'),
            )}
          />
        </View>
      </TDefaultRenderer>
      {extraContentModal ? (
        <TDefaultRenderer tnode={tnode} {...defaultRendererProps}>
          <View>
            <TChildrenRenderer tchildren={extraContent} />
          </View>
        </TDefaultRenderer>
      ) : null}

      {hasExtraContent ? (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={onExtraContentModal}
            style={{
              width: '100%',
              alignItems: 'center',
              paddingVertical: 10,
            }}
          >
            <FontAwesomeIcon
              size={25}
              icon={
                 extraContentModal ? ['fad', 'chevron-circle-up'] : ['fad', 'chevron-circle-down']
              }
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};
