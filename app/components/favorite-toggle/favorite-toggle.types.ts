export interface IFavoriteToggleProps {
  id: number;
  currentIsFavorite: boolean;
  favoritesKey: 'favoriteProjects' | 'favoriteLiteProjects';
  favoritesList: number[];
  handler: any;
}
