import { mainColors } from 'app/theme/native-base/main-colors';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

export const WorkerNotesContent: FC = () => {
  const responsiveWidth = getResponsiveWidth();

  React.useEffect(() => {}, []);
  return (
    <View
      style={[
        AppStyles.responsiveWidthBox,
        { width: responsiveWidth, flex: 1, backgroundColor: mainColors({ type: 'bg' }) },
      ]}
    >
      <Text>Hi!</Text>
      {/* <PRenderer tnode={noteContent} /> */}
    </View>
  );
};
