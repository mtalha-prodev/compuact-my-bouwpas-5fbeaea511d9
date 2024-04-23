import { MixedStyleRecord } from 'react-native-render-html';
export const tagsStyles: MixedStyleRecord = {
  article: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 12,
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  p: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    fontFamily: 'source-sans-pro-semibold',
    fontSize: 16,
  },
  span: {
    fontFamily: 'source-sans-pro-semibold',
    fontSize: 15,
  },

  h1: {
    marginVertical: 6,
    marginHorizontal: 10,
    paddingTop: 4,
    paddingHorizontal: 10,
  },
  section: {
    flexDirection: 'column',
  },
};
