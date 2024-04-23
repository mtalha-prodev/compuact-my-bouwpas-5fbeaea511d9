import { pickColor } from 'app/theme/native-base/pick-color';

/** Use of colormodeValue has been replaced with always getting the light mode one.
 *  When implementing dark mode this will be refactored.
 */
const mainColors = ({ type = 'main' }: { type: 'main' | 'bg' | 'text' }) => {
  switch (type) {
    case 'main':
      return pickColor({ name: 'bp-primary', shade: 500 });
    case 'bg':
      return pickColor({ name: 'bp-support', shade: 100 });
    case 'text':
      return pickColor({ name: 'bp-support', shade: 500 });

    default:
      return pickColor({ name: 'bp-primary', shade: 500 });
  }
};

export { mainColors };
