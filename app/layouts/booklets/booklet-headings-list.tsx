import { useDisclose } from 'app/hooks/useDisclose/useDisclose';
import { pickColor } from 'app/theme/native-base/pick-color';
import { delay } from 'app/utils';
import React, { FC } from 'react';
import { ActivityIndicator, View, FlatList, TouchableOpacity } from 'react-native';

import { BookletHeading } from '../booklets/booklet-heading';

type THeadingElement = {
  headingNumb: string;
  headingText: string;
  headingType: number;
  yDirection: number;
  content: THeadingElement[];
};

const BookletHeadingsListItem: FC<{
  item: THeadingElement;
  scrollToY: (yDirection: number) => void;
  onModalClose: () => void;
}> = ({ item, scrollToY, onModalClose }) => {
  const { isOpen, onToggle } = useDisclose();

  const scrollToggle = (yDirection: number) => {
    return async () => {
      onToggle();
      await delay(300);
      onModalClose();
      scrollToY(yDirection);
    };
  };

  return (
    <View
      key={item.headingNumb}
      style={{
        width: '100%',
      }}
    >
      <BookletHeading
        headingNumber={item.headingNumb}
        type="title"
        text={item.headingText}
        rightElement={!!item.content.length}
        onMainPress={scrollToggle(item.yDirection)}
        onRightElementPress={onToggle}
      />

      <View>
        <TouchableOpacity onPress={onToggle} />

        {isOpen && (
          <View>
            {item.content.map(subheading => (
              <BookletHeading
                key={subheading.headingNumb}
                headingNumber={subheading.headingNumb}
                type="subtitle"
                text={subheading.headingText}
                onMainPress={scrollToggle(subheading.yDirection)}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export const BookletHeadingsList: FC<{
  modalContent: any;
  scrollToY: (yDirection: number) => void;
  onModalClose: () => void;
}> = ({ modalContent, scrollToY, onModalClose }) => {
  const [showModalContent, setShowModalContent] = React.useState(false);
  const content: THeadingElement[] = modalContent;

  const prepareModal = async () => {
    await delay(100);
    setShowModalContent(true);
  };

  React.useEffect(() => {
    prepareModal();
  }, []);

  return (
    <>
      {!showModalContent && (
        <ActivityIndicator size="large" color={pickColor({ name: 'bp-primary', shade: 500 })} />
      )}
      {showModalContent && (
        <FlatList
          style={{
            width: '100%',
          }}
          data={content}
          keyExtractor={item => item.headingNumb}
          renderItem={({ item }) => (
            <BookletHeadingsListItem
              item={item}
              scrollToY={scrollToY}
              onModalClose={onModalClose}
            />
          )}
        />
      )}
    </>
  );
};
