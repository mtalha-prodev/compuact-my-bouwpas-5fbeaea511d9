import { useNavigation } from '@react-navigation/core';
import { ListRenderItem, FlashList } from '@shopify/flash-list';
import { TProjectsList, isTProject } from 'app/Types/projects.types';
import { BigInfoBlock, FontAwesomeIcon, InfoBlock } from 'app/components';
import { Pressable } from 'app/components/pressable/pressable';
import { SearchBar } from 'app/components/searchbar/searchbar';
import { Text } from 'app/components/text/text';
import { LocalizationContext } from 'app/contexts';
import { useWorkerLastAttendance, useWorkerProjectsList } from 'app/hooks';
import { SignedInUser } from 'app/navigation/route-names';
import { getFavoritesFromLocalStorage } from 'app/services/favorite-projects';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React, { createRef, FC, useContext, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Sentry from 'sentry-expo';

import { WorkerProjectListHeader } from './worker-projects-list-header';
import { WorkerProjectListItem } from './worker-projects-list-item';

interface WorkerProjectsListBodyProps {
  showOtherProjects?: boolean;
}

export const WorkerProjectsListBody: FC<WorkerProjectsListBodyProps> = ({
  showOtherProjects = false,
}) => {
  const { t } = useContext(LocalizationContext);
  const navigation = useNavigation();
  const responsiveWidth = getResponsiveWidth();
  const itemHeight = 120 + 30;
  const [refreshing, setRefreshing] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedId, setSelectedId] = useState(0);
  const inputRef = createRef();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    loadFavorites();

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    searchFilter.trim().length > 2 ? setSearchActive(true) : setSearchActive(false);
  }, [searchFilter]);

  // get the regular projects list
  const {
    data: projectsList,
    error: projectsListError,
    refetch: refetchProjectsList,
  } = useWorkerProjectsList(showOtherProjects);

  const [onlyShowFavorites, setOnlyShowFavorites] = React.useState<boolean>(false);

  // get the projects that the user has marked as favorite
  const [favoriteProjects, setFavoriteProjects] = React.useState<number[]>([]);

  async function loadFavorites() {
    await getFavoritesFromLocalStorage('favoriteProjects').then(setFavoriteProjects);
  }

  const toggleOnlyShowFavorites = (toggle: boolean) => {
    setOnlyShowFavorites(toggle);
  };

  const { data: lastAttendance, refetch: refetchLastAttendance } = useWorkerLastAttendance();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchProjectsList();
      await refetchLastAttendance();
      await loadFavorites();
    } catch (error) {
      Sentry.Native.captureException(error);
    }
    setRefreshing(false);
  };

  const openLiteProjects = () => {
    navigation.navigate(SignedInUser.WORKER_LITE_PROJECTS);
  };

  let filteredProjectsList: TProjectsList = [];
  if (projectsList) {
    // first, we apply the favorites filter if it's enabled
    if (onlyShowFavorites) {
      filteredProjectsList = projectsList.filter(project => {
        return favoriteProjects.includes(project.projectId);
      });
    } else {
      filteredProjectsList = projectsList;
    }

    // then we apply the search filter if the user is searching
    if (searchActive) {
      const trimmedSearchFilter = searchFilter.trim();
      filteredProjectsList = filteredProjectsList.filter(project => {
        let matchOnContractor = false;

        project.contractors?.forEach(item => {
          if (
            item.contractorname &&
            item.contractorname.toLowerCase().includes(trimmedSearchFilter.toLowerCase())
          ) {
            matchOnContractor = true;
          }
        });
        return (
          project.visitingcity.toLowerCase().includes(trimmedSearchFilter.toLowerCase()) ||
          project.shortdescription.toLowerCase().includes(trimmedSearchFilter.toLowerCase()) ||
          project.projectnumber.toLowerCase().includes(trimmedSearchFilter.toLowerCase()) ||
          matchOnContractor
        );
      });
    }
  }

  const renderItem: ListRenderItem<number> = ({ item, index }) => {
    let project;
    if (!filteredProjectsList?.[item]) {
      return null;
    }
    // eslint-disable-next-line prefer-const
    project = filteredProjectsList[item];

    if (project === isTProject(project)) {
      return (
        <WorkerProjectListItem
          otherProject={showOtherProjects}
          project={project}
          subtitle={
            showOtherProjects
              ? project.projectnumber + ' - ' + project.contractors[0].contractorname
              : undefined
          }
          onPress={() => setSelectedId(index)}
          index={index}
          isSuccess={
            lastAttendance?.[0] &&
            project.projectId === lastAttendance[0].projectId &&
            lastAttendance[0].logtypeId === 2
          }
          successRightBottomIcon={['fad', 'user-helmet-safety']}
          successRightBottomText={t('qrAttendanceSignedIn')}
        />
      );
    }
  };

  const keyExtractor = (item: number, index: number) => String(index);

  // footer for a project list (the 'more projects' button)
  function footer() {
    return (
      <>
        {!showOtherProjects && (
          <View
            style={[
              AppStyles.responsiveWidthBox,
              {
                width: responsiveWidth,
              },
            ]}
          >
            <TouchableOpacity
              onPress={openLiteProjects}
              style={[
                AppStyles.button,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginHorizontal: 10,
                },
              ]}
            >
              <FontAwesomeIcon
                icon={['fas', 'list']}
                size={25}
                colors={['bp-white', 'bp-white']}
                colorsLevel={['500', '500']}
              />
              <Text style={AppStyles.buttonText}>{t('liteProjectsLabel')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  }

  // reusable const which contains the header part
  const header = (
    <View
      style={{
        height: showOtherProjects === false ? 142 : 50,
      }}
    >
      {showOtherProjects === false ? <WorkerProjectListHeader /> : null}

      <View
        style={[
          AppStyles.responsiveWidthBox,
          {
            width: responsiveWidth,
            flexDirection: 'row',
            justifyContent: 'center',
            paddingHorizontal: 1,
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
            marginBottom: 5,
            justifyContent: 'center',
          }}
        >
          <SearchBar inputRef={inputRef} searchFilter={searchFilter} onChange={setSearchFilter} />
        </View>
        <View
          style={{
            width: 50,
            marginHorizontal: 0,
            marginRight: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              toggleOnlyShowFavorites(!onlyShowFavorites);
            }}
          >
            <View
              style={{
                backgroundColor: onlyShowFavorites
                  ? pickColor({ name: 'bp-primary', shade: 500 })
                  : pickColor({ name: 'bp-support-gray', shade: 500 }),
                borderRadius: 12,
                borderColor: pickColor({ name: 'bp-primary', shade: 500 }),
                borderWidth: 2,
                padding: 12,
              }}
            >
              <FontAwesomeIcon
                icon={onlyShowFavorites ? ['fas', 'star'] : ['fal', 'star']}
                size={25}
                colors={
                  onlyShowFavorites ? ['bp-accent', 'bp-accent'] : ['bp-primary', 'bp-primary']
                }
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // return an info block informing the user that there has been an error
  if (projectsListError) {
    return (
      <>
        {header}
        {projectsListError ? (
          <Pressable onPress={onRefresh}>
            <View
              style={{
                marginHorizontal: 10,
                marginVertical: 2,
                padding: 2,
                height: 150,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: 12,
              }}
            >
              <InfoBlock
                title={t('errorWorkerProjectsList')}
                icon={['fad', 'exclamation-square']}
                type="error"
                apiError={null}
              />
            </View>
          </Pressable>
        ) : null}
      </>
    );
  }

  // if there are no results to display, explain the user why
  if (filteredProjectsList.length === 0) {
    if (favoriteProjects.length === 0 && onlyShowFavorites) {
      return (
        <>
          {header}
          <BigInfoBlock title={t('noFavoritesSet')} icon={['fad', 'info-circle']} type="error" />
        </>
      );
    }

    // finish with a generic 'no results' InfoBlock
    return (
      <>
        {header}
        <BigInfoBlock
          title={t('noSearchResults')}
          icon={['fad', 'exclamation-square']}
          type="error"
        />
      </>
    );
  }

  return (
    <>
      {header}
      {filteredProjectsList.length > 0 ? (
        <FlashList
          showsVerticalScrollIndicator
          showsHorizontalScrollIndicator={false}
          data={Object.keys(filteredProjectsList).map(Number)}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListFooterComponent={footer}
          extraData={selectedId}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          estimatedItemSize={itemHeight}
        />
      ) : (
        <BigInfoBlock
          title={t('noSearchResults')}
          icon={['fad', 'exclamation-square']}
          type="error"
        />
      )}
    </>
  );
};
