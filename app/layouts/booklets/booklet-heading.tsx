import { FontAwesomeIcon } from 'app/components';
import { Pressable } from 'app/components/pressable/pressable';
import { Text } from 'app/components/text/text';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { textContent } from 'domutils';
import React, { FC } from 'react';
import { View } from 'react-native';
import { TNode, Node } from 'react-native-render-html';

export const BookletHeading: FC<{
  headingNumber: number | string;
  tnode?: TNode;
  type: 'title' | 'subtitle';
  text?: string;
  rightElement?: boolean;
  onRightElementPress?: () => void;
  onMainPress?: () => void;
}> = React.memo(
  ({ headingNumber, tnode, type, text, rightElement, onRightElementPress, onMainPress }) => {
    const [numberOfLines, toggleNumberOfLines] = React.useState(1);
    const squareColor =
      type === 'title' ? pickColor({ name: 'bp-primary', shade: 500 }) : 'transparent';
    const squareTextColor =
      type === 'title'
        ? pickColorSingleShade({ name: 'bp-white' })
        : pickColor({ name: 'bp-primary', shade: 500 });

    const onBtnPressHandler = () => {
      if (onMainPress) return onMainPress();
      else toggleNumberOfLines(prevVal => (prevVal === 1 ? 0 : 1));
    };

    let headingText = '';

    try {
      headingText = text ? text : textContent(tnode?.domNode as Node);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // user created a header without content, so make the header empty
    }

    return (
      <Pressable onPress={onBtnPressHandler}>
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 2,
            borderColor: pickColor({ name: 'bp-primary', shade: 500 }),
            marginVertical: 8,
          }}
        >
          <View
            style={{
              backgroundColor: squareColor,
              paddingVertical: 8,
              alignItems: 'center',
              justifyContent: 'center',
              borderTopWidth: 2,
              borderLeftWidth: 2,
              borderRightWidth: 2,
              minWidth: 50,
              borderColor: pickColor({ name: 'bp-primary', shade: 500 }),
            }}
          >
            <Text
              style={{
                fontSize: type === 'title' ? 24 : 18,
                color: squareTextColor,
                fontWeight: 'bold',
                fontFamily: 'interstate',
              }}
            >
              {headingNumber}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              padding: 4,
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: type === 'title' ? 18 : 16,
                color: pickColor({ name: 'bp-primary', shade: 500 }),
                paddingLeft: 10,
                fontFamily: 'interstate',
              }}
              numberOfLines={numberOfLines}
            >
              {headingText}
            </Text>
          </View>

          {rightElement ? (
            <Pressable onPress={onRightElementPress}>
              <View
                style={{
                  backgroundColor: squareColor,
                  padding: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: pickColor({ name: 'bp-primary', shade: 500 }),
                }}
              >
                <FontAwesomeIcon
                  icon={['fas', 'chevron-down']}
                  size={20}
                  colors={['bp-white', 'bp-white']}
                  colorsLevel={['500', '500']}
                />
              </View>
            </Pressable>
          ) : null}
        </View>
      </Pressable>
    );
  },
);
