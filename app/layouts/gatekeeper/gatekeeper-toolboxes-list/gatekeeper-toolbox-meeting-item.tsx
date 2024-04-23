import { RouteProp, useRoute } from '@react-navigation/core';
import { RoutesTypes } from 'app/Types/nav';
import { ButtonGroup, FontAwesomeIcon, HeaderNav } from 'app/components';
import Box from 'app/components/app-box/app-box';
import { renderers } from 'app/components/html-renderer/html-render';
import { Text } from 'app/components/text/text';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import { useApiCallStatus, useWorkerToolboxMeetingItem } from 'app/hooks';
import { ToolboxLanguageSelector, ToolboxMediaFile } from 'app/layouts/toolbox';
import { ToolboxAttendersList } from 'app/layouts/toolbox/toolbox-attenders-list';
import {
  TMeetingItem,
  TToolboxMeetingsList,
} from 'app/layouts/worker/worker-toolboxes-list/worker-toolboxes.types';
import { SignedInUser } from 'app/navigation/route-names';
import { useStore } from 'app/store/main-store/main-store';
import { mainColors } from 'app/theme/native-base/main-colors';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React, { FC } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import QRCode from 'react-native-qrcode-svg';
import RenderHTML from 'react-native-render-html';
import { useQueryClient } from 'react-query';

import { FindWorkerByName } from './find-worker-by-name';
import { FindWorkerByQrUuid } from './find-worker-by-qr-uuid';

type RouteProps = RouteProp<RoutesTypes, SignedInUser.GATEKEEPER_TOOLBOX_MEETING_ITEM>;

export const GatekeeperToolboxMeetingItem: FC = () => {
  const { t } = React.useContext(LocalizationContext);
  const responsiveWidth = getResponsiveWidth();

  const route = useRoute<RouteProps>();
  const toolboxIdProp = route.params.toolboxItemId;

  const cache = useQueryClient();
  const toolboxItem = cache
    .getQueryData<TToolboxMeetingsList>([env.MY_TOOLBOX_MEETINGS, 2])
    ?.find(d => d.id === toolboxIdProp);

  const [btnGroupIndex, setBtnGroupIndex] = React.useState(0);
  const { width } = useWindowDimensions();

  const bgSelected = pickColor({ name: 'bp-primary', shade: 500 });
  const textSelected = pickColorSingleShade({ name: 'bp-white' });

  // determine if the meeting is today. if it is, show the qr code
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const currentDate = `${yyyy}-${mm}-${dd}`;
  const meetingDate = String(toolboxItem?.date).substr(0, 10);

  const qrLogo = require('app/assets/images/bp/qr_corner.png');

  const onViewModeChange = (index: number) => {
    setBtnGroupIndex(index);
  };

  const { height } = useWindowDimensions();

  const memoizeRenderers = React.useMemo(() => renderers, []);

  const currentTooloboxLang = useStore.useCurrentTooloboxLang();
  const [toolboxData, setToolboxData] = React.useState<TMeetingItem | undefined>();
  React.useEffect(() => {
    if (toolboxItem) {
      const contentsLang = toolboxItem.toolbox.toolboxContents.filter(
        toolbox => toolbox.language.locale.toUpperCase() === currentTooloboxLang,
      );
      const mediaLang = toolboxItem.toolbox.toolboxMedia.filter(
        toolbox => toolbox.language.locale.toUpperCase() === currentTooloboxLang,
      );
      const newdata: TMeetingItem = {
        ...toolboxItem,
        toolbox: {
          ...toolboxItem.toolbox,
          toolboxContents: contentsLang,
          toolboxMedia: mediaLang,
        },
      };
      setToolboxData(newdata);
    }
  }, []);

  return (
    <Box flex={1} bg={mainColors({ type: 'bg' })} width="auto">
      <HeaderNav
        title={toolboxData ? toolboxData.toolbox.name.toString() : 'Toolbox'}
        leftElement="back"
        rightElement={<ToolboxLanguageSelector />}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ height }}
        extraHeight={100}
      >
        {toolboxData && (
          <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth, marginTop: 16 }]}>
            <View style={AppStyles.invisibleBox}>
              <ButtonGroup
                selectedIndex={btnGroupIndex}
                buttons={[t('toolboxHost_Attendance'), t('toolboxHost_Presentation')]}
                selectedBgColor={bgSelected}
                selectedTextColor={textSelected}
                onValueChange={onViewModeChange}
              />
            </View>

            {btnGroupIndex === 0 && (
              <Box width="auto" mx="auto" mt="2">
                {meetingDate === currentDate && (
                  <View
                    style={[
                      AppStyles.box,
                      {
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <QRCode
                      value={JSON.stringify({
                        name: toolboxData.toolbox.name,
                        id: toolboxData.id,
                        date: toolboxData.date,
                      })}
                      size={200}
                      logo={qrLogo}
                      logoSize={40}
                      logoBackgroundColor={pickColorSingleShade({ name: 'bp-white' })}
                      logoMargin={0}
                      logoBorderRadius={5}
                      color={pickColorSingleShade({ name: 'bp-black' })}
                      backgroundColor={pickColorSingleShade({ name: 'bp-white' })}
                    />
                    <Text style={{ marginTop: 8 }}>{t('toolboxAttendeeQR')}</Text>
                    <Text style={{ marginTop: 8 }}>{t('toolboxAttendeeQRLine2')}</Text>

                    <FindWorkerByQrUuid
                      meetingId={toolboxData.id}
                      projectId={toolboxData.project.projectId}
                    />

                    <FindWorkerByName
                      meetingId={toolboxData.id}
                      projectId={toolboxData.project.projectId}
                    />
                  </View>
                )}
                <ToolboxAttendersList
                  meetingId={toolboxData.id}
                  hideRefreshBtn={meetingDate === currentDate}
                />
              </Box>
            )}

            {btnGroupIndex === 1 && (
              <Box width="auto" mt="2">
                <View style={AppStyles.invisibleBox}>
                  <Text style={AppStyles.headingTitle}>{t('content')}</Text>
                </View>
                <View style={AppStyles.box}>
                  {toolboxData.toolbox.toolboxContents.map(({ content, toolboxContentId }) => {
                    if (content)
                      return (
                        <RenderHTML
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

                <View style={AppStyles.invisibleBox}>
                  <Text style={[AppStyles.headingTitle]}>{t('attachments')}</Text>
                </View>
                <View style={AppStyles.box}>
                  {toolboxData.toolbox.toolboxMedia.map((mediaItem, index) => {
                    return (
                      <React.Fragment key={index}>
                        <ToolboxMediaFile key={mediaItem.name} media={mediaItem} />
                        {index !== toolboxData.toolbox.toolboxMedia.length - 1 && (
                          <View style={[AppStyles.divider]} />
                        )}
                      </React.Fragment>
                    );
                  })}
                  {!toolboxData.toolbox.toolboxMedia.length && (
                    <FontAwesomeIcon
                      icon={['fad', 'folder-open']}
                      size={25}
                      colors={['bp-primary', 'bp-primary']}
                      colorsLevel={['500', '500']}
                    />
                  )}
                </View>
              </Box>
            )}
          </View>
        )}
      </KeyboardAwareScrollView>
    </Box>
  );
};
