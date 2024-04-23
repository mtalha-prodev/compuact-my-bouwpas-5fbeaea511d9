import { RouteProp, useRoute } from '@react-navigation/native';
import { RoutesTypes } from 'app/Types/nav';
import { FontAwesomeIcon, InfoBlock, HeaderNav } from 'app/components';
import CustomModal from 'app/components/app-modal/app-modal';
import { HtmlRender } from 'app/components/html-renderer/html-render';
import { Pressable } from 'app/components/pressable/pressable';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import { queryClient, useApiCall, useApiCallStatus } from 'app/hooks';
import { useDisclose } from 'app/hooks/useDisclose/useDisclose';
import { GlobalRoutes } from 'app/navigation/route-names';
import { storage_keys } from 'app/services';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import { delay, loadAsyncParsed, saveAsyncStringify } from 'app/utils';
import React, { FC, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, View } from 'react-native';
import * as Sentry from 'sentry-expo';

import { BookletHeadingsList } from './booklet-headings-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type THeadingElement = {
  headingNumb: string;
  headingText: string;
  headingType: number;
  yDirection: number;
  content: THeadingElement[];
};

type TLayoutsRef = THeadingElement[];

type TBooklet = {
  id: number;
  title: string;
  author: string;
  image: string | null;
  crc: number;
  html: string;
  data: any;
};

type TBookletsList = TBooklet[];

type RouteProps = RouteProp<RoutesTypes, GlobalRoutes.BOOKLET_ITEM>;

export const BookletItem: FC = React.memo(() => {
  const { t } = React.useContext(LocalizationContext);
  const route = useRoute<RouteProps>();
  const selectedBookletId = route.params.bookletId;
  const selectedBookletCrc = route.params.bookletCrc;
  const bookletTitle = route.params.bookletTitle;

  const [loading, setLoading] = React.useState(true);
  const [shouldFetchBooklet, setShouldFetchBooklet] = React.useState(false);
  const [modalDataLoading, setModalDataLoading] = React.useState(true);
  const [bookletLoadError, setBookletLoadError] = React.useState(false);

  const { isOpen, onOpen, onClose } = useDisclose();

  const layoutCoordinatesRef = React.useRef<TLayoutsRef>([]);

  const modalContent = React.useRef<any>([]);

  const {
    data: bookletData,
    status,
    isRefetching,
  } = useApiCall<TBooklet>({
    link: `${env.BOOKLETS_URL}${selectedBookletId}`,
    queryParams: {
      enabled: shouldFetchBooklet,
      onSuccess: async booklet => {
        // Filter book object to drop data field
        // sence we need only html field
        const bookletArr = Object.entries(booklet);
        const filteredArr = bookletArr.filter(([key]) => key !== 'data');
        //@ts-ignore
        const newBooklet = Object.fromEntries(filteredArr);

        const booklets = (await loadAsyncParsed(
          storage_keys.stored_booklets,
        )) as TBookletsList | null;

        if (booklets) {
          const newBooklets = [...booklets, newBooklet];
          saveAsyncStringify(storage_keys.stored_booklets, newBooklets);
        } else {
          saveAsyncStringify(storage_keys.stored_booklets, [newBooklet]);
        }

        await delay(200);
        setLoading(false);
      },
      onError: err => {
        setBookletLoadError(true);
        Sentry.Native.captureException(err);
      },
    },
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScrollUp = () => {
    const newScrollPosition = scrollPosition - 1000;
    setScrollPosition(newScrollPosition);
    scrollViewRef.current?.scrollTo({ y: newScrollPosition, animated: true });
  };

  const handleScrollDown = () => {
    const newScrollPosition = scrollPosition + 1000;
    setScrollPosition(newScrollPosition);
    scrollViewRef.current?.scrollTo({ y: newScrollPosition, animated: true });
  };

  const { showData, showLoading } = useApiCallStatus(status, isRefetching);

  const bootstrapBooklet = async () => {
    const booklets = (await loadAsyncParsed(storage_keys.stored_booklets)) as TBookletsList;

    if (booklets) {
      const foundedBooklet = booklets.find(booklet => booklet.id === selectedBookletId);

      //If booklet wasn't founded in storage -> fetch it
      if (!foundedBooklet) {
        setShouldFetchBooklet(true);
      }
      //Fetch to update booklet if crc was changed
      if (foundedBooklet && foundedBooklet.crc !== selectedBookletCrc) {
        setShouldFetchBooklet(true);
      }

      if (foundedBooklet) {
        queryClient.setQueriesData(`${env.BOOKLETS_URL}${selectedBookletId}`, foundedBooklet);

        await delay(200);
        setLoading(false);
      }
    } else {
      setShouldFetchBooklet(true);
    }
  };

  const scrollToY = React.useCallback((yDirection: number) => {
    scrollViewRef.current?.scrollTo({
      y: yDirection,
      animated: false,
    });
  }, []);

  const returnFiltered = React.useCallback(async () => {
    setModalDataLoading(true);
    await delay(1000);
    const newData: any = [];
    const data = layoutCoordinatesRef.current;

    const headings = data.filter(el => el.headingType === 1);
    const subHeadings = data.filter(el => el.headingType === 2);

    subHeadings.sort((a: any, b: any) => a.headingNumb.split('.')[1] - b.headingNumb.split('.')[1]);

    headings.forEach(heading => {
      const content = subHeadings.filter(
        subheading => subheading.headingNumb.split('.')[0] === heading.headingNumb,
      );
      const newElement = { ...heading, content };
      newData.push(newElement);
    });

    const sortedNewData =
      newData.length > 0 &&
      newData.sort((a: any, b: any) => Number(a.headingNumb) - Number(b.headingNumb));

    modalContent.current = sortedNewData;
    setModalDataLoading(false);
  }, []);

  const showBookletContent = !loading && !showLoading && showData && bookletData;

  const rightTopNav =
    showBookletContent && !modalDataLoading && layoutCoordinatesRef.current.length > 0 ? (
      <Pressable onPress={onOpen}>
        <FontAwesomeIcon
          icon={['fas', 'list']}
          size={25}
          colors={['bp-white', 'bp-white']}
          colorsLevel={['500', '500']}
        />
      </Pressable>
    ) : null;

  React.useEffect(() => {
    bootstrapBooklet();
  }, []);

  React.useEffect(() => {
    if (showBookletContent) {
      returnFiltered();
    }
  }, [showBookletContent]);

  const insets = useSafeAreaInsets();
  const responsiveWidth = getResponsiveWidth();

  return (
    <>
      <View
        style={{
          backgroundColor: pickColor({ name: 'bp-support', shade: 100 }),
          flex: 1,
        }}
      >
        <HeaderNav title={bookletTitle} leftElement="back" rightElement={rightTopNav} />

        {!showBookletContent && bookletLoadError && (
          <View
            style={{
              backgroundColor: pickColorSingleShade({ name: 'bp-white' }),
              borderRadius: 16,
              shadowColor: pickColorSingleShade({ name: 'bp-black' }),
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 5,
              paddingVertical: 20,
              marginTop: 16,
              marginHorizontal: 8,
            }}
          >
            <InfoBlock
              title={t('errorBookletLoad')}
              icon={['fad', 'exclamation-square']}
              type="error"
            />
          </View>
        )}

        {!showBookletContent && !bookletLoadError && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator size="large" color={pickColor({ name: 'bp-primary', shade: 500 })} />
          </View>
        )}

        <ScrollView
          ref={scrollViewRef}
          style={[AppStyles.scrollView, { marginRight: 15, marginHorizontal: 0 }]}
          scrollEventThrottle={500}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          overScrollMode="never"
          onScroll={event => setScrollPosition(event.nativeEvent.contentOffset.y)}
        >
          <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
            <View
              style={{
                marginHorizontal: 20,
              }}
            >
              {showBookletContent && (
                <HtmlRender html={bookletData.html} layoutCoordinatesRef={layoutCoordinatesRef} />
              )}
            </View>
          </View>
        </ScrollView>

        {showBookletContent && (
          <View
            style={{
              backgroundColor: pickColor({ name: 'bp-primary', shade: 500 }),
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingBottom: insets.bottom,
            }}
          >
            <View
              style={{
                marginHorizontal: 8,
                padding: 8,
              }}
            >
              <Pressable onPress={handleScrollUp}>
                <FontAwesomeIcon
                  icon={['fas', 'square-chevron-up']}
                  colors={['bp-support', 'bp-support']}
                  colorsLevel={['100', '100']}
                  size={30}
                />
              </Pressable>
            </View>
            <View
              style={{
                marginHorizontal: 2,
                padding: 8,
              }}
            >
              <Pressable onPress={handleScrollDown}>
                <FontAwesomeIcon
                  icon={['fas', 'square-chevron-down']}
                  colors={['bp-support', 'bp-support']}
                  colorsLevel={['100', '100']}
                  size={30}
                />
              </Pressable>
            </View>
          </View>
        )}
      </View>

      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        modalContent={
          <BookletHeadingsList
            modalContent={modalContent.current}
            scrollToY={scrollToY}
            onModalClose={onClose}
          />
        }
      />
    </>
  );
});
