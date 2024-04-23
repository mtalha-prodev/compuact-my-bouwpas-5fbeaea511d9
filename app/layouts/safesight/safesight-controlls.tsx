import { TLiteProject } from 'app/Types/liteprojects.types';
import { TProject } from 'app/Types/projects.types';
import { FontAwesomeIcon, InfoBlock } from 'app/components';
import Box from 'app/components/app-box/app-box';
import CustomModal from 'app/components/app-modal/app-modal';
import { Text } from 'app/components/text/text';
import VStack from 'app/components/vstack/vstack';
import { LocalizationContext } from 'app/contexts';
import { TSafesightUrlConfig, useSafesight } from 'app/hooks';
import { useDisclose } from 'app/hooks/useDisclose/useDisclose';
import { pickColorSingleShade } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import React, { FC } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';

interface ISafesightControllsProps {
  projectItem: TLiteProject | TProject;
  projectType: 'project' | 'liteProject';
  projectId: number;
  contractorId: number;
}

export const SafesightControlls: FC<ISafesightControllsProps> = ({
  projectItem,
  projectType,
  projectId,
  contractorId,
}) => {
  const { t } = React.useContext(LocalizationContext);

  const { isOpen, onToggle } = useDisclose();

  const {
    status: { state, error },
    openSafesight,
    showSafesightButtons,
  } = useSafesight();

  // This is called by buttons below to redirect to safesight app
  const safesightRedirect = (
    projectType: TSafesightUrlConfig['projectType'],
    type: TSafesightUrlConfig['type'],
  ) => {
    // Check whether this lite project has been converted to a regular Bouwpas project
    if (projectItem['@type'] === 'LiteProject' && projectItem.projectId) {
      // Yes, so this means we will override some params that we send to Safesight, because the ones that were given
      // are determined by the location of the user in the app (either normal project list or lite project list)
      projectType = 'project';
      projectId = projectItem.projectId;
    }

    return () => {
      openSafesight({
        projectType,
        type,
        id: projectId,
      });
    };
  };

  return (
    <>
      {state === 'error' && error && (
        <InfoBlock
          title={t('noWorkersInToolboxMeeting')}
          type="error"
          icon={['fad', 'exclamation-square']}
          apiError={error}
        />
      )}

      {projectType === 'liteProject' || showSafesightButtons(contractorId) ? (
        <VStack style={{ marginVertical: 16 }}>
          {/* Maak een MOS-melding */}
          <TouchableOpacity
            disabled={state === 'loading'}
            onPress={safesightRedirect(projectType, 'logId')}
            style={AppStyles.button}
          >
            <>
              {state === 'loading' ? (
                <ActivityIndicator
                  size="small"
                  color={pickColorSingleShade({ name: 'bp-white' })}
                />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={['fas', 'plus']}
                    size={25}
                    colors={['bp-white', 'bp-white']}
                    colorsLevel={['500', '500']}
                  />
                  <Text style={AppStyles.buttonText}>{t('projectTaskCreateBtn')}</Text>
                </>
              )}
            </>
          </TouchableOpacity>

          {/* Mijn Acties */}
          <TouchableOpacity
            disabled={state === 'loading'}
            onPress={safesightRedirect(projectType, 'taskId')}
            style={[AppStyles.button]}
          >
            <>
              {state === 'loading' ? (
                <ActivityIndicator
                  size="small"
                  color={pickColorSingleShade({ name: 'bp-white' })}
                />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={['fas', 'tachometer-fast']}
                    size={25}
                    colors={['bp-white', 'bp-white']}
                    colorsLevel={['500', '500']}
                  />
                  <Text style={AppStyles.buttonText}>{t('projectTaskListBtn')}</Text>
                </>
              )}
            </>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={state === 'loading'}
            onPress={onToggle}
            style={[AppStyles.button]}
          >
            <>
              {state === 'loading' ? (
                <ActivityIndicator
                  size="small"
                  color={pickColorSingleShade({ name: 'bp-white' })}
                />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={['fas', 'chevron-circle-down']}
                    size={25}
                    colors={['bp-white', 'bp-white']}
                    colorsLevel={['500', '500']}
                  />
                  <Text style={AppStyles.buttonText}>{t('moreSafesight')}</Text>
                </>
              )}
            </>
          </TouchableOpacity>

          <CustomModal
            isOpen={isOpen}
            onClose={onToggle}
            modalContent={
              <ScrollView style={{ width: '100%' }}>
                <Box width="auto" mx="auto">
                  <VStack
                    style={{
                      marginVertical: 6,
                      width: '100%',
                    }}
                  >
                    <Text style={[AppStyles.headingTitle, AppStyles.marginLeft2]}>
                      {t('moreSafesight')}
                    </Text>

                    {/* Toolbox */}
                    <TouchableOpacity
                      disabled={state === 'loading'}
                      onPress={safesightRedirect(projectType, 'toolbox')}
                      style={[AppStyles.button]}
                    >
                      <>
                        {state === 'loading' ? (
                          <ActivityIndicator
                            size="small"
                            color={pickColorSingleShade({ name: 'bp-white' })}
                          />
                        ) : (
                          <>
                            <FontAwesomeIcon
                              icon={['fas', 'toolbox']}
                              size={25}
                              colors={['bp-white', 'bp-white']}
                              colorsLevel={['500', '500']}
                            />
                            <Text style={AppStyles.buttonText}>{t('projectsPageTabNav3')}</Text>
                          </>
                        )}
                      </>
                    </TouchableOpacity>

                    {/* Inspecties */}
                    <TouchableOpacity
                      disabled={state === 'loading'}
                      onPress={safesightRedirect(projectType, 'forms')}
                      style={AppStyles.button}
                    >
                      <>
                        {state === 'loading' ? (
                          <ActivityIndicator
                            size="small"
                            color={pickColorSingleShade({ name: 'bp-white' })}
                          />
                        ) : (
                          <>
                            <FontAwesomeIcon
                              icon={['fas', 'clipboard-list-check']}
                              size={25}
                              colors={['bp-white', 'bp-white']}
                              colorsLevel={['500', '500']}
                            />
                            <Text style={AppStyles.buttonText}>{t('safesightInspecties')}</Text>
                          </>
                        )}
                      </>
                    </TouchableOpacity>

                    {/* Alle MOS-meldingen */}
                    <TouchableOpacity
                      disabled={state === 'loading'}
                      onPress={safesightRedirect(projectType, 'allLogs')}
                      style={AppStyles.button}
                    >
                      <>
                        {state === 'loading' ? (
                          <ActivityIndicator
                            size="small"
                            color={pickColorSingleShade({ name: 'bp-white' })}
                          />
                        ) : (
                          <>
                            <FontAwesomeIcon
                              icon={['fas', 'list']}
                              size={25}
                              colors={['bp-white', 'bp-white']}
                              colorsLevel={['500', '500']}
                            />
                            <Text style={AppStyles.buttonText}>{t('allProjectTasks')}</Text>
                          </>
                        )}
                      </>
                    </TouchableOpacity>
                  </VStack>
                </Box>
              </ScrollView>
            }
          />
        </VStack>
      ) : null}
    </>
  );
};
