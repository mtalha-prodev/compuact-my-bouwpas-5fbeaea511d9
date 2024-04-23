import { useNavigation } from '@react-navigation/core';
import { HeaderNav } from 'app/components';
import { Text } from 'app/components/text/text';
import { env } from 'app/config/env';
import { LocalizationContext } from 'app/contexts';
import {
  useApiCallStatus,
  useApiMutation,
  useGatekeeperProjectsList,
  useGatekeeperToolboxesList,
  useIsMounted,
} from 'app/hooks';
import { SignedInUser } from 'app/navigation/route-names';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import { delay } from 'app/utils';
import React, { FC } from 'react';
import { ActivityIndicator, useWindowDimensions, View, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { TMeetingItem } from '../worker/worker-toolboxes-list/worker-toolboxes.types';

const listItemContainerStyle = {
  backgroundColor: pickColorSingleShade({ name: 'bp-white' }),
  height: 64,
};
const listItemLabelStyle = {
  fontFamily: 'source-sans-pro-regular',
  lineHeight: 64,
};
const dropDownStyle = {
  backgroundColor: pickColor({ name: 'bp-support-gray', shade: 500 }),
  borderWidth: 2,
  borderColor: pickColor({ name: 'bp-support-gray', shade: 500 }),
};
const dropDownTextStyle = {
  fontFamily: 'source-sans-pro-regular',
  fontSize: 18,
};
const modalContentContainerStyle = {
  backgroundColor: pickColor({ name: 'bp-support-gray', shade: 500 }),
};
const searchTextInputStyle = {
  backgroundColor: pickColorSingleShade({ name: 'bp-white' }),
};

export const ToolboxMeetingHost: FC = () => {
  const { t } = React.useContext(LocalizationContext);

  const [showScreen, setShowScreen] = React.useState(false);

  const responsiveWidth = getResponsiveWidth();
  const { height } = useWindowDimensions();

  const navigation = useNavigation();

  const isMounted = useIsMounted();

  // use state for if a dropdown is open (state is required by the package)
  const [isToolboxPickerOpen, setIsToolboxPickerOpen] = React.useState<boolean>(false);
  const [isProjectPickerOpen, setIsProjectPickerOpen] = React.useState<boolean>(false);

  // use state for selected dropdown values (state is required by the package)
  const [selectedToolbox, setSelectedToolbox] = React.useState<number | null>(null);
  const [selectedProject, setSelectedProject] = React.useState<number | null>(null);

  const { data: projects, status: projectsStatus } = useGatekeeperProjectsList();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { showData: showProjects, showLoading: showProjectsLoading } =
    useApiCallStatus(projectsStatus);

  const { data: toolboxes, status: toolboxesStatus } = useGatekeeperToolboxesList();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { showData: showToolboxes, showLoading: showToolboxesLoading } =
    useApiCallStatus(toolboxesStatus);

  const { mutateAsync: postMeeting, isLoading: isMutationLoading } = useApiMutation();

  // create a new meeting in api and continue to new screen
  const postNewMeeting = async () => {
    const meetingData = {
      toolbox: `/v2/toolboxes/${selectedToolbox}`,
      project: `/v2/projects/${selectedProject}`,
    };
    await postMeeting(
      {
        key: env.MY_TOOLBOX_MEETINGS,
        method: 'post',
        apiData: meetingData,
        // Type of uniqueDecriber needs to be 2 here because it's unique key of toolbox meetings (gatekeeper)
        uniqueDecriber: 2,
      },
      {
        onSuccess: data => {
          const newMeeting = data as unknown as TMeetingItem;
          navigation.navigate(SignedInUser.GATEKEEPER_TOOLBOX_MEETING_ITEM, {
            toolboxItemId: newMeeting.id,
          });
        },
      },
    );
  };

  // this var defines if every component is done loading, used to enable the submit button
  const createButtonConditional = isMutationLoading || !selectedProject || !selectedToolbox;

  // default value
  const placeholderData = [{ label: t('dropdownPlaceholder'), value: 0 }];

  // set default values for dropdowns
  const [toolboxItems, setToolboxItems] = React.useState<any>(placeholderData);
  const [projectItems, setProjectItems] = React.useState<any>(placeholderData);

  // fill toolbox list in variable
  React.useEffect(() => {
    setToolboxItems(
      !toolboxes
        ? placeholderData
        : toolboxes.map(toolbox => ({
            label: toolbox.name,
            value: toolbox.toolboxId,
          })),
    );
  }, [toolboxes, selectedToolbox]);

  // fill projects list variable
  React.useEffect(() => {
    setProjectItems(
      !projects
        ? placeholderData
        : projects.map(project => ({
            label: project.shortdescription,
            value: project.projectId,
          })),
    );
  }, [projects, selectedProject]);

  React.useEffect(() => {
    // eslint-disable-next-line no-void
    void delay(100).then(() => {
      if (isMounted()) setShowScreen(true);
    });
  }, [isMounted]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: pickColor({ name: 'bp-support', shade: 100 }),
      }}
    >
      <HeaderNav title={t('createToolboxHeader')} leftElement="back" />

      {!showScreen && (
        <View style={AppStyles.box}>
          <ActivityIndicator size="large" color={pickColor({ name: 'bp-primary', shade: 500 })} />
        </View>
      )}

      {showScreen && (
        <View style={[AppStyles.responsiveWidthBox, { width: responsiveWidth }]}>
          <View style={{ minHeight: height }}>
            <View style={[AppStyles.box, { marginRight: 10 }]}>
              <View style={{ marginVertical: 2 }}>
                <Text style={{ fontFamily: 'interstate', fontSize: 22 }}>
                  {t('projectsPageTabNav3')}
                </Text>
                <Text style={{ marginVertical: 4 }}>{t('hostMeetingToolboxTitle')}</Text>
              </View>
              <DropDownPicker
                open={isToolboxPickerOpen}
                setOpen={setIsToolboxPickerOpen}
                value={selectedToolbox}
                setValue={setSelectedToolbox}
                items={toolboxItems}
                setItems={setToolboxItems}
                showArrowIcon
                itemSeparator
                closeOnBackPressed
                placeholder={t('dropdownPlaceholder')}
                loading={showToolboxesLoading}
                listMode="MODAL"
                modalProps={{
                  animationType: 'slide',
                }}
                modalContentContainerStyle={modalContentContainerStyle}
                labelProps={{
                  numberOfLines: 1,
                }}
                searchable
                searchPlaceholder={t('search') + '...'}
                searchTextInputStyle={searchTextInputStyle}
                translation={{
                  NOTHING_TO_SHOW: t('noSearchResults'),
                }}
                zIndex={3000}
                zIndexInverse={1000}
                style={dropDownStyle}
                textStyle={dropDownTextStyle}
                listItemContainerStyle={listItemContainerStyle}
                listItemLabelStyle={listItemLabelStyle}
              />
              <View style={{ marginVertical: 2, marginTop: 25 }}>
                <Text style={{ fontFamily: 'interstate', fontSize: 22 }}>{t('project')}</Text>
                <Text style={{ marginVertical: 4 }}>{t('hostMeetingToolboxProjectTitle')}</Text>
              </View>
              <DropDownPicker
                open={isProjectPickerOpen}
                setOpen={setIsProjectPickerOpen}
                value={selectedProject}
                setValue={setSelectedProject}
                items={projectItems}
                setItems={setProjectItems}
                showArrowIcon
                itemSeparator
                closeOnBackPressed
                placeholder={t('dropdownPlaceholder')}
                loading={showProjectsLoading}
                labelProps={{
                  numberOfLines: 1,
                }}
                listMode="MODAL"
                modalProps={{
                  animationType: 'slide',
                }}
                modalContentContainerStyle={modalContentContainerStyle}
                searchable
                searchPlaceholder={t('search') + '...'}
                searchTextInputStyle={searchTextInputStyle}
                translation={{
                  NOTHING_TO_SHOW: t('noSearchResults'),
                }}
                zIndex={1000}
                zIndexInverse={3000}
                style={dropDownStyle}
                textStyle={dropDownTextStyle}
                listItemContainerStyle={listItemContainerStyle}
                listItemLabelStyle={listItemLabelStyle}
              />
              <View style={{ marginVertical: 2, marginTop: 20 }}>
                <Text>{t('hostMeetingToolboxBottomText')}</Text>
              </View>
              <TouchableOpacity
                onPress={postNewMeeting}
                disabled={createButtonConditional}
                style={[
                  AppStyles.button,
                  { justifyContent: 'center' },
                  {
                    backgroundColor: !createButtonConditional
                      ? pickColor({ name: 'bp-support', shade: 500 })
                      : '#C4C4C4',
                  },
                ]}
              >
                <Text
                  style={[
                    AppStyles.buttonText,
                    {
                      color: !createButtonConditional
                        ? pickColorSingleShade({ name: 'bp-white' })
                        : pickColor({ name: 'bp-support', shade: 500 }),
                    },
                  ]}
                >
                  {t('toolboxCreateMeeting')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
