import { useColorScheme } from 'react-native';

const mainColors = ({ type = 'main' }: { type: 'main' | 'bg' | 'text' }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const colorScheme = useColorScheme();

  switch (type) {
    case 'main':
      return colorScheme === 'light' ? 'bp-primary.500' : 'coolGray.900';
    case 'bg':
      return colorScheme === 'light' ? 'bp-support.100' : 'coolGray.900';
    case 'text':
      return colorScheme === 'light' ? 'bp-support.500' : 'white';
    default:
      return colorScheme === 'light' ? 'bp-primary.500' : 'coolGray.900';
  }
};

export default mainColors;
