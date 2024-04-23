import { pickColor } from 'app/theme/native-base/pick-color';
import { FC } from 'react';
import { View } from 'react-native';

import { TagTypes, TTagColors } from './tag.types';
import Box from '../app-box/app-box';
import { FontAwesomeIcon } from '../font-awesome-icon';
import { Text } from '../text/text';

export const Tag: FC<TagTypes> = ({ label, description, status }) => {
  function tagData(): TTagColors {
    switch (status) {
      case 'valid':
        return {
          primaryColor: pickColor({ name: 'bp-correct', shade: 900 }),
          bgColor: pickColor({ name: 'bp-correct', shade: 500 }),
          borderColor: pickColor({ name: 'bp-correct', shade: 500 }),
          iconName: ['fas', 'check'],
          txtColor: 'black',
        };
      case 'about-to-expire':
        return {
          primaryColor: pickColor({ name: 'bp-temp', shade: 500 }),
          bgColor: pickColor({ name: 'bp-warning', shade: 500 }),
          borderColor: pickColor({ name: 'bp-warning', shade: 500 }),
          iconName: ['fas', 'bell'],
          txtColor: 'black',
        };
      case 'expired':
        return {
          primaryColor: pickColor({ name: 'bp-red-card', shade: 500 }),
          bgColor: pickColor({ name: 'bp-red-card', shade: 500 }),
          borderColor: pickColor({ name: 'bp-red-card', shade: 500 }),
          iconName: ['fas', 'exclamation'],
          txtColor: 'white',
        };
      case 'unknown':
      default:
        return {
          primaryColor: pickColor({ name: 'bp-support', shade: 300 }),
          bgColor: pickColor({ name: 'bp-support', shade: 300 }),
          borderColor: pickColor({ name: 'bp-support', shade: 300 }),
          iconName: ['fas', 'circle'],
          txtColor: 'black',
        };
    }
  }

  return (
    <Box width="auto" my="2">
      <View
        style={{
          borderRadius: 50,
          borderWidth: 2,
          borderColor: 'white',
          position: 'absolute',
          left: 2,
          top: '25%',
          zIndex: 30,
          padding: 2,
          backgroundColor: tagData().primaryColor,
        }}
      >
        <FontAwesomeIcon
          icon={tagData().iconName}
          size={25}
          colors={['bp-white', 'bp-white']}
          colorsLevel={['500', '500']}
        />
      </View>

      <View
        style={{
          paddingLeft: 55,
          paddingVertical: 1,
          backgroundColor: tagData().bgColor,
          borderWidth: 2,
          borderColor: tagData().borderColor,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Text
          style={{
            fontFamily: 'interstate',
            fontSize: 24,
            color: tagData().txtColor,
          }}
        >
          {label}
        </Text>
      </View>
      <View
        style={{
          paddingLeft: 55,
          paddingVertical: 1,
          borderWidth: 2,
          borderColor: tagData().borderColor,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <Text
          style={{
            fontFamily: 'interstate',
            fontSize: 22,
          }}
        >
          {description}
        </Text>
      </View>
    </Box>
  );
};
