import { useNavigation } from '@react-navigation/core';
import { FontAwesomeIcon } from 'app/components';
import { Pressable } from 'app/components/pressable/pressable';
import { Text } from 'app/components/text/text';
import { useApiCallStatus, useOnsiteProjectWarnings } from 'app/hooks';
import { SignedInUser } from 'app/navigation/route-names';
import { pickColor, pickColorSingleShade } from 'app/theme/native-base/pick-color';
import React, { FC } from 'react';
import { View, ActivityIndicator } from 'react-native';

export const OnsiteWarnings: FC<{ projectId: number }> = ({ projectId }) => {
  const navigation = useNavigation();

  const { data: projectWarnings, status, error } = useOnsiteProjectWarnings(projectId);

  const { showLoading, showData, showError } = useApiCallStatus(status);

  const openWarningsList = () => {
    if (showData && projectWarnings) {
      navigation.navigate(SignedInUser.GATEKEEPER_ONSITE_WARNINGS_LIST, { projectId });
    }
  };

  return (
    <Pressable
      style={{
        marginBottom: 4,
        flex: 1,
      }}
      onPress={openWarningsList}
    >
      <View
        style={{
          backgroundColor: pickColor({ name: 'bp-support', shade: 100 }),
          borderRadius: 16,
          padding: 16,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 6,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {showLoading && (
            <ActivityIndicator size="small" color={pickColorSingleShade({ name: 'bp-white' })} />
          )}

          {showData && projectWarnings && (
            <Text
              style={{
                color: pickColorSingleShade({ name: 'bp-white' }),
                fontSize: 20,
                fontFamily: 'interstate',
              }}
            >
              {projectWarnings.length}
            </Text>
          )}

          {showError && error && (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesomeIcon
                icon={['fas', 'exclamation-square']}
                size={32}
                colors={['bp-cancel', 'bp-cancel']}
                colorsLevel={['500', '500']}
              />
              {error.errorStatus && (
                <Text style={{ color: pickColorSingleShade({ name: 'bp-white' }) }}>
                  {error.errorStatus}
                </Text>
              )}
            </View>
          )}

          <FontAwesomeIcon
            icon={['fas', 'exclamation-triangle']}
            size={32}
            colors={['bp-white', 'bp-white']}
            colorsLevel={['500', '500']}
          />
        </View>
        <Text
          style={{
            color: pickColorSingleShade({ name: 'bp-white' }),
            fontSize: 20,
            fontFamily: 'interstate',
          }}
        >
          Warnings
        </Text>
      </View>
    </Pressable>
  );
};
