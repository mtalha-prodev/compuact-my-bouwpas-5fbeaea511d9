import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';

import { IFavoriteToggleProps } from './favorite-toggle.types';
import { FontAwesomeIcon } from '../font-awesome-icon';

export const FavoriteToggle: FC<IFavoriteToggleProps> = ({
  id,
  currentIsFavorite,
  favoritesKey,
  favoritesList,
  handler,
}) => {
  return (
    <TouchableOpacity onPress={() => handler(id, !currentIsFavorite, favoritesKey)}>
      <FontAwesomeIcon
        icon={currentIsFavorite ? ['fas', 'star'] : ['fal', 'star']}
        size={25}
        colors={currentIsFavorite ? ['bp-accent', 'bp-accent'] : ['bp-white', 'bp-white']}
      />
    </TouchableOpacity>
  );
};
