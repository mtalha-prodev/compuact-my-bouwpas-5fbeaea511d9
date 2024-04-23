import { ListRenderItem, FlashList } from '@shopify/flash-list';
import { FilterHeading } from 'app/components/onsite-filter/filter-header';
import { SwipeComponent } from 'app/components/onsite-filter/swipe-component';
import { groupWorkersByCoaname, groupWorkersByZone } from 'app/hooks';
import { TOnsiteWorkers, TOnsiteWorkersList } from 'app/models';
import { useStore } from 'app/store/main-store/main-store';
import { mainColors } from 'app/theme/native-base/main-colors';
import { AppStyles } from 'app/theme/style/AppStyles';
import { getResponsiveWidth } from 'app/theme/style/ResponsiveUtils';
import React from 'react';
import { View, RefreshControl } from 'react-native';

import { SwipeTour } from './swipe-tour';

export const FilterComponent = ({
  data,
  type,
  projectId,
  accountId,
  refreshing,
  onRefresh,
  showCheckOut,
  userCanSwipe
}: {
  data: TOnsiteWorkersList;
  type: string;
  projectId: number;
  accountId: number | undefined;
  refreshing: boolean;
  onRefresh: any;
  showCheckOut: boolean;
  userCanSwipe: boolean;
}) => {
  const responsiveWidth = getResponsiveWidth();
  const [rawData, setRawData] = React.useState<TOnsiteWorkers[]>(data);
  React.useEffect(() => {
    setRawData(data);
  }, [refreshing]);
  let groupedData: { filterName: string; workers: TOnsiteWorkersList }[] = [];
  //filter the data by type
  if (type === 'groupByCoaname') {
    groupedData = groupWorkersByCoaname(rawData);
  } else if (type === 'groupByZone') {
    groupedData = groupWorkersByZone(rawData);
  } else {
    groupedData = [
      {
        filterName: 'All',
        workers: rawData,
      },
    ];
  }
  const [updatedGroupedData, setUpdatedGroupedData] = React.useState<
    { filterName: string; workers: TOnsiteWorkersList }[]
  >([]);
  const [reRender, setReRender] = React.useState(false);
  const toggleRender = () => {
    setReRender(!reRender);
  };

  //update the list rendered by FlashList everytime on refresh and when filter changes
  React.useEffect(() => {
    setUpdatedGroupedData(groupedData);
  }, [type]);
  const showSwipeTour = useStore.useShowSwipeTour();
  const removeItem = (itemworkerid: number) => {
    setUpdatedGroupedData(
      groupedData.map(group => {
        return {
          ...group,
          workers: group.workers.filter(worker => worker.workerid !== itemworkerid),
        };
      }),
    );
    setRawData(rawData.filter(worker => worker.workerid !== itemworkerid));
    //reRender state toggles each time we remove an item to be able to re-render the updated flashlist
    toggleRender();
  };
  const renderGroup: ListRenderItem<number> = ({ item }) => {
    if (!updatedGroupedData?.[item]) {
      return null;
    }
    const group: { filterName: string; workers: TOnsiteWorkersList } = updatedGroupedData[item];
    const renderWorker: ListRenderItem<number> = ({ item, index }) => {
      if (!group.workers?.[item]) {
        return null;
      }
      const worker: TOnsiteWorkers = group.workers[item];
      return (
        <View key={worker.workerid + worker.loghappenedwhen}>
          <SwipeComponent
            indexKey={index}
            worker={worker}
            removeItem={(itemId: number) => {
              removeItem(worker.workerid);
            }}
            companyName={worker.companyname}
            projectId={projectId}
            accountId={accountId}
            showCheckOut={showCheckOut}
            userCanSwipe={userCanSwipe}
          />
          <View key={`${group.filterName}${index}`} style={{ backgroundColor: 'white' }}>
            {index !== group.workers.length - 1 && <View style={[AppStyles.dividerNoMargin]} />}
          </View>
        </View>
      );
    };

    return (
      <View key={group.filterName}>
        {type !== 'doNotGroup' && <FilterHeading title={group.filterName} />}
        <View style={{ minHeight: 20, paddingHorizontal: 0, backgroundColor: 'white' }}>
          {group.workers && (
            <FlashList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={Object.keys(group.workers).map(Number)}
              renderItem={renderWorker}
              keyExtractor={item => String(item)}
              estimatedItemSize={85}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        AppStyles.responsiveWidthBox,
        { width: responsiveWidth, minHeight: 800, backgroundColor: mainColors({ type: 'bg' }) },
      ]}
    >
      {updatedGroupedData && (
        <FlashList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={Object.keys(updatedGroupedData).map(Number)}
          renderItem={renderGroup}
          estimatedItemSize={type === 'doNotGroup' ? 5000 : 300}
          keyExtractor={item => String(item)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          extraData={reRender}
          ListFooterComponent={<View style={{ minHeight: 100 }} />}
          ListHeaderComponent={showSwipeTour ? <SwipeTour /> : undefined}
        />
      )}
    </View>
  );
};
