import { useNavigation } from '@react-navigation/core';
import { ListRenderItem, FlashList } from '@shopify/flash-list';
import { TLiteProjectsList } from 'app/Types/liteprojects.types';
import { BigInfoBlock, FontAwesomeIcon, InfoBlock } from 'app/components';
import { SearchBar } from 'app/components/searchbar/searchbar';
import { LocalizationContext } from 'app/contexts';
import { useLiteProjectsList } from 'app/hooks';
import { getFavoritesFromLocalStorage } from 'app/services/favorite-projects';
import { pickColor } from 'app/theme/native-base/pick-color';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React, { createRef, useContext, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Sentry from 'sentry-expo';

import { LiteProjectListItem } from './lite-projects-list-item';

export const LiteProjectsListBody = () => {
  const { t } = useContext(LocalizationContext);
  const navigation = useNavigation();
  const responsiveWidth = getResponsiveWidth();
  const itemHeight = 75;
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

  // get the lite projects list
  const {
    data: projectsList,
    error: projectsListError,
    refetch: refetchProjectsList,
  } = useLiteProjectsList();

  const [onlyShowFavorites, setOnlyShowFavorites] = React.useState<boolean>(false);

  // get the projects that the user has marked as favorite
  const [favoriteProjects, setFavoriteProjects] = React.useState<number[]>([]);

  async function loadFavorites() {
    await getFavoritesFromLocalStorage('favoriteLiteProjects').then(setFavoriteProjects);
  }

  const toggleOnlyShowFavorites = (toggle: boolean) => {
    setOnlyShowFavorites(toggle);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchProjectsList();
      await loadFavorites();
    } catch (error) {
      Sentry.Native.captureException(error);
    }
    setRefreshing(false);
  };

  let filteredProjectsList: TLiteProjectsList | null = null;
  if (projectsList) {
    // first, we apply the favorites filter if it's enabled
    if (onlyShowFavorites) {
      filteredProjectsList = projectsList.filter(project => {
        return favoriteProjects.includes(project.liteProjectId);
      });
    } else {
      filteredProjectsList = projectsList;
    }

    // then we apply the search filter if the user is searching
    if (searchActive && filteredProjectsList) {
      const trimmedSearchFilter = searchFilter.trim();
      filteredProjectsList = filteredProjectsList.filter(project => {
        return (
          project.visitingCity?.toLowerCase().includes(trimmedSearchFilter.toLowerCase()) ||
          project.projectName.toLowerCase().includes(trimmedSearchFilter.toLowerCase()) ||
          project.projectNumber.toLowerCase().includes(trimmedSearchFilter.toLowerCase())
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

    return project ? (
      <LiteProjectListItem
        project={project}
        subtitle={
          project.projectNumber + ' - ' + project.contractorName + ' (' + project.contractorId + ')'
        }
        onPress={() => setSelectedId(index)}
        index={index}
      />
    ) : null;
  };
  const keyExtractor = (item: number, index: number) => String(index);

  // reusable const which contains the header part
  const header = (
    <View
      style={[
        AppStyles.responsiveWidthBox,
        {
          width: responsiveWidth,
          flexDirection: 'row',
          justifyContent: 'center',
          paddingHorizontal: 1,
          paddingVertical: 10,
        },
      ]}
    >
      <View
        style={{
          flex: 1,
          marginHorizontal: 10,
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
              colors={onlyShowFavorites ? ['bp-accent', 'bp-accent'] : ['bp-primary', 'bp-primary']}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  // return an info block informing the user that there has been an error
  if (projectsListError) {
    return (
      <>
        {header}
        {projectsListError ? (
          <View style={{ padding: 0, marginTop: 40, marginBottom: 40 }}>
            <InfoBlock
              title={t('errorProjectsList')}
              icon={['fad', 'exclamation-square']}
              type="error"
              apiError={projectsListError ?? null}
            />
          </View>
        ) : null}
      </>
    );
  }

  // if there are no results to display, explain the user why
  if (filteredProjectsList && filteredProjectsList.length === 0) {
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
  if (filteredProjectsList) {
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
  }
};
