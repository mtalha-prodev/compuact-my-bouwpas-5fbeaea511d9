import { RouteProp, useRoute } from '@react-navigation/core';
import { RoutesTypes } from 'app/Types/nav';
import { FontAwesomeIcon, HeaderNav } from 'app/components';
import { renderers } from 'app/components/html-renderer/html-render';
import { Text } from 'app/components/text/text';
import { LocalizationContext } from 'app/contexts';
import { useApiCallStatus, useIsMounted, useWorkerToolboxMeetingItem } from 'app/hooks';
import { ToolboxLanguageSelector, ToolboxMediaFile } from 'app/layouts/toolbox';
import { SignedInUser } from 'app/navigation/route-names';
import { mainColors } from 'app/theme/native-base/main-colors';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import { delay } from 'app/utils';
import dayjs from 'dayjs';
import React, { FC } from 'react';
import { ActivityIndicator, useWindowDimensions, ScrollView, View } from 'react-native';
import RenderHtml from 'react-native-render-html';

type RouteProps = RouteProp<RoutesTypes, SignedInUser.WORKER_TOOLBOX_ITEM>;

export const WorkerToolboxItem: FC = () => {
  const { t } = React.useContext(LocalizationContext);

  const isMounted = useIsMounted();

  const [showScreen, setShowScreen] = React.useState(false);
  const { width } = useWindowDimensions();
  const responsiveWidth = getResponsiveWidth();

  const route = useRoute<RouteProps>();
  const toolboxIdProp = route.params.toolboxItemId;

  // Letf find our toolbox meeting item in queryClient cached data
  const { data: toolboxItem, status: toolboxItemStatus } = useWorkerToolboxMeetingItem({
    toolboxMeetingId: toolboxIdProp,
    type: 1,
  });

  const { showData: showToolboxItem } = useApiCallStatus(toolboxItemStatus);

  const memoizeRenderers = React.useMemo(() => renderers, []);

  // The html content in the toolbox content can be big and need extra miliseconds to render
  // Show artificial little loading to avoid low FPS while navigate between screens
  React.useEffect(() => {
    // eslint-disable-next-line no-void
    void delay(200).then(() => {
      if (isMounted()) setShowScreen(true);
    });
  }, [isMounted]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: mainColors({ type: 'bg' }),
      }}
    >
      <HeaderNav
        title={toolboxItem ? toolboxItem.toolbox.name : 'Toolbox'}
        leftElement="back"
        rightElement={<ToolboxLanguageSelector />}
      />
      {!showScreen && (
        <ActivityIndicator size="large" color={pickColor({ name: 'bp-primary', shade: 500 })} />
      )}
      {showScreen && (
        <ScrollView
          style={[AppStyles.scrollView, { marginHorizontal: 0 }]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {showToolboxItem && toolboxItem && (
            <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
              <View
                style={{
                  marginTop: 10,
                  marginHorizontal: 2,
                  marginBottom: 12,
                }}
              >
                <View style={[AppStyles.box, { marginRight: 10 }]}>
                  <View
                    style={{
                      alignItems: 'center',
                      marginTop: -2,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={['fas', 'check-circle']}
                      size={80}
                      colors={['bp-correct', 'bp-correct']}
                      secondaryColors={['bp-support', 'bp-support']}
                      colorsLevel={['500', '500']}
                      secondaryColorsLevel={['500', '500']}
                    />
                  </View>

                  <View
                    style={{
                      marginBottom: 4,
                    }}
                  >
                    <Text style={{ fontFamily: 'source-sans-pro-semibold' }}>{t('project')}</Text>
                    <Text
                      style={{
                        fontSize: 25,
                        paddingTop: 10,
                      }}
                      numberOfLines={1}
                    >
                      {toolboxItem.project.shortdescription}
                    </Text>

                    <View style={AppStyles.divider} />
                    <Text style={{ fontFamily: 'source-sans-pro-semibold' }}>
                      {t('toolboxDate')}
                    </Text>
                    <Text
                      style={{
                        fontSize: 25,
                        paddingTop: 10,
                      }}
                    >
                      {dayjs(toolboxItem.date).format('DD-MM-YYYY')}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    AppStyles.headingTitle,
                    {
                      paddingLeft: 10,
                      marginTop: 10,
                      fontSize: 22,
                    },
                  ]}
                >
                  {t('content')}
                </Text>
                <View style={[AppStyles.box, { marginRight: 10 }]}>
                  {toolboxItem.toolbox.toolboxContents.map(({ content, toolboxContentId }) => {
                    if (content)
                      return (
                        <RenderHtml
                          key={toolboxContentId}
                          contentWidth={width}
                          source={{ html: content }}
                          renderers={memoizeRenderers}
                        />
                      );
                    else
                      return (
                        <FontAwesomeIcon
                          icon={['fad', 'folder-open']}
                          size={25}
                          colors={['bp-primary', 'bp-primary']}
                          colorsLevel={['500', '500']}
                        />
                      );
                  })}
                </View>

                <Text
                  style={[
                    AppStyles.headingTitle,
                    {
                      paddingLeft: 10,
                      marginTop: 10,
                      fontSize: 22,
                    },
                  ]}
                >
                  {t('attachments')}
                </Text>
                <View style={[AppStyles.box, { marginRight: 10 }]}>
                  {toolboxItem.toolbox.toolboxMedia.map((mediaItem, index) => {
                    // return <ToolboxMediaFile key={mediaItem.name} media={mediaItem} />;
                    return (
                      <React.Fragment key={index}>
                        <ToolboxMediaFile key={mediaItem.name} media={mediaItem} />
                        {index !== toolboxItem.toolbox.toolboxMedia.length - 1 && (
                          <View style={[AppStyles.divider, { marginBottom: 5, marginTop: 5 }]} />
                        )}
                      </React.Fragment>
                    );
                  })}
                  {!toolboxItem.toolbox.toolboxMedia.length && (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                      }}
                    >
                      <FontAwesomeIcon
                        icon={['fad', 'folder-open']}
                        size={25}
                        colors={['bp-primary', 'bp-primary']}
                        colorsLevel={['500', '500']}
                      />
                      <Text
                        style={{
                          marginLeft: 4,
                        }}
                      >
                        {t('missingToolboxMedia')}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};
