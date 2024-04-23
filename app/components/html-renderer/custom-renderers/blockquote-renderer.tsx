import Box from 'app/components/app-box/app-box';
import { FontAwesomeIcon } from 'app/components/font-awesome-icon';
import HStack from 'app/components/hstack/hstack';
import { Text } from 'app/components/text/text';
import { LocalizationContext } from 'app/contexts';
import { pickColor } from 'app/theme/native-base/pick-color';
import { textContent } from 'domutils';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Alert, Linking, Platform, TouchableOpacity, View } from 'react-native';
import { CustomTextualRenderer, Node } from 'react-native-render-html';

import { OLRenderer } from './ol-renderer';
import { UlRenderer } from './ul-renderer';

export const BlockquoteRenderer: CustomTextualRenderer = React.memo(
  function Blockquoterender(props) {
    const { tnode } = props;

    const { t } = React.useContext(LocalizationContext);

    const isBlockLink = tnode.attributes.class === 'block_link';

    const onBlockLinkPress = async () => {
      if (tnode.attributes.url) {
        // if it's a phone number or email, open like this
        if (
          tnode.attributes.url.substring(0, 4) === 'tel:' ||
          tnode.attributes.url.substring(0, 7) === 'mailto:'
        ) {
          try {
            Linking.openURL(tnode.attributes.url);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            Alert.alert(t('unexpectedLinkType'));
          } finally {
            return;
          }
        }

        // next, we check if it's an http(s) link, try to open that
        // in a browser
        if (
          tnode.attributes.url.substring(0, 5) === 'http:' ||
          tnode.attributes.url.substring(0, 6) === 'https:'
        ) {
          try {
            if (Platform.OS === 'ios') {
              WebBrowser.dismissBrowser();
            }
            await WebBrowser.openBrowserAsync(tnode.attributes.url);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            Alert.alert(t('unexpectedLinkType'));
          } finally {
            return;
          }
        }

        // we don't understand the protocol of this link and error out.
        Alert.alert(t('unexpectedLinkType'));
      }
    };

    const children = tnode.children.map(elem => elem.tagName);
    const isUlInside = children.includes('ul');

    if (isBlockLink) {
      return (
        <TouchableOpacity
          style={{
            borderWidth: 2,
            borderColor: pickColor({ name: 'bp-primary', shade: 500 }),
            padding: 3,
            marginBottom: 3,
          }}
          onPress={onBlockLinkPress}
        >
          <HStack>
            <Text
              style={{
                flex: 1,
                lineHeight: 26,
                color: pickColor({ name: 'bp-primary', shade: 500 }),
              }}
            >
              {textContent(tnode.domNode as Node)}
            </Text>
            <FontAwesomeIcon
              icon={['fas', 'chevron-right']}
              size={30}
              colors={['bp-primary', 'bp-primary']}
              colorsLevel={['500', '500']}
            />
          </HStack>
        </TouchableOpacity>
      );
    } else {
      return (
        <View
          style={{
            marginVertical: 4, // Equivalent to my={4}
            backgroundColor: isUlInside
              ? pickColor({ name: 'bp-primary', shade: 500 })
              : 'transparent', // Replace 'your-primary-color' with the desired color
          }}
        >
          {tnode.children.map((elem, index) => {
            if (elem.tagName === 'p') {
              //@ts-ignore
              return (
                <Box
                  width="auto"
                  bg={pickColor({ name: 'bp-primary', shade: 500 })}
                  my="2"
                  key={index}
                >
                  <Text style={{ color: 'white' }}>{textContent(elem.domNode as Node)}</Text>
                </Box>
              );
            } else if (elem.tagName === 'ul') {
              return (
                <Box width="auto" mx="2" key={index}>
                  {/*//@ts-ignore */}
                  <UlRenderer tnode={elem} isUlInside />
                </Box>
              );
            } else if (elem.tagName === 'ol') {
              return (
                <Box width="auto" mx="2" key={index}>
                  {/*//@ts-ignore */}
                  <OLRenderer tnode={elem} isOlInside />
                </Box>
              );
            }
          })}
        </View>
      );
    }
  },
);
