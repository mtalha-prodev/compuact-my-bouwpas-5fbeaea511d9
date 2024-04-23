import { StyleSheet } from 'react-native';

import { shadows } from '../native-base/shadows';

export const AppStyles = StyleSheet.create({
  hStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  baseStyle: {
    fontFamily: 'source-sans-pro-regular',
    color: 'black',
  },
  darkBaseStyle: {
    color: 'white',
  },
  headingTitle: {
    fontFamily: 'interstate',
    fontSize: 28,
    marginLeft: 18,
    marginRight: 4,
    marginVertical: 8,
  },
  heading: {
    fontFamily: 'interstate',
    fontSize: 28,
    marginVertical: 8,
  },
  marginLeft2: {
    marginLeft: 12,
  },
  marginTop2: {
    marginTop: 12,
  },
  fontSizeSm: {
    fontSize: 12,
    fontFamily: 'source-sans-pro-regular',
  },
  fontSizeMd: {
    fontSize: 16,
    fontFamily: 'source-sans-pro-regular',
  },
  fontSizeLg: {
    fontSize: 24,
    fontFamily: 'source-sans-pro-regular',
  },
  scrollView: {
    paddingBottom: 12,
  },
  divider: {
    borderBottomColor: '#cddad3',
    borderBottomWidth: 1,
    marginVertical: 16,
  },
  dividerNoMargin: {
    borderBottomColor: '#cddad3',
    borderBottomWidth: 1,
  },
  responsiveWidthBox: {
    marginHorizontal: 'auto',
    alignSelf: 'center',
  },
  invisibleBox: {
    /* merely used to maintain safe spaces from the horizontal sides */
    borderRadius: 12,
    marginHorizontal: 12,
  },
  box: {
    /* decoration for a box with background and shadow */
    /* to be used directly under a responsiveWidth View */
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 16,
    marginHorizontal: 12,
    padding: 20,
    ...shadows[2],
  },
  button: {
    backgroundColor: '#3E3E3C',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    padding: 20,
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 18,
    fontFamily: 'interstate',
  },
});
