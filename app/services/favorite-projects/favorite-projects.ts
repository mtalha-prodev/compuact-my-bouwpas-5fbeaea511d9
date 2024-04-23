import AsyncStorage from '@react-native-async-storage/async-storage';
// Helper function to get favorites from local storage
const getFavoritesFromLocalStorage = async (key: string) => {
  try {
    const favoritesJson = await AsyncStorage.getItem(key);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error(`Error getting favorites (${key}) from local storage:`, error);
    return [];
  }
};

// Helper function to update favorites in local storage
const updateFavoritesInLocalStorage = async (
  key: string,
  projectId: number,
  isFavorite: boolean,
) => {
  try {
    const favorites = await getFavoritesFromLocalStorage(key);
    if (isFavorite && !favorites.includes(projectId)) {
      favorites.push(projectId);
    } else {
      const index = favorites.indexOf(projectId);
      if (index !== -1) {
        favorites.splice(index, 1);
      }
    }
    await AsyncStorage.setItem(key, JSON.stringify(favorites));
  } catch (error) {
    console.error(`Error updating favorites (${key}) in local storage:`, error);
  }
};

export { getFavoritesFromLocalStorage, updateFavoritesInLocalStorage };
